import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeState } from "@/context/types";


export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            darkMode: false,
            toggleTheme: () => set({ darkMode: !get().darkMode }),
        }),
        { name: "theme-store" }
    )
);