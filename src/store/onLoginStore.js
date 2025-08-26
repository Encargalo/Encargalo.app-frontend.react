import { create } from 'zustand';

const useOnLoginStore = create((set) => ({
  isLoginModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  isAddress: {},
  setAddress: (address) => set({ isAddress: address }),

  isWelcomeModalOpen: false,
  openWelcomeModal: () => set({ isWelcomeModalOpen: true }),
  closeWelcomeModal: () => set({ isWelcomeModalOpen: false }),
}));

export default useOnLoginStore;
