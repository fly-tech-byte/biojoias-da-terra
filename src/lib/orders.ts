import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];

export const orderStatusFlow: OrderStatus[] = ["novo", "em_producao", "enviado", "entregue"];

export const orderStatusLabel: Record<OrderStatus, string> = {
  novo: "Novo",
  em_producao: "Em produção",
  enviado: "Enviado",
  entregue: "Entregue",
};

export function nextOrderStatus(status: OrderStatus): OrderStatus {
  const idx = orderStatusFlow.indexOf(status);
  return orderStatusFlow[Math.min(idx + 1, orderStatusFlow.length - 1)];
}

export async function fetchOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createOrder(input: {
  customerName: string;
  customerContact: string | null;
  productId: string | null;
  productName: string;
  quantity: number;
  totalAmount: number;
  notes: string | null;
}): Promise<OrderRow> {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      customer_contact: input.customerContact,
      product_id: input.productId,
      product_name: input.productName,
      quantity: input.quantity,
      total_amount: input.totalAmount,
      notes: input.notes,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}
