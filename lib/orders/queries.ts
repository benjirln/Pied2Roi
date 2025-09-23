import { db } from "@/boot/db";

export interface OrderItemView {
  name: string;
  brand: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  thumbnail_url: string | null;
}

export interface OrderView {
  id: string;
  created_at: Date;
  status: string;
  payment_status: string;
  total: number;
  items: OrderItemView[];
}

/** Commandes d'un utilisateur, avec leurs lignes. Vide si aucun achat. */
export async function getUserOrders(userId: string): Promise<OrderView[]> {
  const orders = await db
    .selectFrom("order")
    .where("user_id", "=", userId)
    .select(["id", "created_at", "status", "payment_status"])
    .orderBy("created_at", "desc")
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
