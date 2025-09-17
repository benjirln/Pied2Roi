"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartSidebar } from "@/components/cart/cart-sidebar"
import { cn } from "@/lib/utils"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Hommes", href: "/men" },
    { name: "Femmes", href: "/women" },
    { name: "Nouveautés", href: "/new-arrivals" },
    { name: "Marques", href: "/brands" },
    { name: "Soldes", href: "/sale" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover-lift">
            <span className="text-2xl font-bold tracking-tight hover:text-accent transition-colors duration-200">
              SNEAKR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-10">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-accent transition-all duration-200 px-4 py-3 text-sm font-medium relative group focus-ring rounded-md"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="hidden sm:flex hover-lift focus-ring">
              <Search className="h-5 w-5" />
              <span className="sr-only">Rechercher</span>
            </Button>
            <Link href="/account">
              <Button variant="ghost" size="icon" className="hover-lift focus-ring">
                <User className="h-5 w-5" />
                <span className="sr-only">Compte</span>
              </Button>
            </Link>
            <CartSidebar />

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover-lift focus-ring"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Basculer le menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-80 opacity-100 pb-6" : "max-h-0 opacity-0 overflow-hidden",
          )}
        >
          <div className="px-2 pt-4 space-y-2 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-accent hover:bg-accent/10 block px-4 py-3 text-base font-medium transition-all duration-200 rounded-lg focus-ring"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="ghost" className="w-full justify-start px-4 py-3 sm:hidden hover-lift focus-ring">
              <Search className="h-5 w-5 mr-3" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
