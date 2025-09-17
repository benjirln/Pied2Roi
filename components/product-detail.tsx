"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Share2, Truck, Shield, RotateCcw, Star, ChevronLeft, ChevronRight } from "lucide-react"

// Mock product data - in real app this would come from API
const getProductById = (id: string) => {
  const products = {
    "1": {
      brand: "NIKE",
      name: "Air Jordan 1 Retro High",
      price: "180,00 €",
      images: [
        "/nike-air-jordan-1-sneaker-product-shot.jpg",
        "/nike-air-jordan-1-sneaker-product-shot.jpg",
        "/nike-air-jordan-1-sneaker-product-shot.jpg",
        "/nike-air-jordan-1-sneaker-product-shot.jpg",
      ],
      sizes: [
        "35.5",
        "36",
        "36 2/3",
        "37 1/3",
        "38",
        "38 2/3",
        "39 1/3",
        "40",
        "41 1/3",
        "42",
        "42 2/3",
        "43 1/3",
        "44",
        "44 2/3",
        "45 1/3",
      ],
      colors: [
        { colorName: "BLACK/WHITE", colorUrl: "/product/1?color=black-white" },
        { colorName: "CHICAGO", colorUrl: "/product/1?color=chicago" },
        { colorName: "ROYAL BLUE", colorUrl: "/product/1?color=royal-blue" },
      ],
      description:
        "The Air Jordan 1 Retro High brings back the classic silhouette that started it all. Premium leather upper with iconic colorways that defined basketball culture.",
      features: [
        "Premium leather upper",
        "Air-Sole unit in heel",
        "Rubber outsole with pivot points",
        "Classic high-top silhouette",
        "Iconic Wings logo",
      ],
      inStock: true,
      stockCount: 23,
      rating: 4.8,
      reviewCount: 1247,
    },
    "2": {
      brand: "ADIDAS ORIGINALS",
      name: "Samba Classic",
      price: "125,00 €",
      promotionalPrice: "90,00 €",
      images: [
        "/adidas-samba-sneaker-product-shot.jpg",
        "/adidas-samba-sneaker-product-shot.jpg",
        "/adidas-samba-sneaker-product-shot.jpg",
      ],
      sizes: ["36", "36 2/3", "37 1/3", "38", "38 2/3", "39 1/3", "40", "40 2/3", "41 1/3", "42", "42 2/3", "43 1/3"],
      colors: [
        { colorName: "BLACK/WHITE", colorUrl: "/product/2?color=black-white" },
        { colorName: "WHITE/GREEN", colorUrl: "/product/2?color=white-green" },
        { colorName: "NAVY/WHITE", colorUrl: "/product/2?color=navy-white" },
      ],
      description:
        "The adidas Samba is a timeless classic. Originally designed for indoor soccer, it has become a street style icon with its distinctive gum sole and three stripes.",
      features: [
        "Leather upper with suede overlays",
        "Gum rubber outsole",
        "Three Stripes branding",
        "Low-profile silhouette",
        "Indoor soccer heritage",
      ],
      inStock: true,
      stockCount: 15,
      rating: 4.6,
      reviewCount: 892,
    },
  }

  return products[id as keyof typeof products] || products["1"]
}

export function ProductDetail({ productId }: { productId: string }) {
  const product = getProductById(productId)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }
    // Add to cart logic here
    console.log("Added to cart:", {
      product: product.name,
      size: selectedSize,
      color: selectedColor.colorName,
      quantity,
    })
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-accent">
            Products
          </Link>
          <span>/</span>
          <span className="text-foreground">
            {product.brand} {product.name}
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
            <Image
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={`${product.brand} ${product.name}`}
              fill
              className="object-cover"
              priority
            />
            {product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="flex gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  selectedImageIndex === index ? "border-accent" : "border-transparent"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {product.promotionalPrice ? (
                  <>
                    <span className="text-3xl font-bold text-accent">{product.promotionalPrice}</span>
                    <span className="text-xl text-muted-foreground line-through">{product.price}</span>
                    <Badge variant="destructive">SALE</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold">{product.price}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Color: {selectedColor.colorName}</h3>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.colorName}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    selectedColor.colorName === color.colorName
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color.colorName}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Size</h3>
              <Link href="/size-guide" className="text-sm text-accent hover:underline">
                Size Guide
              </Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`py-3 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSize === size
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm">
              {product.inStock ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
            </span>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="outline" className="w-full bg-transparent" size="lg">
              Buy Now
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Free Shipping</p>
              <p className="text-xs text-muted-foreground">Orders over €100</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Free Returns</p>
              <p className="text-xs text-muted-foreground">30 days</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Authenticity</p>
              <p className="text-xs text-muted-foreground">Guaranteed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="sizing">Sizing Guide</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            <TabsTrigger value="styling">Styling Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Product Details</h3>
              <p className="text-muted-foreground mb-6">{product.description}</p>
              <h4 className="font-semibold mb-3">Features:</h4>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="sizing" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Size Guide</h3>
              <p className="text-muted-foreground mb-4">Find your perfect fit with our comprehensive size guide.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">EU Size</th>
                      <th className="text-left py-2">US Size</th>
                      <th className="text-left py-2">UK Size</th>
                      <th className="text-left py-2">Foot Length (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">40</td>
                      <td className="py-2">7</td>
                      <td className="py-2">6</td>
                      <td className="py-2">25.0</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">41</td>
                      <td className="py-2">8</td>
                      <td className="py-2">7</td>
                      <td className="py-2">25.5</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">42</td>
                      <td className="py-2">9</td>
                      <td className="py-2">8</td>
                      <td className="py-2">26.0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Customer Reviews</h3>
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <span className="font-medium">Amazing quality!</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">by John D. • Verified Purchase</p>
                  <p className="text-sm">
                    Perfect fit and excellent build quality. Exactly what I expected from this brand.
                  </p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(4)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                      <Star className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium">Great sneakers</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">by Sarah M. • Verified Purchase</p>
                  <p className="text-sm">Love the style and comfort. Runs slightly large, so consider sizing down.</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="styling" className="mt-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Styling Tips</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Casual Look</h4>
                  <p className="text-sm text-muted-foreground">
                    Pair with slim-fit jeans and a basic tee for an effortless everyday style.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Street Style</h4>
                  <p className="text-sm text-muted-foreground">
                    Combine with joggers and an oversized hoodie for that perfect streetwear aesthetic.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Smart Casual</h4>
                  <p className="text-sm text-muted-foreground">
                    Dress up with chinos and a button-down shirt for a refined yet relaxed look.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
