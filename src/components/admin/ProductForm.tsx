import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  fetchCategories,
  fetchAdminProduct,
  fetchChangeHistory,
  slugify,
  uploadProductImage,
  formatBRL,
  type ProductWithRelations,
  type ProductImageRow,
} from "@/lib/db";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash2, GripVertical, Star, StarOff, ArrowUp, ArrowDown, Upload, Eye, History } from "lucide-react";

type Props = { productId?: string };

type Draft = {
  name: string;
  slug: string;
  description: string;
  price: string;
  stock_quantity: string;
  low_stock_threshold: string;
  category_id: string | null;
  origin: string;
  process: string;
  meaning: string;
  story: string;
  featured: boolean;
  active: boolean;
};

const emptyDraft: Draft = {
  name: "", slug: "", description: "", price: "0", stock_quantity: "0",
  low_stock_threshold: "3", category_id: null,
  origin: "", process: "", meaning: "", story: "",
  featured: false, active: true,
};

export function ProductForm({ productId }: Props) {
  const navigate = useNavigate();
  const cats = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const existing = useQuery({
    queryKey: ["admin", "product", productId],
    queryFn: () => (productId ? fetchAdminProduct(productId) : Promise.resolve(null)),
    enabled: !!productId,
  });
  const history = useQuery({
    queryKey: ["history", productId],
    queryFn: () => (productId ? fetchChangeHistory(productId) : Promise.resolve([])),
    enabled: !!productId,
  });

  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [images, setImages] = useState<ProductImageRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"edit" | "preview" | "history">("edit");

  useEffect(() => {
    if (existing.data) {
      const p = existing.data;
      setDraft({
        name: p.name,
        slug: p.slug,
        description: p.description ?? "",
        price: String(p.price),
        stock_quantity: String(p.stock_quantity),
        low_stock_threshold: String(p.low_stock_threshold),
        category_id: p.category_id,
        origin: p.origin ?? "",
        process: p.process ?? "",
        meaning: p.meaning ?? "",
        story: p.story ?? "",
        featured: p.featured,
        active: p.active,
      });
      setImages([...p.product_images].sort((a, b) => a.display_order - b.display_order));
    }
  }, [existing.data]);

  function update<K extends keyof Draft>(k: K, v: Draft[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  async function save() {
    if (!draft.name.trim()) { toast.error("Nome é obrigatório"); return; }
    const slug = draft.slug.trim() || slugify(draft.name);
    setSaving(true);
    try {
      const row = {
        name: draft.name.trim(),
        slug,
        description: draft.description || null,
        price: Number(draft.price) || 0,
        stock_quantity: parseInt(draft.stock_quantity) || 0,
        low_stock_threshold: parseInt(draft.low_stock_threshold) || 3,
        category_id: draft.category_id,
        origin: draft.origin || null,
        process: draft.process || null,
        meaning: draft.meaning || null,
        story: draft.story || null,
        featured: draft.featured,
        active: draft.active,
      };
      if (productId) {
        const { error } = await supabase.from("products").update(row).eq("id", productId);
        if (error) throw error;
        toast.success("Produto atualizado.");
        existing.refetch();
        history.refetch();
      } else {
        const { data, error } = await supabase.from("products").insert(row).select("id").single();
        if (error) throw error;
        toast.success("Produto criado.");
        navigate({ to: "/admin/produtos/$id", params: { id: data.id } });
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleFiles(files: FileList | null) {
    if (!files || !productId) {
      if (!productId) toast.error("Salve o produto antes de adicionar imagens.");
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const url = await uploadProductImage(file);
        const isMain = images.length === 0;
        const { data, error } = await supabase
          .from("product_images")
          .insert({
            product_id: productId,
            image_url: url,
            display_order: images.length,
            is_main: isMain,
          })
          .select("*")
          .single();
        if (error) throw error;
        setImages((cur) => [...cur, data]);
      }
      toast.success("Imagens enviadas.");
    } catch (e: any) {
      toast.error(e?.message ?? "Falha no upload");
    } finally {
      setUploading(false);
    }
  }

  async function reorder(idx: number, dir: -1 | 1) {
    const next = [...images];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    setImages(next);
    await Promise.all(next.map((img, i) =>
      supabase.from("product_images").update({ display_order: i }).eq("id", img.id)
    ));
  }

  async function toggleMain(id: string) {
    const next = images.map((i) => ({ ...i, is_main: i.id === id }));
    setImages(next);
    await supabase.from("product_images").update({ is_main: false }).eq("product_id", productId!);
    await supabase.from("product_images").update({ is_main: true }).eq("id", id);
  }

  async function removeImage(id: string) {
    if (!confirm("Remover esta imagem?")) return;
    await supabase.from("product_images").delete().eq("id", id);
    setImages((cur) => cur.filter((i) => i.id !== id));
  }

  const previewProduct: Partial<ProductWithRelations> = {
    ...existing.data,
    name: draft.name,
    price: Number(draft.price),
    description: draft.description,
    origin: draft.origin,
    process: draft.process,
    meaning: draft.meaning,
    story: draft.story,
    product_images: images,
    categories: cats.data?.find((c) => c.id === draft.category_id) ?? null,
  };
  const mainImg = images.find((i) => i.is_main)?.image_url ?? images[0]?.image_url;

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <div className="flex gap-2 mb-6 border-b border-border/60">
          {[
            { id: "edit", label: "Editar", icon: null },
            { id: "preview", label: "Pré-visualizar", icon: Eye },
            { id: "history", label: "Histórico", icon: History },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className={`px-4 py-2 text-sm inline-flex items-center gap-1.5 border-b-2 -mb-px ${
                tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
              }`}
            >
              {t.icon && <t.icon className="h-4 w-4" strokeWidth={1.5} />}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "edit" && (
          <div className="space-y-8">
            <section className="grid md:grid-cols-2 gap-4">
              <Field label="Nome do produto" required>
                <input value={draft.name} onChange={(e) => update("name", e.target.value)} className="input" />
              </Field>
              <Field label="Slug (URL)">
                <input value={draft.slug} onChange={(e) => update("slug", e.target.value)} placeholder={slugify(draft.name)} className="input" />
              </Field>
              <Field label="Categoria">
                <select value={draft.category_id ?? ""} onChange={(e) => update("category_id", e.target.value || null)} className="input">
                  <option value="">Sem categoria</option>
                  {cats.data?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Preço (R$)">
                <input type="number" step="0.01" min="0" value={draft.price} onChange={(e) => update("price", e.target.value)} className="input" />
              </Field>
              <Field label="Estoque">
                <input type="number" min="0" value={draft.stock_quantity} onChange={(e) => update("stock_quantity", e.target.value)} className="input" />
              </Field>
              <Field label="Alerta de estoque baixo (quando abaixo de)">
                <input type="number" min="0" value={draft.low_stock_threshold} onChange={(e) => update("low_stock_threshold", e.target.value)} className="input" />
              </Field>
            </section>

            <section>
              <Field label="Descrição detalhada">
                <textarea rows={4} value={draft.description} onChange={(e) => update("description", e.target.value)} className="input" />
              </Field>
            </section>

            <section className="grid md:grid-cols-2 gap-4">
              <Field label="Origem"><textarea rows={3} value={draft.origin} onChange={(e) => update("origin", e.target.value)} className="input" /></Field>
              <Field label="Processo artesanal"><textarea rows={3} value={draft.process} onChange={(e) => update("process", e.target.value)} className="input" /></Field>
              <Field label="Significado"><textarea rows={3} value={draft.meaning} onChange={(e) => update("meaning", e.target.value)} className="input" /></Field>
              <Field label="História"><textarea rows={3} value={draft.story} onChange={(e) => update("story", e.target.value)} className="input" /></Field>
            </section>

            <section>
              <h3 className="text-sm font-medium mb-3">Imagens</h3>
              {!productId && (
                <p className="text-sm text-muted-foreground border border-dashed border-border rounded-sm p-4">
                  Salve o produto para adicionar imagens.
                </p>
              )}
              {productId && (
                <>
                  <label className="btn-ghost cursor-pointer inline-flex">
                    <Upload className="h-4 w-4" /> {uploading ? "Enviando…" : "Adicionar imagens"}
                    <input type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                  </label>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {images.map((img, i) => (
                      <div key={img.id} className="border border-border rounded-sm bg-background overflow-hidden">
                        <div className="aspect-square bg-muted relative">
                          <img src={img.image_url} alt="" className="h-full w-full object-cover" />
                          {img.is_main && (
                            <span className="absolute top-2 left-2 bg-[color:var(--color-clay)] text-[color:var(--color-sand)] text-[10px] px-2 py-0.5 rounded-full">Principal</span>
                          )}
                        </div>
                        <div className="p-2 flex items-center justify-between gap-1">
                          <div className="flex gap-1">
                            <button title="Mover" onClick={() => reorder(i, -1)} className="p-1 hover:bg-muted rounded"><ArrowUp className="h-3.5 w-3.5" /></button>
                            <button onClick={() => reorder(i, 1)} className="p-1 hover:bg-muted rounded"><ArrowDown className="h-3.5 w-3.5" /></button>
                          </div>
                          <div className="flex gap-1">
                            <button onClick={() => toggleMain(img.id)} className="p-1 hover:bg-muted rounded" title="Principal">
                              {img.is_main ? <Star className="h-3.5 w-3.5 fill-current" /> : <StarOff className="h-3.5 w-3.5" />}
                            </button>
                            <button onClick={() => removeImage(img.id)} className="p-1 hover:bg-muted rounded text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {images.length === 0 && (
                      <div className="col-span-full border border-dashed border-border rounded-sm p-8 text-center text-sm text-muted-foreground">
                        Nenhuma imagem ainda.
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <GripVertical className="h-3 w-3" /> Use as setas para definir a ordem de exibição.
                  </p>
                </>
              )}
            </section>
          </div>
        )}

        {tab === "preview" && (
          <div className="bg-background border border-border/60 rounded-sm p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
                {mainImg ? <img src={mainImg} alt={draft.name} className="h-full w-full object-cover" /> : <div className="h-full grid place-items-center text-xs text-muted-foreground">sem imagem</div>}
              </div>
              <div>
                <span className="eyebrow">{previewProduct.categories?.name ?? "—"}</span>
                <h2 className="display-serif text-3xl mt-2">{draft.name || "Nome do produto"}</h2>
                <p className="text-2xl font-light mt-4">{formatBRL(Number(draft.price) || 0)}</p>
                <p className="text-sm text-muted-foreground mt-6 whitespace-pre-wrap">{draft.description}</p>
                {draft.origin && <Block title="Origem" body={draft.origin} />}
                {draft.process && <Block title="Processo" body={draft.process} />}
                {draft.meaning && <Block title="Significado" body={draft.meaning} />}
              </div>
            </div>
          </div>
        )}

        {tab === "history" && (
          <div className="bg-background border border-border/60 rounded-sm">
            {(!history.data || history.data.length === 0) ? (
              <p className="p-6 text-sm text-muted-foreground">Nenhuma alteração registrada ainda.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2">Quando</th>
                    <th className="text-left px-4 py-2">Campo</th>
                    <th className="text-left px-4 py-2">Antes</th>
                    <th className="text-left px-4 py-2">Depois</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {history.data.map((h) => (
                    <tr key={h.id}>
                      <td className="px-4 py-2 text-muted-foreground text-xs whitespace-nowrap">{new Date(h.changed_at).toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-2 font-medium">{h.field_changed}</td>
                      <td className="px-4 py-2 text-muted-foreground max-w-xs truncate" title={h.old_value ?? ""}>{h.old_value ?? "—"}</td>
                      <td className="px-4 py-2 max-w-xs truncate" title={h.new_value ?? ""}>{h.new_value ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <div className="border border-border/60 rounded-sm bg-background p-5 space-y-4">
          <label className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Ativo</p>
              <p className="text-xs text-muted-foreground">Aparece na loja</p>
            </div>
            <Toggle checked={draft.active} onChange={(v) => update("active", v)} />
          </label>
          <label className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Destaque</p>
              <p className="text-xs text-muted-foreground">Aparece na home</p>
            </div>
            <Toggle checked={draft.featured} onChange={(v) => update("featured", v)} />
          </label>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary w-full justify-center">
          {saving ? "Salvando…" : productId ? "Salvar alterações" : "Criar produto"}
        </button>
      </aside>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}{required && " *"}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-4 border-t border-border/60 pt-3">
      <p className="eyebrow">{title}</p>
      <p className="text-sm mt-1">{body}</p>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-colors relative ${checked ? "bg-[color:var(--color-clay)]" : "bg-muted-foreground/30"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
    </button>
  );
}
