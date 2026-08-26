import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createOrder } from "@/lib/orders";
import type { ProductWithRelations } from "@/lib/db";
import { PanelSheet } from "./PanelSheet";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  products: ProductWithRelations[];
};

export function PanelOrderSheet({ open, onClose, onSaved, products }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [contact, setContact] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [total, setTotal] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCustomerName("");
    setContact("");
    setProductId("");
    setQuantity("1");
    setTotal("");
    setNotes("");
  }, [open]);

  function selectProduct(id: string) {
    setProductId(id);
    const p = products.find((x) => x.id === id);
    if (p) setTotal(String(Number(p.price) * (parseInt(quantity) || 1)).replace(".", ","));
  }

  async function save() {
    const product = products.find((p) => p.id === productId);
    if (!customerName.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    if (!product) {
      toast.error("Escolha a peça do pedido.");
      return;
    }
    setSaving(true);
    try {
      await createOrder({
        customerName: customerName.trim(),
        customerContact: contact.trim() || null,
        productId: product.id,
        productName: product.name,
        quantity: parseInt(quantity) || 1,
        totalAmount: Number(total.replace(",", ".")) || 0,
        notes: notes.trim() || null,
      });
      toast.success("Pedido registrado.");
      onSaved();
      onClose();
    } catch (e: any) {
      toast.error(e?.message ?? "Não foi possível registrar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelSheet open={open} onClose={onClose} title="Novo pedido">
      <div className="space-y-5">
        <Field label="Cliente">
          <input
            className="input min-h-12"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Nome de quem comprou"
          />
        </Field>
        <Field label="Contato (WhatsApp)">
          <input
            className="input min-h-12"
            inputMode="tel"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="(61) 99999-6850"
          />
        </Field>
        <Field label="Peça">
          <select
            className="input min-h-12"
            value={productId}
            onChange={(e) => selectProduct(e.target.value)}
          >
            <option value="">Escolher peça</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Quantidade">
            <input
              className="input min-h-12"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Field>
          <Field label="Valor total (R$)">
            <input
              className="input min-h-12"
              inputMode="decimal"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="0,00"
            />
          </Field>
        </div>
        <Field label="Observações">
          <textarea
            className="input"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Cor, tamanho, prazo combinado…"
          />
        </Field>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary min-h-14 w-full justify-center rounded-2xl text-base"
        >
          {saving ? "Salvando…" : "Registrar pedido"}
        </button>
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
