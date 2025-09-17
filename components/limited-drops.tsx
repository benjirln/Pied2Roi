"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const limitedDrops = [
  {
    id: 1,
    brand: "JORDAN",
    name: "Air Jordan 4 'Black Cat'",
    price: "210,00 €",
    image: "/air-jordan-4-black-cat-limited-edition-sneaker.jpg",
    releaseDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    stock: 150,
  },
  {
    id: 2,
    brand: "YEEZY",
    name: "Yeezy Boost 350 V2",
    price: "250,00 €",
    image: "/yeezy-boost-350-v2-limited-edition-sneaker.jpg",
    releaseDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    stock: 89,
  },
  {
    id: 3,
    brand: "OFF-WHITE",
    name: "Off-White x Nike Dunk Low",
    price: "320,00 €",
    image: "/off-white-nike-dunk-low-collaboration-sneaker.jpg",
    releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    stock: 45,
  },
]

const timeLabels = {
  days: "jours",
  hours: "heures",
  minutes: "min",
  seconds: "sec",
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-3 justify-center">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-primary text-primary-foreground rounded-xl p-3 min-w-[60px] shadow-lg">
            <span className="text-2xl font-bold tabular-nums">{value.toString().padStart(2, "0")}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-2 block font-medium">
            {timeLabels[unit as keyof typeof timeLabels]}
          </span>
        </div>
      ))}
    </div>
  )
}

export function LimitedDrops() {
  return (
    <section className="py-20 bg-gradient-to-b from-card/30 to-card/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Drops Limités</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Sorties exclusives disponibles pour une durée limitée. Ne manquez pas ces trouvailles rares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {limitedDrops.map((drop) => (
            <Card
              key={drop.id}
              className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover-lift bg-card/80 backdrop-blur-sm"
            >
              <div className="relative aspect-square">
                <Image
                  src={drop.image || "/placeholder.svg"}
                  alt={`${drop.brand} ${drop.name}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-4 py-2 text-sm font-bold rounded-full shadow-lg">
                  LIMITÉ
                </div>
                <div className="absolute top-4 right-4 bg-black/90 text-white px-4 py-2 text-sm font-bold rounded-full backdrop-blur-sm">
                  {drop.stock} restants
                </div>
              </div>

              <div className="p-8">
                <p className="text-sm font-bold text-muted-foreground mb-2 tracking-wider">{drop.brand}</p>
                <h3 className="font-bold text-xl mb-4 leading-tight">{drop.name}</h3>
                <p className="text-2xl font-bold mb-6 text-accent">{drop.price}</p>

                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-4 font-medium">Sortie dans :</p>
                  <CountdownTimer targetDate={drop.releaseDate} />
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 hover-lift focus-ring shadow-lg">
                  Me Notifier
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
