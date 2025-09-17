"use client"

import Image from "next/image"
import { ProductCatalog } from "./product-catalog"

interface CategoryPageProps {
  category: string
  title: string
  description: string
  heroImage: string
}

export function CategoryPage({ category, title, description, heroImage }: CategoryPageProps) {
  return (
    <div>
      {/* Category Hero */}
      <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={heroImage || "/placeholder.svg"} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">{title}</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">{description}</p>
        </div>
      </section>

      {/* Product Catalog */}
      <ProductCatalog />
    </div>
  )
}
