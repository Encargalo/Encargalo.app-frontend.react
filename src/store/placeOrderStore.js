import { create } from 'zustand';

const usePlaceOrderStore = create((set) => ({
  placeOrder: null,
  setPlaceOrder: (order) => set({ placeOrder: order }),
  clearPlaceOrder: () => set({ placeOrder: null }),
}));

export default usePlaceOrderStore;
