import { db } from "@/boot/db";
import type { OrderItemView } from "@/lib/orders/queries";

export interface AdminOrderView {
  id: string;
  created_at: Date;
  status: string;
  payment_status: string;
  customer: string;
  email: string;
  total: number;
  items: OrderItemView[];
}

/** Toutes les commandes (back-office vendeur/admin), les plus récentes d'abord. */
export async function listAllOrders(): Promise<AdminOrderView[]> {
  const orders = await db
    .selectFrom("order")
    .innerJoin("user", "user.id", "order.user_id")
    .select([
      "order.id as id",
      "order.created_at as created_at",
      "order.status as status",
      "order.payment_status as payment_status",
      "user.first_name as first_name",
      "user.last_name as last_name",
      "user.email as email",
    ])
    .orderBy("order.created_at", "desc")
    .execute();

  if (orders.length === 0) return [];

  const items = await db
    .selectFrom("order_item")
    .innerJoin(
      "product_variant",
      "product_variant.id",
      "order_item.product_variant_id",
    )
    .innerJoin("product", "product.id", "product_variant.product_id")
    .innerJoin("brand", "brand.id", "product.brand_id")
    .where(
      "order_item.order_id",
      "in",
      orders.map((o) => o.id),
    )
    .select([
      "order_item.order_id as order_id",
      "order_item.quantity as quantity",
      "order_item.unit_price as unit_price",
      "order_item.total_price as total_price",
      "product.name as name",
      "product.thumbnail_url as thumbnail_url",
      "brand.name as brand",
      "product_variant.size as size",
      "product_variant.color as color",
    ])
    .execute();

  return orders.map((o) => {
    const orderItems = items.filter((i) => i.order_id === o.id);
    return {
      id: o.id,
      created_at: o.created_at,
      status: o.status,
      payment_status: o.payment_status,
      customer: `${o.first_name} ${o.last_name}`,
      email: o.email,
      total: orderItems.reduce((s, i) => s + i.total_price, 0),
      items: orderItems.map((i) => ({
        name: i.name,
        brand: i.brand,
        size: i.size,
        color: i.color,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.total_price,
        thumbnail_url: i.thumbnail_url,
      })),
    };
  });
}
