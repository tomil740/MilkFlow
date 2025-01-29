import { atom } from "recoil";
import { selector } from "recoil";
import { Product } from '../models/Product';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from "../../data/localCacheDao/localStorageDao";
import { authState } from "./authState"; 

 
const localStorageKey = "products";

// Atom to store all products with caching and local storage effects
export const allProductsState = atom<Product[]>({
  key: "allProductsState",
  default: [], // Default empty list
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // Initialize from local storage
      (async () => {
        const storedData = await getFromLocalStorage(localStorageKey);
        if (storedData?.length) {
          setSelf(storedData);
        }
      })();

      // Persist changes to local storage
      onSet(async (newState) => {
        await setToLocalStorage(localStorageKey, newState);
      });
    },
  ],
});

// Selector for the main product logic based on the authenticated user
export const productsState = selector<Product[]>({
  key: "productsState",
  get: ({ get }) => {
    const allProducts = get(allProductsState);
    const authenticatedUser = get(authState);

    if (!authenticatedUser) {
      return []; // No products for guests
    }

    if (authenticatedUser.isDistributer) {
      return allProducts; // Distributor gets all products
    }

    // Non-distributor: Filter by `productsCollection`
    return allProducts.filter((product) =>
      authenticatedUser.productsCollection?.includes(product.id)
    );
  },
});

// Selector for category-based filtering
export const filteredProductsState = selector<Product[]>({
  key: "filteredProductsState",
  get: ({ get }) => {
    const products = get(productsState);
    const selectedCategory = get(selectedCategoryState);

    // Return all products if no category is selected
    if (!selectedCategory) {
      return products;
    }

    // Filter by category
    return products.filter((product) => product.category === selectedCategory);
  },
});




export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: "", // Initially no category selected
});

