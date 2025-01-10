import { atom, selector } from "recoil";
import { productsState } from "./productsState";
import { Product } from '../models/Product';
import { CartItem } from '../models/CartItem';



// Cart atom for global state
export const cartState = atom<CartItem[]>({
  key: "cartState",
  default: [], // Array of CartItem
});

// Selector for pulling detailed product data
export const cartProductsSelector = selector({
  key: "cartProductsSelector",
  get: ({ get }) => {
    const cart = get(cartState);
    const products = get(productsState);
    console.log("MyCart cartRef",cart)
    console.log("cartRef my products",products)
    
    return cart
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { ...product, amount: item.amount } : null;
      })
      .filter((item): item is Product & { amount: number } => item !== null);
  },
});
