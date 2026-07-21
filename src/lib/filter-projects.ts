import type { Project, ProjectStatus, TimeHorizon } from "@/types/project";

export interface ProjectFilters {
  search: string;
  status: ProjectStatus | "all";
  category: string | "all";
  horizon: TimeHorizon | "all";
}

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  return projects.filter((project) => {
    const matchesSearch =
      filters.search === "" ||
      project.titre.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesStatus = filters.status === "all" || project.statut === filters.status;
    const matchesCategory = filters.category === "all" || project.categorie === filters.category;
    const matchesHorizon = filters.horizon === "all" || project.horizon_temps === filters.horizon;

    return matchesSearch && matchesStatus && matchesCategory && matchesHorizon;
  });
}
