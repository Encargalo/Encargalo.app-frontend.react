
import { create } from 'zustand'

const useLoaderStore = create((set) => ({
  isLoading: true,        // inicia en true (loader global inicial)
  requests: 0,            // contador de requests activas

  showLoader: () => set((state) => ({ requests: state.requests + 1, isLoading: true })),
  hideLoader: () => set((state) => {
    const newCount = Math.max(0, state.requests - 1);
    return {
      requests: newCount,
      isLoading: newCount > 0
    };
  }),

  hideForce: () => set({ isLoading: false, requests: 0 }) // por si quieres forzar
}))

export default useLoaderStore;
