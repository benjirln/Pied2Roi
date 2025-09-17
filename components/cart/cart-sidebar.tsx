"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingBag, Minus, Plus, Trash2, X } from "lucide-react"

const mockCartItems = [
  {
    id: 1,
    brand: "NIKE",
    name: "Air Jordan 1 Retro High",
    price: 180.0,
    size: "42",
    color: "Noir/Blanc",
    quantity: 1,
    image: "/nike-air-jordan-1-sneaker-product-shot.jpg",
  },
  {
    id: 2,
    brand: "ADIDAS ORIGINALS",
    name: "Samba Classic",
    price: 90.0,
    size: "41",
    color: "Noir/Blanc",
    quantity: 2,
    image: "/adidas-samba-sneaker-product-shot.jpg",
  },
]

export function CartSidebar() {
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [isOpen, setIsOpen] = useState(false)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover-lift focus-ring">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg border-2 border-white">
              {itemCount}
            </span>
          )}
          <span className="sr-only">Panier</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Panier ({itemCount})</span>
            <Button variant="secondary" size="icon" onClick={() => setIsOpen(false)} className="hover-lift focus-ring">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Votre panier est vide</h3>
              <p className="text-muted-foreground mb-4">Ajoutez des sneakers pour commencer</p>
              <Button
                onClick={() => setIsOpen(false)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground hover-lift focus-ring"
              >
                Continuer les Achats
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 mx-[15px]">
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={`${item.brand} ${item.name}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.brand} • Taille {item.size}
                        </p>
                        <p className="text-sm font-bold">€{item.price.toFixed(2)}</p>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover-lift focus-ring"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 text-sm font-medium min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover-lift focus-ring"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover-lift focus-ring"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <div className="border-t pt-6 space-y-4 mx-[15px]">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Sous-total</span>
                  <span className="font-bold text-lg">€{subtotal.toFixed(2)}</span>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Frais de port et taxes calculés à la commande
                </p>

                <div className="space-y-3">
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground hover-lift focus-ring py-3 font-semibold">
                      Commander
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full bg-transparent hover-lift focus-ring py-3">
                      Voir le Panier
                    </Button>
                  </Link>
                </div>

                <div className="text-center">
                  <Button
                    variant="ghost"
                    className="text-sm text-muted-foreground hover-lift focus-ring"
                    onClick={() => setIsOpen(false)}
                  >
                    Continuer les Achats
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
