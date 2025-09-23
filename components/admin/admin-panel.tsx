"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, ClipboardList } from "lucide-react";
import { ProductManager } from "@/components/admin/product-manager";
import { OrderManager } from "@/components/admin/order-manager";
import type { AdminProductRow } from "@/lib/products/admin-queries";
import type { AdminOrderView } from "@/lib/orders/admin-queries";

interface Option {
  id: string;
  name: string;
}

export function AdminPanel({
  products,
  brands,
  categories,
  orders,
  canDelete,
}: {
  products: AdminProductRow[];
  brands: Option[];
  categories: Option[];
  orders: AdminOrderView[];
  canDelete: boolean;
}) {
  return (
    <Tabs defaultValue="products" className="w-full">
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <TabsList>
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" /> Produits & stock
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ClipboardList className="h-4 w-4" /> Commandes
            <span className="ml-1 text-xs text-muted-foreground">
              ({orders.length})
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="products">
        <ProductManager
          products={products}
          brands={brands}
          categories={categories}
          canDelete={canDelete}
        />
      </TabsContent>

      <TabsContent value="orders">
        <OrderManager orders={orders} />
      </TabsContent>
    </Tabs>
  );
}
