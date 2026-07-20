import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
export type ChangeHistoryRow = Database["public"]["Tables"]["change_history"]["Row"];

export type ProductWithRelations = ProductRow & {
  categories: CategoryRow | null;
  product_images: ProductImageRow[];
};

export const formatBRL = (v: number | string) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function mainImage(p: ProductWithRelations): string | null {
  if (!p.product_images || p.product_images.length === 0) return null;
  const sorted = [...p.product_images].sort((a, b) => {
    if (a.is_main !== b.is_main) return a.is_main ? -1 : 1;
    return a.display_order - b.display_order;
  });
  return sorted[0]?.image_url ?? null;
}

export async function fetchCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchPublicProducts(opts?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  limit?: number;
}): Promise<ProductWithRelations[]> {
  let q = supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .eq("active", true)
    .order("created_at", { ascending: false });
  if (opts?.featuredOnly) q = q.eq("featured", true);
  if (opts?.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  let list = (data ?? []) as ProductWithRelations[];
  if (opts?.categorySlug) list = list.filter((p) => p.categories?.slug === opts.categorySlug);
  return list;
}

export async function fetchProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return data as ProductWithRelations | null;
}

export async function fetchAdminProducts(): Promise<ProductWithRelations[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProductWithRelations[];
}

export async function fetchAdminProduct(id: string): Promise<ProductWithRelations | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as ProductWithRelations | null;
}

export async function fetchChangeHistory(productId: string): Promise<ChangeHistoryRow[]> {
  const { data, error } = await supabase
    .from("change_history")
    .select("*")
    .eq("product_id", productId)
    .order("changed_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// 10 years in seconds for "permanent" signed URLs
const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 10;

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("product-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (upErr) throw upErr;
  const { data, error } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (error || !data?.signedUrl) throw error ?? new Error("Falha ao gerar URL");
  return data.signedUrl;
}
