import { atom } from "recoil";
import { selector } from "recoil";


export const productsState = atom({
  key: "productsState",
  default: [], // Initially empty, will be populated later
});

export const selectedCategoryState = atom({
  key: "selectedCategoryState",
  default: "", // Initially no category selected
});

export const filteredProductsState = selector({
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
