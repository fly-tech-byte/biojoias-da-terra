import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchCategories, slugify, type CategoryRow } from "@/lib/db";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: CategoriesAdmin,
});

function CategoriesAdmin() {
  const q = useQuery({ queryKey: ["categories"], queryFn: fetchCategories });
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<CategoryRow>>({});

  async function create() {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const { error } = await supabase.from("categories").insert({
        name: name.trim(),
        slug: slugify(name),
        description: description || null,
        display_order: (q.data?.length ?? 0) + 1,
      });
      if (error) throw error;
      toast.success("Categoria criada.");
      setName(""); setDescription("");
      q.refetch();
    } catch (e: any) {
      toast.error(e?.message ?? "Falha ao criar");
    } finally {
      setCreating(false);
    }
  }

  async function save(id: string) {
    const { error } = await supabase.from("categories").update({
      name: editDraft.name,
      description: editDraft.description ?? null,
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Atualizada.");
    setEditing(null);
    q.refetch();
  }

  async function del(id: string) {
    if (!confirm("Excluir esta categoria? Os produtos ficarão sem categoria.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Excluída.");
    q.refetch();
  }

  return (
    <div>
      <span className="eyebrow">Catálogo</span>
      <h1 className="display-serif text-4xl mt-2">Categorias</h1>
      <p className="text-sm text-muted-foreground mt-1">Organize os produtos em grupos.</p>

      <div className="mt-8 grid md:grid-cols-[1fr_320px] gap-8">
        <div className="border border-border/60 rounded-sm bg-background divide-y divide-border/60">
          {q.data?.map((c) => (
            <div key={c.id} className="p-4 flex items-start justify-between gap-4">
              {editing === c.id ? (
                <div className="flex-1 space-y-2">
                  <input value={editDraft.name ?? ""} onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })} className="input" />
                  <textarea rows={2} value={editDraft.description ?? ""} onChange={(e) => setEditDraft({ ...editDraft, description: e.target.value })} className="input" />
                </div>
              ) : (
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">/{c.slug}</p>
                  {c.description && <p className="text-sm mt-1">{c.description}</p>}
                </div>
              )}
              <div className="flex gap-1 shrink-0">
                {editing === c.id ? (
                  <>
                    <button onClick={() => save(c.id)} className="p-2 hover:bg-muted rounded"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditing(null)} className="p-2 hover:bg-muted rounded"><X className="h-4 w-4" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditing(c.id); setEditDraft(c); }} className="p-2 hover:bg-muted rounded"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => del(c.id)} className="p-2 hover:bg-muted rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </>
                )}
              </div>
            </div>
          ))}
          {q.data?.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nenhuma categoria.</p>}
        </div>

        <div className="border border-border/60 rounded-sm bg-background p-5 self-start">
          <h2 className="text-sm font-medium mb-3">Nova categoria</h2>
          <label className="block">
            <span className="text-xs text-muted-foreground">Nome</span>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input mt-1" />
          </label>
          <label className="block mt-3">
            <span className="text-xs text-muted-foreground">Descrição</span>
            <textarea value={description} rows={3} onChange={(e) => setDescription(e.target.value)} className="input mt-1" />
          </label>
          <button onClick={create} disabled={creating || !name.trim()} className="btn-primary w-full justify-center mt-4">
            <Plus className="h-4 w-4" /> {creating ? "Criando…" : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
}
