"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/projectStore";
import { STATUS_LABELS, HORIZON_LABELS, CATEGORIES_ENTREPRISE, CATEGORIES_EDUCATION, ProjectStatus, TimeHorizon } from "@/types/project";
import { cn } from "@/lib/utils";

interface ProjectFiltersProps {
  filterType?: "entreprise" | "education";
}

const ProjectFilters = ({ filterType = "entreprise" }: ProjectFiltersProps) => {
  const { filters, setFilter, resetFilters } = useProjectStore();

  const statuses: Array<{ value: ProjectStatus | "all"; label: string }> = [
    { value: "all", label: "Tous" },
    ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
      value: value as ProjectStatus,
      label,
    })),
  ];

  const horizons: Array<{ value: TimeHorizon | "all"; label: string }> = [
    { value: "all", label: "Tous" },
    ...Object.entries(HORIZON_LABELS).map(([value, label]) => ({
      value: value as TimeHorizon,
      label,
    })),
  ];

  const categoryList = filterType === "education" ? CATEGORIES_EDUCATION : CATEGORIES_ENTREPRISE;
  const categories = ["all", ...categoryList];

  const hasActiveFilters =
    filters.search !== "" || filters.status !== "all" || filters.category !== "all" || filters.horizon !== "all";

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par titre ou tags..."
          value={filters.search}
          onChange={(e) => setFilter("search", e.target.value)}
          className="pl-11"
        />
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider self-center mr-2">
            Statut
          </span>
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilter("status", status.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                filters.status === status.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider self-center mr-2">
            Catégorie
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter("category", cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                filters.category === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {cat === "all" ? "Toutes" : cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider self-center mr-2">
            Horizon
          </span>
          {horizons.map((horizon) => (
            <button
              key={horizon.value}
              onClick={() => setFilter("horizon", horizon.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                filters.horizon === horizon.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              {horizon.label}
            </button>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
          <X className="w-4 h-4 mr-1" />
          Réinitialiser les filtres
        </Button>
      )}
    </div>
  );
};

export default ProjectFilters;
