"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Boxes, Search, AlertCircle } from "lucide-react";
import type { AdminProductRow } from "@/lib/products/admin-queries";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchVariants,
  addVariant,
  updateVariantStock,
  deleteVariant,
  type ProductInput,
} from "@/app/admin/actions";

interface Option {
  id: string;
  name: string;
}

interface Props {
  products: AdminProductRow[];
  brands: Option[];
  categories: Option[];
  canDelete: boolean; // seul l'admin peut supprimer
}

function euros(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",");
}

const EMPTY_FORM: ProductInput = {
  name: "",
  priceEuros: "",
  description: "",
  thumbnailUrl: "",
  brandId: "",
  newBrand: "",
  categoryId: "",
  active: true,
};

export function ProductManager({
  products,
  brands,
  categories,
  canDelete,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const [stockProduct, setStockProduct] = useState<AdminProductRow | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [products, search]);

  function openCreate() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, categoryId: categories[0]?.id ?? "" });
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(p: AdminProductRow) {
    setEditingId(p.id);
    setForm({
      id: p.id,
      name: p.name,
      priceEuros: euros(p.price),
      description: "",
      thumbnailUrl: p.thumbnail_url ?? "",
      brandId: p.brand_id,
      newBrand: "",
      categoryId: p.category_id,
      active: p.active,
    });
    setFormError(null);
    setFormOpen(true);
  }

  function submitForm() {
    setFormError(null);
    startTransition(async () => {
      const res = editingId
        ? await updateProduct({ ...form, id: editingId })
        : await createProduct(form);
      if (!res.ok) {
        setFormError(res.error ?? "Erreur");
        return;
      }
      setFormOpen(false);
      router.refresh();
    });
  }

  function handleDelete(p: AdminProductRow) {
    if (
      !window.confirm(
        `Supprimer « ${p.name} » ? Les variantes et images associées seront supprimées.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      const res = await deleteProduct(p.id);
      if (res.softDeleted) {
        window.alert(
          "Produit lié à des commandes : il a été désactivé au lieu d'être supprimé.",
        );
      }
      router.refresh();
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gestion des produits & stock</h1>
          <p className="text-muted-foreground text-sm">
            {products.length} produits ·{" "}
            {products.reduce((s, p) => s + p.stock, 0)} unités en stock
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Nouveau produit
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher (nom, marque, catégorie)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.slice(0, 200).map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded overflow-hidden bg-muted shrink-0">
                      {p.thumbnail_url && (
                        <Image
                          src={p.thumbnail_url}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium line-clamp-1">{p.name}</span>
                  </div>
                </TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell className="text-right">{euros(p.price)} €</TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      p.stock === 0
                        ? "text-destructive font-semibold"
                        : p.stock < 10
                          ? "text-amber-600 font-medium"
                          : ""
                    }
                  >
                    {p.stock}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {" "}
                    ({p.variant_count} var.)
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={p.active ? "default" : "secondary"}>
                    {p.active ? "Actif" : "Inactif"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Gérer le stock"
                      onClick={() => setStockProduct(p)}
                    >
                      <Boxes className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Modifier"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Supprimer"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(p)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {filtered.length > 200 && (
        <p className="text-xs text-muted-foreground mt-2">
          Affichage des 200 premiers résultats — affinez la recherche.
        </p>
      )}

      {/* Création / édition produit */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Modifier le produit" : "Nouveau produit"}
            </DialogTitle>
            <DialogDescription>
              Les modifications sont enregistrées en base immédiatement.
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" /> {formError}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="p-name">Nom</Label>
              <Input
                id="p-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p-price">Prix (€)</Label>
                <Input
                  id="p-price"
                  placeholder="129,90"
                  value={form.priceEuros}
                  onChange={(e) =>
                    setForm({ ...form, priceEuros: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="p-cat">Catégorie</Label>
                <Select
                  value={form.categoryId}
                  onValueChange={(v) => setForm({ ...form, categoryId: v })}
                >
                  <SelectTrigger id="p-cat">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="p-brand">Marque</Label>
                <Select
                  value={form.brandId}
                  onValueChange={(v) => setForm({ ...form, brandId: v })}
                >
                  <SelectTrigger id="p-brand">
                    <SelectValue placeholder="Marque" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="p-newbrand">…ou nouvelle marque</Label>
                <Input
                  id="p-newbrand"
                  placeholder="Optionnel"
                  value={form.newBrand}
                  onChange={(e) =>
                    setForm({ ...form, newBrand: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-thumb">URL de l'image</Label>
              <Input
                id="p-thumb"
                placeholder="https://…"
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm({ ...form, thumbnailUrl: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="p-desc">Description</Label>
              <Textarea
                id="p-desc"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="p-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label htmlFor="p-active">Produit actif (visible en boutique)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFormOpen(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button onClick={submitForm} disabled={isPending}>
              {isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gestion du stock */}
      <StockDialog
        product={stockProduct}
        onClose={() => setStockProduct(null)}
        onChanged={() => router.refresh()}
        canDelete={canDelete}
      />
    </div>
  );
}

function StockDialog({
  product,
  onClose,
  onChanged,
  canDelete,
}: {
  product: AdminProductRow | null;
  onClose: () => void;
  onChanged: () => void;
  canDelete: boolean;
}) {
  const [variants, setVariants] = useState<
    { id: string; size: string; color: string; stock_quantity: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    stock: 0,
  });

  // Charge les variantes à l'ouverture.
  const open = product !== null;
  useEffect(() => {
    if (!product) return;
    let cancelled = false;
    setLoading(true);
    fetchVariants(product.id).then((v) => {
      if (cancelled) return;
      setVariants(v);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  function setLocalStock(id: string, value: number) {
    setVariants((vs) =>
      vs.map((v) => (v.id === id ? { ...v, stock_quantity: value } : v)),
    );
  }

  function saveStock(id: string, value: number) {
    startTransition(async () => {
      await updateVariantStock(id, value);
      onChanged();
    });
  }

  function removeVariant(id: string) {
    startTransition(async () => {
      const res = await deleteVariant(id);
      if (!res.ok) {
        window.alert(res.error);
        return;
      }
      setVariants((vs) => vs.filter((v) => v.id !== id));
      onChanged();
    });
  }

  function addNew() {
    if (!product) return;
    if (!newVariant.size.trim() || !newVariant.color.trim()) return;
    startTransition(async () => {
      const res = await addVariant({ productId: product.id, ...newVariant });
      if (!res.ok) {
        window.alert(res.error);
        return;
      }
      const v = await fetchVariants(product.id);
      setVariants(v);
      setNewVariant({ size: "", color: "", stock: 0 });
      onChanged();
    });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stock — {product?.name}</DialogTitle>
          <DialogDescription>
            Ajustez le stock par variante (taille × couleur). Mise à jour
            immédiate en base.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-y-auto">
          {loading ? (
            <p className="text-sm text-muted-foreground py-4">Chargement…</p>
          ) : variants.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">
              Aucune variante. Ajoutez-en une ci-dessous.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Couleur</TableHead>
                  <TableHead>Taille</TableHead>
                  <TableHead className="w-40">Stock</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.color}</TableCell>
                    <TableCell>{v.size}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          value={v.stock_quantity}
                          onChange={(e) =>
                            setLocalStock(v.id, Number(e.target.value))
                          }
                          className="h-8 w-20"
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={isPending}
                          onClick={() => saveStock(v.id, v.stock_quantity)}
                        >
                          OK
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive"
                          disabled={isPending}
                          onClick={() => removeVariant(v.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Ajouter une variante</p>
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label className="text-xs">Couleur</Label>
              <Input
                value={newVariant.color}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, color: e.target.value })
                }
                className="h-8 w-32"
              />
            </div>
            <div>
              <Label className="text-xs">Taille</Label>
              <Input
                value={newVariant.size}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, size: e.target.value })
                }
                className="h-8 w-20"
              />
            </div>
            <div>
              <Label className="text-xs">Stock</Label>
              <Input
                type="number"
                min={0}
                value={newVariant.stock}
                onChange={(e) =>
                  setNewVariant({
                    ...newVariant,
                    stock: Number(e.target.value),
                  })
                }
                className="h-8 w-20"
              />
            </div>
            <Button size="sm" onClick={addNew} disabled={isPending}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
