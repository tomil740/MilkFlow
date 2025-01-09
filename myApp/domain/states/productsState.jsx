import { atom } from "recoil";
import { selector } from "recoil";


export const productsState = atom({
  key: "productsState",
  default: [], // Initially empty, will be populated later
});


export const filteredProductsState = selector({
  key: "filteredProductsState",
  get: ({ get }) => {
    const products = get(productsState);
    // Example: Replace "category" with your filter logic
    return products.filter((product) => product.category === "desiredCategory");
  },
});
