import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Camera, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  slugify,
  uploadProductImage,
  mainImage,
  type CategoryRow,
  type ProductWithRelations,
} from "@/lib/db";
import { PanelSheet } from "./PanelSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  categories: CategoryRow[];
  product: ProductWithRelations | null;
};

type Draft = {
  name: string;
  categoryId: string;
  price: string;
  materialCost: string;
  stock: string;
};

const emptyDraft: Draft = { name: "", categoryId: "", price: "", materialCost: "", stock: "1" };

export function PanelProductSheet({ open, onClose, onSaved, categories, product }: Props) {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (product) {
      setDraft({
        name: product.name,
        categoryId: product.category_id ?? "",
        price: String(product.price),
        materialCost: String(product.material_cost ?? 0),
        stock: String(product.stock_quantity),
      });
      setPreview(mainImage(product));
    } else {
      setDraft(emptyDraft);
      setPreview(null);
    }
    setFile(null);
  }, [open, product]);

  function pickFile(f: File | null) {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : product ? mainImage(product) : null);
  }

  async function save() {
    if (!draft.name.trim()) {
      toast.error("Informe o nome da peça.");
      return;
    }
    setSaving(true);
    try {
      const row = {
        name: draft.name.trim(),
        slug: slugify(draft.name) || `peca-${Date.now()}`,
        category_id: draft.categoryId || null,
        price: Number(draft.price.replace(",", ".")) || 0,
        material_cost: Number(draft.materialCost.replace(",", ".")) || 0,
        stock_quantity: parseInt(draft.stock) || 0,
      };

      let productId = product?.id ?? null;
      if (productId) {
        const { error } = await supabase.from("products").update(row).eq("id", productId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("products").insert(row).select("id").single();
        if (error) throw error;
        productId = data.id;
      }

      if (file && productId) {
        const url = await uploadProductImage(file);
        const { count } = await supabase
          .from("product_images")
          .select("id", { count: "exact", head: true })
          .eq("product_id", productId);
        const isFirst = (count ?? 0) === 0;
        if (!isFirst) {
          await supabase.from("product_images").update({ is_main: false }).eq("product_id", productId);
        }
        const { error } = await supabase.from("product_images").insert({
          product_id: productId,
          image_url: url,
          display_order: 0,
          is_main: true,
        });
        if (error) throw error;
      }

      toast.success(product ? "Peça atualizada." : "Peça cadastrada.");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!product) return;
    if (!confirm(`Excluir "${product.name}"? Essa ação não pode ser desfeita.`)) return;
    setSaving(true);
    try {
      await supabase.from("product_images").delete().eq("product_id", product.id);
      await supabase.from("change_history").delete().eq("product_id", product.id);
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
      toast.success("Peça excluída.");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível excluir.");
    } finally {
      setSaving(false);
    }
  }

  const margin =
    (Number(draft.price.replace(",", ".")) || 0) - (Number(draft.materialCost.replace(",", ".")) || 0);

  return (
    <PanelSheet open={open} onClose={onClose} title={product ? "Editar peça" : "Nova peça"}>
      <div className="space-y-5">
        <label className="block">
          <span className="sr-only">Foto da peça</span>
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="grid h-full w-full place-items-center text-muted-foreground">
                  <Camera className="h-6 w-6" strokeWidth={1.6} />
                </span>
              )}
            </div>
            <div className="text-sm">
              <p className="font-medium">Foto da peça</p>
              <p className="text-xs text-muted-foreground">Tirar foto ou escolher da galeria</p>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </div>
        </label>

        <Field label="Nome">
          <input
            className="input min-h-12"
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="Colar de sementes"
          />
        </Field>

        <Field label="Categoria">
          <select
            className="input min-h-12"
            value={draft.categoryId}
            onChange={(e) => setDraft((d) => ({ ...d, categoryId: e.target.value }))}
          >
            <option value="">Sem categoria</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Preço de venda (R$)">
            <input
              className="input min-h-12"
              inputMode="decimal"
              value={draft.price}
              onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
              placeholder="0,00"
            />
          </Field>
          <Field label="Custo do material (R$)">
            <input
              className="input min-h-12"
              inputMode="decimal"
              value={draft.materialCost}
              onChange={(e) => setDraft((d) => ({ ...d, materialCost: e.target.value }))}
              placeholder="0,00"
            />
          </Field>
        </div>

        <Field label="Estoque">
          <input
            className="input min-h-12"
            inputMode="numeric"
            value={draft.stock}
            onChange={(e) => setDraft((d) => ({ ...d, stock: e.target.value }))}
          />
        </Field>

        {margin !== 0 && (
          <p className="rounded-2xl bg-[color:var(--color-secondary)]/60 px-4 py-3 text-sm">
            Margem estimada:{" "}
            <strong>{margin.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>
          </p>
        )}

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary min-h-14 w-full justify-center rounded-2xl text-base"
        >
          {saving ? "Salvando…" : product ? "Salvar alterações" : "Cadastrar peça"}
        </button>

        {product && (
          <button
            type="button"
            onClick={remove}
            disabled={saving}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 text-sm text-destructive"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.6} /> Excluir peça
          </button>
        )}
      </div>
    </PanelSheet>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
