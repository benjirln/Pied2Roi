"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter signup
    setIsSubscribed(true)
    setEmail("")
  }

  return (
    <section className="py-20 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <Mail className="h-16 w-16 mx-auto mb-8 text-accent drop-shadow-lg" />
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Restez Connecté</h2>
        <p className="text-lg md:text-xl mb-10 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
          Soyez les premiers informés des drops exclusifs, des sorties limitées et des offres spéciales. Rejoignez notre
          communauté de passionnés de sneakers.
        </p>

        {isSubscribed ? (
          <div className="bg-accent/20 border-2 border-accent rounded-xl p-8 max-w-md mx-auto shadow-xl backdrop-blur-sm">
            <p className="text-accent font-bold text-lg">Merci pour votre inscription !</p>
            <p className="text-sm text-primary-foreground/80 mt-3">Vous recevrez bientôt nos dernières actualités.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-primary-foreground text-primary border-0 py-4 px-6 text-lg focus-ring shadow-lg"
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-10 py-4 text-lg font-semibold hover-lift focus-ring shadow-xl"
            >
              S'abonner
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
