import { X } from "lucide-react";
import type { ReactNode } from "react";

export function PanelSheet({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-foreground/40">
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="flex-1"
      />
      <div className="max-h-[88vh] overflow-y-auto rounded-t-3xl border-t border-border/60 bg-background px-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] pt-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="display-serif text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-10 w-10 place-items-center rounded-full bg-muted text-muted-foreground"
          >
            <X className="h-5 w-5" strokeWidth={1.6} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
