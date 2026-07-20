import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductForm } from "@/components/admin/ProductForm";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/produtos/novo")({
  component: NewProduct,
});

function NewProduct() {
  return (
    <div>
      <Link to="/admin/produtos" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Produtos
      </Link>
      <h1 className="display-serif text-4xl mt-3">Novo produto</h1>
      <p className="text-sm text-muted-foreground mt-1">Cadastre o produto — imagens após o primeiro salvamento.</p>
      <div className="mt-8">
        <ProductForm />
      </div>
    </div>
  );
}
