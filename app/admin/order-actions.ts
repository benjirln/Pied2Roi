"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/boot/db";
import { requireBackOffice } from "@/lib/auth/guard";
import {
  ORDER_STATUS_LABEL,
  isValidStatus,
  type OrderStatus,
} from "@/lib/orders/status";
import { simulateEmail } from "@/lib/email/simulate";

export interface OrderActionResult {
  ok: boolean;
  error?: string;
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<OrderActionResult> {
  await requireBackOffice();

  if (!isValidStatus(status)) {
    return { ok: false, error: "Statut invalide" };
  }
  const newStatus = status as OrderStatus;

  const order = await db
    .selectFrom("order")
    .innerJoin("user", "user.id", "order.user_id")
    .where("order.id", "=", orderId)
    .select([
      "order.status as status",
      "user.email as email",
      "user.first_name as first_name",
    ])
    .executeTakeFirst();

  if (!order) {
    return { ok: false, error: "Commande introuvable" };
  }
  if (order.status === newStatus) {
    return { ok: true };
  }

  await db.transaction().execute(async (trx) => {
    // Annulation : on remet le stock des articles en rayon.
    if (newStatus === "cancelled" && order.status !== "cancelled") {
      const items = await trx
        .selectFrom("order_item")
        .where("order_id", "=", orderId)
        .select(["product_variant_id", "quantity"])
        .execute();

      for (const item of items) {
        await trx
          .updateTable("product_variant")
          .set((eb) => ({
            stock_quantity: eb("stock_quantity", "+", item.quantity),
          }))
          .where("id", "=", item.product_variant_id)
          .execute();
      }
    }

    await trx
      .updateTable("order")
      .set({ status: newStatus, updated_at: new Date() })
      .where("id", "=", orderId)
      .execute();
  });

  simulateEmail(
    order.email,
    `Mise à jour de votre commande #${orderId.slice(0, 8).toUpperCase()}`,
    `Bonjour ${order.first_name}, le statut de votre commande est désormais : ${ORDER_STATUS_LABEL[newStatus]}.`,
  );

  revalidatePath("/", "layout");
  return { ok: true };
}
