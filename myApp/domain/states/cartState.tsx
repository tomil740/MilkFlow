import { atom, selector } from "recoil";
import { syncEffect } from "recoil-sync";
import { productsState } from "./productsState";
import { Product } from '../models/Product';
import { CartItem } from '../models/CartItem';
import { CartProductItem } from '../models/CartProductItem';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from "../../data/localCacheDao/localStorageDao";

//todo : on auth should set the global state for the authinticated id to sync here as well
const localStorageKey = "cart_fAHk3bhvX8yPRdTlS4zk";

// Synchronous function to get initial cart data
const getInitialCartState = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(localStorageKey);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch (error) {
    console.error("Error reading cart from localStorage:", error);
    return [];
  }
};

export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: getInitialCartState(), // Synchronously get cart data
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Save to localStorage whenever cartState changes
      onSet((newState) => {
        setToLocalStorage(localStorageKey, newState);
      });
    },
  ],
});


// Selector for pulling detailed product data
export const cartProductsSelector = selector({
  key: "cartProductsSelector",
  get: ({ get }) => {
    const cart = get(cartState);
    const products = get(productsState);

    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { ...product, amount: item.amount } : null;
      })
      .filter((item): item is Product & { amount: number } => item !== null);
  },
});
