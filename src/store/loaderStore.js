import { create } from 'zustand';

const useLoaderStore = create((set) => ({
  isLoading: false,
  requests: 0,

  showLoader: () =>
    set((state) => ({ requests: state.requests + 1, isLoading: true })),

  hideLoader: () =>
    set((state) => {
      const newCount = Math.max(0, state.requests - 1);
      // Si no hay más requests, agregamos delay antes de ocultar
      if (newCount === 0) {
        return new Promise((resolve) => {
          setTimeout(() => {
            set({ requests: 0, isLoading: false });
            resolve();
          }, 500);
        });
      }
      return {
        requests: newCount,
        isLoading: newCount > 0,
      };
    }),

  hideForce: () => set({ isLoading: false, requests: 0 }),
}));

export default useLoaderStore;
