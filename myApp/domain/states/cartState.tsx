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

export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: getFromLocalStorage(localStorageKey), // Default to products from localStorage or empty array
    effects_UNSTABLE: [
      ({ onSet }) => {
        // Save to localStorage whenever productsState changes
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
