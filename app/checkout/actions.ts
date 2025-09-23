"use server";

import { revalidatePath } from "next/cache";
import { v7 } from "uuid";
import { db } from "@/boot/db";
import { requireUser } from "@/lib/auth/guard";
import { simulateEmail } from "@/lib/email/simulate";

export interface PlaceOrderItem {
  variantId: string;
  quantity: number;
}

export interface PlaceOrderResult {
  ok: boolean;
  error?: string;
  orderId?: string;
}

/**
 * Valide le panier, décrémente le stock de façon atomique (anti-survente)
 * et crée la commande. Le paiement est fictif (consigne).
 */
export async function placeOrder(
  items: PlaceOrderItem[],
): Promise<PlaceOrderResult> {
  const user = await requireUser();

  const cleaned = items
    .map((i) => ({
      variantId: i.variantId,
      quantity: Math.max(1, Math.floor(Number(i.quantity) || 0)),
    }))
    .filter((i) => i.variantId);

  if (cleaned.length === 0) {
    return { ok: false, error: "Votre panier est vide" };
  }

  try {
    const orderId = await db.transaction().execute(async (trx) => {
      const orderId = v7();
      const now = new Date();
      const orderItems: {
        id: string;
        order_id: string;
        product_variant_id: string;
        quantity: number;
        unit_price: number;
        total_price: number;
      }[] = [];

      for (const item of cleaned) {
        // Prix unitaire + libellé via le produit lié.
        const variant = await trx
          .selectFrom("product_variant")
          .innerJoin("product", "product.id", "product_variant.product_id")
          .where("product_variant.id", "=", item.variantId)
          .select([
            "product.price as price",
            "product.name as name",
            "product_variant.size as size",
          ])
          .executeTakeFirst();

        if (!variant) {
          throw new Error("Un article de votre panier n'existe plus");
        }

        // Décrément conditionnel : ne passe que si le stock est suffisant.
        const res = await trx
          .updateTable("product_variant")
          .set((eb) => ({
            stock_quantity: eb("stock_quantity", "-", item.quantity),
          }))
          .where("id", "=", item.variantId)
          .where("stock_quantity", ">=", item.quantity)
          .executeTakeFirst();

        if (Number(res.numUpdatedRows) === 0) {
          throw new Error(
            `Stock insuffisant pour ${variant.name} (taille ${variant.size})`,
          );
        }

        orderItems.push({
          id: v7(),
          order_id: orderId,
          product_variant_id: item.variantId,
          quantity: item.quantity,
          unit_price: variant.price,
          total_price: variant.price * item.quantity,
        });
      }

      await trx
        .insertInto("order")
        .values({
          id: orderId,
          user_id: user.id,
          status: "confirmed",
          payment_status: "paid",
          created_at: now,
          updated_at: now,
        })
        .execute();

      await trx.insertInto("order_item").values(orderItems).execute();

      return orderId;
    });

    simulateEmail(
      user.email,
      `Confirmation de votre commande #${orderId.slice(0, 8).toUpperCase()}`,
      `Bonjour ${user.first_name}, merci pour votre achat ! Votre commande a bien été enregistrée et est en cours de traitement.`,
    );

    revalidatePath("/", "layout");
    return { ok: true, orderId };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : "La commande a échoué",
    };
  }
}
