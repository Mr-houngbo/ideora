"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Briefcase, GraduationCap, Share2, LogOut, Building2, Lightbulb, Rocket, Globe2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

const Header = () => {
  const pathname = usePathname();

  const navLinks = [
    { path: "/", label: "Entreprise", icon: Briefcase, color: "primary" },
    { path: "/education", label: "Académique", icon: GraduationCap, color: "academic" },
    { path: "/projet-houefa", label: "Houefa", icon: Building2, color: "houefa" },
    { path: "/vision-education", label: "Vision Édu", icon: Lightbulb, color: "vision" },
    { path: "/daho", label: "Daho", icon: Rocket, color: "daho" },
    { path: "/monpays-plus", label: "MonPays+", icon: Globe2, color: "monpays" },
    { path: "/perseus", label: "Perseus", icon: Shield, color: "perseus" },
    { path: "/portfolio", label: "Portfolio", icon: Share2, color: "accent" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-strong">
      <div className="container flex h-18 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md"
            style={{ background: "var(--gradient-primary)" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="font-bold text-xl hidden sm:block">
            <span className="gradient-text">Ideora</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;

            return (
              <Link key={link.path} href={link.path} className="relative">
                <motion.div
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive
                      ? link.color === "academic"
                        ? "bg-academic/10 text-academic"
                        : link.color === "accent"
                        ? "bg-accent/10 text-accent"
                        : link.color === "daho"
                        ? "bg-orange-500/10 text-orange-600"
                        : link.color === "monpays"
                        ? "bg-[#C56A3E]/10 text-[#8E3B1F]"
                        : link.color === "perseus"
                        ? "bg-[#F5C76A]/15 text-[#8B6914]"
                        : link.color === "houefa" || link.color === "vision"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  )}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={cn(
                        "absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full",
                        link.color === "academic"
                          ? "bg-academic"
                          : link.color === "accent"
                          ? "bg-accent"
                          : link.color === "daho"
                          ? "bg-orange-500"
                          : link.color === "monpays"
                          ? "bg-[#C56A3E]"
                          : link.color === "perseus"
                          ? "bg-[#C9A24C]"
                          : link.color === "houefa" || link.color === "vision"
                          ? "bg-emerald-500"
                          : "bg-primary"
                      )}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}

          <form action={logout}>
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="ml-2 text-muted-foreground hover:text-destructive"
              title="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </form>
        </nav>
      </div>
    </header>
  );
};

export default Header;
