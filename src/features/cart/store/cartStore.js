import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  setEncryptedItem,
  getDecryptedItem,
} from '../../../utils/encryptionUtilities';

const cartStorage = {
  getItem: (name) => {
    const stored = getDecryptedItem(name);
    if (stored) {
      return {
        state: {
          ...stored.state,
          cart: stored.state.cart || [],
        },
        version: stored.version,
      };
    }
    return null;
  },
  setItem: (name, value) => {
    setEncryptedItem(name, value);
  },
  removeItem: (name) => {
    setEncryptedItem(name, null);
  },
};

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (newItem) =>
        set((state) => {
          const exists = state.cart.find(
            (item) =>
              item.id === newItem.id &&
              JSON.stringify(item.additionals) ===
                JSON.stringify(newItem.additionals || []) &&
              JSON.stringify(item.flavors || []) ===
                JSON.stringify(newItem.flavors || []) &&
              (item.observation?.trim() || '') ===
                (newItem.observation?.trim() || '')
          );
          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item.id === newItem.id &&
                JSON.stringify(item.additionals) ===
                  JSON.stringify(newItem.additionals || []) &&
                JSON.stringify(item.flavors || []) ===
                  JSON.stringify(newItem.flavors || []) &&
                (item.observation?.trim() || '') ===
                  (newItem.observation?.trim() || '')
                  ? {
                      ...item,
                      quantity: item.quantity + (newItem.quantity || 1),
                    }
                  : item
              ),
            };
          }
          return {
            cart: [
              ...state.cart,
              { ...newItem, quantity: newItem.quantity || 1 },
            ],
          };
        }),

      removeItemQuantity: (product) =>
        set((state) => {
          const cart = state.cart
            .map((item) => {
              if (
                item.id === product.id &&
                JSON.stringify(item.additionals) ===
                  JSON.stringify(product.additionals || []) &&
                JSON.stringify(item.flavors || []) ===
                  JSON.stringify(product.flavors || []) &&
                (item.observation?.trim() || '') ===
                  (product.observation?.trim() || '')
              ) {
                if (item.quantity <= 1) return null;
                return { ...item, quantity: item.quantity - 1 };
              }
              return item;
            })
            .filter(Boolean);

          return { cart };
        }),

      clearCart: () => {
        set({ cart: [] });
      },

      removeShopItems: (shopId) =>
        set((state) => {
          const newCart = state.cart.filter(
            (item) => item.shopInfo?.id !== shopId
          );
          return { cart: newCart };
        }),

      getTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: import.meta.env.VITE_CART_STORAGE_KEY,
      storage: cartStorage,
    }
  )
);

export default useCartStore;
