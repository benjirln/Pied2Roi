"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List } from "lucide-react"

const allProducts = [
  {
    id: 1,
    brand: "NIKE",
    name: "Air Jordan 1 Retro High",
    price: "180,00 €",
    image: "/nike-air-jordan-1-sneaker-product-shot.jpg",
    category: "basketball",
    gender: "unisex",
    isNew: true,
    colors: ["Black/White", "Chicago", "Royal Blue"],
    sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
  },
  {
    id: 2,
    brand: "ADIDAS ORIGINALS",
    name: "Samba Classic",
    price: "125,00 €",
    promotionalPrice: "90,00 €",
    image: "/adidas-samba-sneaker-product-shot.jpg",
    category: "lifestyle",
    gender: "unisex",
    isNew: false,
    colors: ["Black/White", "White/Green", "Navy/White"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43"],
  },
  {
    id: 3,
    brand: "NEW BALANCE",
    name: "990v5 Made in USA",
    price: "220,00 €",
    image: "/new-balance-990v5-sneaker-product-shot.jpg",
    category: "running",
    gender: "unisex",
    isNew: true,
    colors: ["Grey", "Navy", "Black"],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
  },
  {
    id: 4,
    brand: "VANS",
    name: "Old Skool Classic",
    price: "75,00 €",
    image: "/vans-old-skool-sneaker-product-shot.jpg",
    category: "skate",
    gender: "unisex",
    isNew: false,
    colors: ["Black/White", "Navy/White", "Burgundy"],
    sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"],
  },
  {
    id: 5,
    brand: "CONVERSE",
    name: "Chuck Taylor All Star",
    price: "65,00 €",
    image: "/converse-chuck-taylor-sneaker-product-shot.jpg",
    category: "lifestyle",
    gender: "unisex",
    isNew: false,
    colors: ["Black", "White", "Red", "Navy"],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43"],
  },
  {
    id: 6,
    brand: "PUMA",
    name: "Suede Classic XXI",
    price: "95,00 €",
    image: "/puma-suede-classic-sneaker-product-shot.jpg",
    category: "lifestyle",
    gender: "unisex",
    isNew: true,
    colors: ["Blue/White", "Red/White", "Black/White"],
    sizes: ["37", "38", "39", "40", "41", "42", "43", "44"],
  },
]

export function ProductCatalog() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBrand, setSelectedBrand] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const brands = ["all", ...Array.from(new Set(allProducts.map((p) => p.brand)))]
  const categories = ["all", ...Array.from(new Set(allProducts.map((p) => p.category)))]
  const genders = ["all", "men", "women", "unisex"]

  const filteredProducts = allProducts
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesGender = selectedGender === "all" || product.gender === selectedGender

      return matchesSearch && matchesBrand && matchesCategory && matchesGender
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number.parseFloat(a.promotionalPrice || a.price) - Number.parseFloat(b.promotionalPrice || b.price)
        case "price-high":
          return Number.parseFloat(b.promotionalPrice || b.price) - Number.parseFloat(a.promotionalPrice || a.price)
        case "name":
          return a.name.localeCompare(b.name)
        case "newest":
        default:
          return b.isNew ? 1 : -1
      }
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Sneakers</h1>
        <p className="text-muted-foreground text-lg">
          Discover our complete collection of premium sneakers from the world's top brands
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-card rounded-lg p-6 mb-8 border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sneakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Brand</label>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand === "all" ? "All Brands" : brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div>
            <label className="text-sm font-medium mb-2 block">View</label>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Showing {filteredProducts.length} of {allProducts.length} products
        </p>
        <div className="flex gap-2">
          {selectedBrand !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedBrand("all")}>
              {selectedBrand} ×
            </Badge>
          )}
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
              {selectedCategory} ×
            </Badge>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
        }
      >
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={`group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 ${viewMode === "list" ? "flex" : ""}`}
          >
            <Link href={`/product/${product.id}`}>
              <div
                className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"}`}
              >
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.isNew && (
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-sm font-medium rounded-full">
                    NEW
                  </div>
                )}
                {product.promotionalPrice && (
                  <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 text-sm font-medium rounded-full">
                    SALE
                  </div>
                )}
              </div>

              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <p className="text-sm font-medium text-muted-foreground mb-1 tracking-wide">{product.brand}</p>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  {product.promotionalPrice ? (
                    <>
                      <span className="text-lg font-bold text-accent">{product.promotionalPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">{product.price}</span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{product.price}</span>
                  )}
                </div>
                {viewMode === "list" && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Colors: {product.colors.slice(0, 2).join(", ")}
                      {product.colors.length > 2 && ` +${product.colors.length - 2} more`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sizes: {product.sizes.slice(0, 4).join(", ")}
                      {product.sizes.length > 4 && ` +${product.sizes.length - 4} more`}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setSelectedBrand("all")
              setSelectedCategory("all")
              setSelectedGender("all")
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
