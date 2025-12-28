import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isAutoParagraph: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAutoParagraph: (enabled: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      isAutoParagraph: true, // 默认开启
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
      setAutoParagraph: (enabled: boolean) => set({ isAutoParagraph: enabled }),
    }),
    {
      name: 'wemd-ui-storage',
      partialize: (state) => ({ 
        isSidebarOpen: state.isSidebarOpen,
        isAutoParagraph: state.isAutoParagraph 
      }),
    }
  )
);
