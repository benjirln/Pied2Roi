import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
        <LoginForm />
      </div>
      <Footer />
    </main>
  )
}
