"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyTheme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

/** Light / dark switch; the choice is remembered on this device. */
export default function ThemeToggle() {
  // The server cannot know the theme; render the light icon there and let the browser correct it.
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={() => applyTheme(dark ? "light" : "dark")}
      className="text-muted-foreground hover:text-foreground"
      title={dark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label={dark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
