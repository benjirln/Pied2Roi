"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { AdminOrderView } from "@/lib/orders/admin-queries";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  statusBadgeClass,
} from "@/lib/orders/status";
import { updateOrderStatus } from "@/app/admin/order-actions";

function euros(cents: number) {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export function OrderManager({ orders }: { orders: AdminOrderView[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState<string | null>(null);

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);

  function changeStatus(orderId: string, status: string) {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, status);
      if (!res.ok) {
        window.alert(res.error);
        return;
      }
      router.refresh();
    });
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-xl font-semibold mb-2">Aucune commande</h2>
        <p className="text-muted-foreground">
          Les commandes des clients apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des commandes</h1>
          <p className="text-muted-foreground text-sm">
            {orders.length} commande{orders.length > 1 ? "s" : ""} · chiffre
            d'affaires {euros(revenue)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Commande</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Changer le statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <TableRow>
                  <TableCell>
                    <button
                      onClick={() =>
                        setExpanded(expanded === order.id ? null : order.id)
                      }
                      aria-label="Voir les articles"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {expanded === order.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    #{order.id.slice(0, 8).toUpperCase()}
                    <div className="text-muted-foreground">
                      {order.items.length} article
                      {order.items.length > 1 ? "s" : ""}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customer}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.email}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(order.created_at).toLocaleDateString("fr-FR")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {euros(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadgeClass(order.status)}>
                      {ORDER_STATUS_LABEL[order.status] ?? order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(v) => changeStatus(order.id, v)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="w-44 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {ORDER_STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>

                {expanded === order.id && (
                  <TableRow>
                    <TableCell colSpan={7} className="bg-muted/30">
                      <div className="space-y-2 py-2">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm"
                          >
                            <span>
                              {item.brand} {item.name} — {item.color} · Taille{" "}
                              {item.size} × {item.quantity}
                            </span>
                            <span className="font-medium">
                              {euros(item.total_price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
