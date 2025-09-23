"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CreditCard,
  Shield,
  Check,
  AlertCircle,
} from "lucide-react";
import type { CartItem } from "@/lib/types/data";
import { updateCartItems } from "@/lib/updateCartItems";
import { placeOrder } from "@/app/checkout/actions";

function euros(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

export function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

  useEffect(() => {
    setCartItems(
      JSON.parse(window.localStorage.getItem("cartItems") || "[]") as CartItem[],
    );
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function handlePay() {
    setError(null);
    startTransition(async () => {
      const res = await placeOrder(
        cartItems.map((i) => ({ variantId: i.id, quantity: i.quantity })),
      );
      if (!res.ok) {
        setError(res.error ?? "La commande a échoué");
        return;
      }
      updateCartItems([]);
      setCartItems([]);
      setOrderId(res.orderId ?? null);
    });
  }

  // Confirmation de commande (simulation d'email incluse).
  if (orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-3">Commande confirmée !</h1>
        <p className="text-muted-foreground mb-2">
          Merci pour votre achat. Votre commande{" "}
          <span className="font-mono font-medium">
            #{orderId.slice(0, 8).toUpperCase()}
          </span>{" "}
          a bien été enregistrée et le stock a été mis à jour.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          📧 Un email de confirmation (simulé) vient de vous être envoyé.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild>
            <Link href="/account">Voir mon compte</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/category/all">Continuer mes achats</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <Button asChild>
          <Link href="/category/all">Découvrir les sneakers</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Paiement</h1>
          <p className="text-muted-foreground">
            Finalisez votre commande (paiement fictif)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Paiement fictif */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Informations de paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              <div>
                <Label htmlFor="cardName">Nom sur la carte</Label>
                <Input
                  id="cardName"
                  placeholder="Camille Client"
                  value={card.name}
                  onChange={(e) => setCard({ ...card, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiration</Label>
                  <Input
                    id="expiry"
                    placeholder="12/28"
                    value={card.expiry}
                    onChange={(e) =>
                      setCard({ ...card, expiry: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value })}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Aucun paiement réel n'est effectué. La commande nécessite d'être
                connecté.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Récapitulatif */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.thumbnail_url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.brand} • {item.color} • Taille {item.size}
                      </p>
                    </div>
                    <div className="text-sm font-medium">
                      {euros(item.price * item.quantity)} €
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{euros(subtotal)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span>Gratuite</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{euros(subtotal)} €</span>
                </div>
              </div>

              <Button
                onClick={handlePay}
                disabled={isPending}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                {isPending
                  ? "Traitement…"
                  : `Payer ${euros(subtotal)} € (fictif)`}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Paiement sécurisé · stock vérifié en temps réel</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
