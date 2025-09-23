import Link from "next/link";
import { Button } from "@/components/ui/button";
import { requireBackOffice } from "@/lib/auth/guard";
import { logoutAction } from "@/app/auth/actions";
import { ROLE_LABELS, isAdmin } from "@/lib/auth/roles";
import { AdminPanel } from "@/components/admin/admin-panel";
import {
  listAdminProducts,
  getBrandsAndCategories,
} from "@/lib/products/admin-queries";
import { listAllOrders } from "@/lib/orders/admin-queries";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await requireBackOffice();

  const [products, { brands, categories }, orders] = await Promise.all([
    listAdminProducts(),
    getBrandsAndCategories(),
    listAllOrders(),
  ]);

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-background px-6 py-3">
        <Link href="/" className="font-bold">
          Pied2Roi · Back-office
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            {user.first_name} · {ROLE_LABELS[user.role]}
          </span>
          <form action={logoutAction}>
            <Button variant="outline" size="sm" type="submit">
              Se déconnecter
            </Button>
          </form>
        </div>
      </div>

      <AdminPanel
        products={products}
        brands={brands}
        categories={categories}
        orders={orders}
        canDelete={isAdmin(user.role)}
      />
    </main>
  );
}
