import { redirect } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AccountDashboard } from "@/components/account/account-dashboard";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { logoutAction } from "@/app/auth/actions";
import { ROLE_LABELS, canAccessBackOffice } from "@/lib/auth/roles";
import { getUserOrders } from "@/lib/orders/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await getUserOrders(user.id);

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Bonjour {user.first_name} {user.last_name}
          </h1>
          <p className="text-muted-foreground text-sm">
            {user.email} · {ROLE_LABELS[user.role]}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canAccessBackOffice(user.role) && (
            <Button asChild variant="default">
              <Link href="/admin">Back-office</Link>
            </Button>
          )}
          <form action={logoutAction}>
            <Button variant="outline" type="submit">
              Se déconnecter
            </Button>
          </form>
        </div>
      </div>
      <AccountDashboard user={user} orders={orders} />
      <Footer />
    </main>
  );
}
