import { atom } from "recoil";
import { selector } from "recoil";
import { Product } from '../models/Product';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from "../../data/localCacheDao/localStorageDao";

  
const localStorageKey = "products"; 

export const productsState = atom<Product[]>({
  key: "productsState",
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

export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: "", // Initially no category selected
});

export const filteredProductsState = selector<Product[]>({
  key: "filteredProductsState",
  get: ({ get }) => {
    const products = get(productsState);
    const selectedCategory = get(selectedCategoryState);

    // If no category is selected, return all products
    if (!selectedCategory || selectedCategory.length < 1) {
      return products;
    }

    // Filter products based on the selected category
    return products.filter((product) => product.category === selectedCategory);
  },
});
