"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectStore } from "@/store/projectStore";
import {
  STATUS_LABELS,
  HORIZON_LABELS,
  CATEGORIES_ENTREPRISE,
  CATEGORIES_EDUCATION,
  ProjectStatus,
  TimeHorizon,
} from "@/types/project";
import { cn } from "@/lib/utils";
import { effectiveCategory } from "@/lib/filter-projects";
import { SORT_LABELS, type ProjectSort } from "@/lib/home";

interface ProjectFiltersProps {
  filterType?: "entreprise" | "education";
  /** Number of projects shown with the current filters. */
  resultCount?: number;
}

/**
 * One compact bar (search, sort, a "Filtres" button) instead of three rows of
 * chips; the chips open on demand and active ones stay visible as pills.
 */
const ProjectFilters = ({ filterType = "entreprise", resultCount }: ProjectFiltersProps) => {
  const { filters, setFilter, resetFilters, sort, setSort } = useProjectStore();
  const [open, setOpen] = useState(false);

  const categoryList = filterType === "education" ? CATEGORIES_EDUCATION : CATEGORIES_ENTREPRISE;
  const activeCategory = effectiveCategory(filters.category, categoryList);
  const isAcademic = filterType === "education";
  const activeChip = isAcademic
    ? "bg-academic text-academic-foreground shadow-sm"
    : "bg-primary text-primary-foreground shadow-sm";

  const groups = [
    {
      key: "status" as const,
      label: "Statut",
      value: filters.status,
      options: Object.entries(STATUS_LABELS) as [ProjectStatus, string][],
      set: (v: string) => setFilter("status", v as ProjectStatus | "all"),
    },
    {
      key: "category" as const,
      label: "Catégorie",
      value: activeCategory,
      options: categoryList.map((c) => [c, c] as [string, string]),
      set: (v: string) => setFilter("category", v),
    },
    {
      key: "horizon" as const,
      label: "Horizon",
      value: filters.horizon,
      options: Object.entries(HORIZON_LABELS) as [TimeHorizon, string][],
      set: (v: string) => setFilter("horizon", v as TimeHorizon | "all"),
    },
  ];

  const activePills = groups.flatMap((g) =>
    g.value === "all" ? [] : [{ key: g.key, label: g.options.find(([v]) => v === g.value)?.[1] ?? g.value, clear: () => g.set("all") }],
  );
  const hasActiveFilters = filters.search !== "" || activePills.length > 0;

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre ou tags..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="pl-11"
            aria-label="Rechercher"
          />
        </div>
        <div className="flex gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as ProjectSort)}>
            <SelectTrigger className="h-10 flex-1 gap-2 sm:w-48" aria-label="Trier">
              <ArrowDownUp className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as ProjectSort[]).map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className={cn(
              "inline-flex h-10 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
              open || activePills.length > 0
                ? isAcademic
                  ? "border-academic/40 bg-academic/10 text-academic"
                  : "border-primary/40 bg-primary/10 text-primary"
                : "border-input bg-card/70 text-foreground hover:bg-secondary",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtres
            {activePills.length > 0 && (
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-bold",
                  activeChip,
                )}
              >
                {activePills.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-sm">
              {groups.map((group) => (
                <div key={group.key} className="flex flex-wrap items-center gap-2">
                  <span className="mr-2 w-20 shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </span>
                  {[["all", group.key === "category" ? "Toutes" : "Tous"] as [string, string], ...group.options].map(
                    ([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => group.set(value)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                          group.value === value
                            ? activeChip
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                        )}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {(hasActiveFilters || resultCount !== undefined) && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {resultCount !== undefined && (
            <span className="mr-1 text-muted-foreground">
              {resultCount} {resultCount > 1 ? "idées" : "idée"}
            </span>
          )}
          {!open &&
            activePills.map((pill) => (
              <button
                key={pill.key}
                type="button"
                onClick={pill.clear}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                  isAcademic ? "bg-academic/10 text-academic" : "bg-primary/10 text-primary",
                )}
                title="Retirer ce filtre"
              >
                {pill.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Tout effacer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
