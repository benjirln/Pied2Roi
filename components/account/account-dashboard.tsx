import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Check, X } from "lucide-react";
import type { SessionUser } from "@/lib/auth/session";
import type { OrderView } from "@/lib/orders/queries";
import { ROLE_LABELS } from "@/lib/auth/roles";
import {
  ORDER_FLOW,
  ORDER_STATUS_LABEL,
  statusBadgeClass,
} from "@/lib/orders/status";

function euros(cents: number) {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

// Frise de suivi : Confirmée → En préparation → Expédiée → Livrée.
function OrderTracker({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <X className="h-4 w-4" /> Commande annulée
      </div>
    );
  }
  const currentIndex = ORDER_FLOW.indexOf(status as (typeof ORDER_FLOW)[number]);
  return (
    <div className="flex items-center">
      {ORDER_FLOW.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${
                  done
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="mt-1 text-[10px] text-muted-foreground whitespace-nowrap">
                {ORDER_STATUS_LABEL[step]}
              </span>
            </div>
            {i < ORDER_FLOW.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 mb-4 ${
                  i < currentIndex ? "bg-accent" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AccountDashboard({
  user,
  orders,
}: {
  user: SessionUser;
  orders: OrderView[];
}) {
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Statistiques réelles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {orders.length}
            </div>
            <p className="text-sm text-muted-foreground">Total de vos achats</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Total dépensé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {euros(totalSpent)}
            </div>
            <p className="text-sm text-muted-foreground">Cumul de vos commandes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Profil</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {user.first_name} {user.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">
              {ROLE_LABELS[user.role]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Historique des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Mes commandes</CardTitle>
          <CardDescription>
            Historique et suivi de vos achats
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore passé de commande.
              </p>
              <Button asChild>
                <Link href="/category/all">Découvrir les sneakers</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Commande #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{euros(order.total)}</p>
                      <Badge className={statusBadgeClass(order.status)}>
                        {ORDER_STATUS_LABEL[order.status] ?? order.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="my-5">
                    <OrderTracker status={order.status} />
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.thumbnail_url || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.brand} • {item.color} • Taille {item.size} ×{" "}
                            {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">{euros(item.total_price)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
