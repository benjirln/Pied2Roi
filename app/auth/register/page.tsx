import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <RegisterForm />
      </div>
      <Footer />
    </main>
  )
}
