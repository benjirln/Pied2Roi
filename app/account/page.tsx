import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AccountDashboard } from "@/components/account/account-dashboard"

export default function AccountPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <AccountDashboard />
      <Footer />
    </main>
  )
}
