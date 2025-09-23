"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Grid, List } from "lucide-react";
import { Brand, Category, Product } from "kysely-codegen";
import { useRouter, useSearchParams } from "next/navigation";
import { useNavigation } from "react-day-picker";

interface ProductCatalogProps {
  products: Product[];
  brands: Brand[];
  categories: Category[];
  slug: string;
}

export function ProductCatalog({
  products,
  brands,
  slug,
  categories,
}: ProductCatalogProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const brandId = searchParams.get("brand");

  const onBrandChange = useCallback((brandId: string | undefined) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (!brandId) {
      newSearchParams.delete("brand");
    } else {
      newSearchParams.set("brand", brandId);
    }
    router.push(`/category/${slug}?${newSearchParams.toString()}`);
  }, []);

  const onCategoryChange = useCallback((category: string) => {
    router.push(`/category/${category}?${searchParams.toString()}`);
  }, []);

  const brandDict = useMemo(
    () =>
      brands.reduce<Record<string, Brand>>((acc, brand) => {
        acc[brand.id] = brand;
        return acc;
      }, {}),
    [],
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">All Sneakers</h1>
        <p className="text-muted-foreground text-lg">
          Discover our complete collection of premium sneakers from the world's
          top brands
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
            <Select value={brandId ?? "none"} onValueChange={onBrandChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  All brands
                </SelectItem>

                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select value={slug} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" key="all">
                  Tout
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.slug} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select>
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
          Showing {products.length} products
        </p>
        <div className="flex gap-2">
          {brandId && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={() => onBrandChange(undefined)}
            >
              {brandDict[brandId]?.name ?? "Unknown Brand"} ×
            </Badge>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }
      >
        {products.map((product) => (
          <Card
            key={product.id}
            className={`group overflow-hidden border-0 shadow-sm hover:shadow-xl transition-all duration-300 ${viewMode === "list" ? "flex" : ""}`}
          >
            <Link href={`/product/${product.id}`}>
              <div
                className={`relative overflow-hidden ${viewMode === "list" ? "w-48 h-48 flex-shrink-0" : "aspect-square"}`}
              >
                <ProductImage
                  src={product.thumbnail_url}
                  alt={`${product.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <p className="text-sm font-medium text-muted-foreground mb-1 tracking-wide">
                  {brandDict[product?.brand_id]?.name ?? "Unknown Brand"}
                </p>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold">
                    {(product.price / 100)
                      .toFixed(2)
                      .toString()
                      .replace(".", ",")}
                    €
                  </span>
                </div>
                {/*{viewMode === "list" && (*/}
                {/*  <div className="space-y-2">*/}
                {/*    <p className="text-sm text-muted-foreground">*/}
                {/*      Colors: {product.colors.slice(0, 2).join(", ")}*/}
                {/*      {product.colors.length > 2 &&*/}
                {/*        ` +${product.colors.length - 2} more`}*/}
                {/*    </p>*/}
                {/*    <p className="text-sm text-muted-foreground">*/}
                {/*      Sizes: {product.sizes.slice(0, 4).join(", ")}*/}
                {/*      {product.sizes.length > 4 &&*/}
                {/*        ` +${product.sizes.length - 4} more`}*/}
                {/*    </p>*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">
            No products found matching your criteria
          </p>
          <Button onClick={() => {}}>Clear All Filters</Button>
        </div>
      )}
    </div>
  );
}
