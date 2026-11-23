"use client";

import { FileDown } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { holdLightTheme } from "@/lib/theme";

/**
 * Opens the browser's print dialog, where "Enregistrer au format PDF" saves
 * the page. A print stylesheet drops the app's chrome; the page is printed in
 * light mode, then the theme comes back.
 */
export default function ExportPdfButton({ className, variant = "glass" }: { className?: string; variant?: ButtonProps["variant"] }) {
  const print = () => {
    const restore = holdLightTheme();
    window.addEventListener("afterprint", restore, { once: true });
    window.print();
  };
  return (
    <Button variant={variant} size="icon-sm" onClick={print} className={className} title="Exporter en PDF" aria-label="Exporter en PDF">
      <FileDown className="h-4 w-4" />
    </Button>
  );
}
