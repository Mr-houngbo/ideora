import type { Project, ProjectStatus, TimeHorizon } from "@/types/project";

export interface ProjectFilters {
  search: string;
  status: ProjectStatus | "all";
  category: string | "all";
  horizon: TimeHorizon | "all";
}

/**
 * The category filter is shared between the Entreprise and Académique pages.
 * A category picked on one page means nothing on the other, so it falls back
 * to "all" there instead of hiding every project.
 */
export function effectiveCategory(category: string, allowed: readonly string[]): string {
  return category === "all" || allowed.includes(category) ? category : "all";
}

export function filterProjects(
  projects: Project[],
  filters: ProjectFilters,
  allowedCategories?: readonly string[],
): Project[] {
  const category = allowedCategories ? effectiveCategory(filters.category, allowedCategories) : filters.category;
  return projects.filter((project) => {
    const matchesSearch =
      filters.search === "" ||
      project.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesStatus = filters.status === "all" || project.statut === filters.status;
    const matchesCategory = category === "all" || project.categorie === category;
    const matchesHorizon = filters.horizon === "all" || project.horizon_temps === filters.horizon;

    return matchesSearch && matchesStatus && matchesCategory && matchesHorizon;
  });
}
