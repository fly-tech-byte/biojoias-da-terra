import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/produtos")({
  component: ProductsLayout,
});

function ProductsLayout() {
  return <Outlet />;
}
