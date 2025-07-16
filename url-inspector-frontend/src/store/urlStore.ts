import { create } from "zustand";
import type { Url } from "../api/url/url-types";

interface UrlStore {
  urls: Url[];
  setUrls: (urls: Url[]) => void;
  updateUrls: (newUrls: Url[]) => void;
}

export const useUrlStore = create<UrlStore>((set, get) => ({
  urls: [],
  setUrls: (urls) => set({ urls }),
  updateUrls: (newUrls) => {
    const current = get().urls;
    const merged = newUrls.map(nu => current.find(cu => cu.id === nu.id) ? { ...current.find(cu => cu.id === nu.id), ...nu } : nu);
    set({ urls: merged });
  },
}));