import { create } from "zustand";
import type { AttributeDto } from "~/api/types";

interface ProfileAttributeState {
  search: string;
  page: number;
  activeTab: string | null;
  selectedAttribute: AttributeDto | null;
  modalValue: any;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setActiveTab: (tab: string | null) => void;
  setSelectedAttribute: (attr: AttributeDto | null, value?: any) => void;
  setModalValue: (value: any) => void;
}

export const useProfileAttributeStore = create<ProfileAttributeState>((set) => ({
  search: "",
  page: 1,
  activeTab: "all",
  selectedAttribute: null,
  modalValue: null,
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setActiveTab: (activeTab) => set({ activeTab, page: 1 }),
  setSelectedAttribute: (attr, value = null) => set({ selectedAttribute: attr, modalValue: value }),
  setModalValue: (modalValue) => set({ modalValue }),
}));

export function getDefaultValueForType(typeName: string): any {
  const name = typeName.toLowerCase();
  if (name.includes("boolean")) return false;
  if (name.includes("numeric")) return 0;
  if (name.includes("date")) return new Date().toISOString().split("T")[0];
  if (name.includes("period")) return [new Date().toISOString().split("T")[0], new Date().toISOString().split("T")[0]];
  if (name.includes("one")) return [];
  return "";
}
