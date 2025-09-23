"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Product, ProductImage as ProductImageRow } from "kysely-codegen";
import { BetterProductVariant } from "@/app/product/[id]/page";
import { v7 } from "uuid";
import { pushCartItem } from "@/lib/updateCartItems";

interface ProductDetailProps {
  product: Product;
  variants: BetterProductVariant[];
  images: ProductImageRow[];
  brand: string;
}

const DEFAULT_SIZE: BetterProductVariant["sizes"][number] = {
  size: "00",
  quantity: 0,
  id: v7(),
};

export function ProductDetail({
  product,
  variants,
  images,
  brand,
}: ProductDetailProps) {
  const [selectedColor, setSelectedColor] = useState(variants[0]?.color);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const sizes = useMemo(() => {
    const variant = variants.find((variant) => variant.color === selectedColor);
    return variant?.sizes ?? [];
  }, [variants, selectedColor]);

  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? DEFAULT_SIZE);

  const handleAddToCart = () => {
    pushCartItem({
      id: selectedSize.id,
      size: selectedSize.size,
      quantity: 1,
      brand: brand,
      name: product.name,
      thumbnail_url:
        variants.find((variant) => variant.color === selectedColor)
          ?.thumbnailUrl ?? "/placeholder.svg",
      color: selectedColor,
      price: product.price,
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      const variant = variants.find((variant) => variant.color === color);
      if (!variant) {
        return;
      }

      setSelectedSize(variant.sizes[0] ?? DEFAULT_SIZE);

      const imageIndex = images.findIndex(
        (image) => image.url === variant.thumbnailUrl,
      );

      if (imageIndex !== -1) {
        setSelectedImageIndex(imageIndex);
      }
    },
    [variants, images],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-accent">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/category/all" className="hover:text-accent">
            Produits
          </Link>
          <span>/</span>
          <span className="text-foreground">
            {brand} {product.name}
          </span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-card">
            <ProductImage
              src={images[selectedImageIndex]?.url}
              alt={`${brand} ${product.name}`}
              fill
              className="object-cover"
              priority
            />
            {images.length > 1 && (
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
            {images.map((image, index) => (
              <button
                key={index}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  selectedImageIndex === index
                    ? "border-accent"
                    : "border-transparent"
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <ProductImage
                  src={image.url}
                  alt={`${brand} ${product.name} view ${index + 1}`}
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
            <p className="text-sm font-medium text-muted-foreground mb-2 tracking-wide">
              {brand.toUpperCase()}
            </p>
            <h1 className="text-3xl font-bold mb-4">
              {product.name.toUpperCase()}
            </h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {(product.price / 100)
                    .toFixed(2)
                    .toString()
                    .replace(".", ",")}
                  €
                </span>
              </div>
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-semibold mb-3">Couleur : {selectedColor}</h3>
            <div className="flex gap-2 flex-wrap">
              {variants.map((color) => (
                <button
                  key={color.color}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    selectedColor === color.color
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                  onClick={() => handleColorChange(color.color)}
                >
                  {color.color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Taille</h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  className={`py-3 border rounded-lg text-sm font-medium transition-colors ${
                    selectedSize.id === size.id
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border hover:border-accent"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size.size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${selectedSize.quantity > 0 ? "bg-green-500" : "bg-red-500"}`}
            />
            <span className="text-sm">
              {selectedSize.quantity > 0
                ? `En stock (${selectedSize.quantity} disponibles)`
                : "Rupture de stock"}
            </span>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={selectedSize.quantity <= 0}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                {selectedSize.quantity > 0
                  ? "Ajouter au panier"
                  : "Indisponible"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-500 border-red-500" : ""}
                aria-label="Ajouter aux favoris"
              >
                <Heart
                  className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-border">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Livraison gratuite</p>
              <p className="text-xs text-muted-foreground">Dès 100 €</p>
            </div>
            <div className="text-center">
              <RotateCcw className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Retours gratuits</p>
              <p className="text-xs text-muted-foreground">30 jours</p>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-accent" />
              <p className="text-sm font-medium">Authenticité</p>
              <p className="text-xs text-muted-foreground">Garantie</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description réelle du produit */}
      {product.description && (
        <div className="mt-16">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Description</h3>
            <p className="text-muted-foreground">{product.description}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
