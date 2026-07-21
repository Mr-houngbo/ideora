import { create } from "zustand";
import { ProjectStatus, TimeHorizon } from "@/types/project";

interface FilterState {
  search: string;
  status: ProjectStatus | "all";
  category: string | "all";
  horizon: TimeHorizon | "all";
}

interface FilterStore {
  filters: FilterState;
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

  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () => set({ filters: initialFilters }),
}));
