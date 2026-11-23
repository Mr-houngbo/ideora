import { create } from "zustand";
import { ProjectStatus, TimeHorizon } from "@/types/project";
import type { ProjectSort } from "@/lib/home";

interface FilterState {
  search: string;
  status: ProjectStatus | "all";
  category: string | "all";
  horizon: TimeHorizon | "all";
}

interface FilterStore {
  filters: FilterState;
  sort: ProjectSort;
  setSort: (sort: ProjectSort) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const initialFilters: FilterState = {
  search: "",
  status: "all",
  category: "all",
  horizon: "all",
};

export const useProjectStore = create<FilterStore>((set) => ({
  filters: initialFilters,
  sort: "recent",
  setSort: (sort) => set({ sort }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));
