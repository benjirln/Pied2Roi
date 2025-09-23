export const ORDER_STATUSES = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmée",
  preparing: "En préparation",
  shipped: "Expédiée",
  delivered: "Livrée",
  cancelled: "Annulée",
};

// Étapes du suivi client (hors « annulée »).
export const ORDER_FLOW: OrderStatus[] = [
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

export function statusBadgeClass(status: string): string {
  switch (status) {
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-amber-100 text-amber-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function isValidStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}
