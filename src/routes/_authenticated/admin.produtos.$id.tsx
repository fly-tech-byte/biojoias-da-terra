import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/produtos/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  async function del() {
    if (!confirm("Excluir este produto? Esta ação não pode ser desfeita.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Produto excluído.");
    navigate({ to: "/admin/produtos" });
  }

  return (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <Link to="/admin/produtos" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Produtos
          </Link>
          <h1 className="display-serif text-4xl mt-3">Editar produto</h1>
        </div>
        <button onClick={del} className="text-sm text-red-600 hover:text-red-700 inline-flex items-center gap-1">
          <Trash2 className="h-4 w-4" /> Excluir
        </button>
      </div>
      <div className="mt-8">
        <ProductForm productId={id} />
      </div>
    </div>
  );
}
