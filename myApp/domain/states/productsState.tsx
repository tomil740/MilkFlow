import { atom } from "recoil";
import { selector } from "recoil";
import { Product } from '../models/Product';



const localStorageKey = "products";

const getSavedProducts = (): Product[] => {
  const saved = localStorage.getItem(localStorageKey);
  return saved ? JSON.parse(saved) : []; // Return saved products or empty array
};

export const productsState = atom<Product[]>({
  key: "productsState",
  default: getSavedProducts(), // Default to products from localStorage or empty array
  effects_UNSTABLE: [
    ({ onSet }) => {
      // Save to localStorage whenever productsState changes
      onSet((newState) => {
        localStorage.setItem(localStorageKey, JSON.stringify(newState));
      });
    },
  ],
});

export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: "", // Initially no category selected
});

export const filteredProductsState = selector({
  key: "filteredProductsState",
  get: ({ get }) => {
    const products = get(productsState);
    console.log("my products state",products)
    const selectedCategory = get(selectedCategoryState);

    // If no category is selected, return all products
    if (!selectedCategory || selectedCategory.length < 1) {
      return products;
    }

    // Filter products based on the selected category
    return products.filter((product) => product.category === selectedCategory);
  },
});
