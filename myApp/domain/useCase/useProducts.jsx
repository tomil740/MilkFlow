import { useState } from "react";
import { useRecoilState } from "recoil";
import { productsState } from "../states/productsState";
import {
  getProductsFromLocalStorage,
  setProductsToLocalStorage,
} from "../../data/localCacheDao/localStorageDao";
import { fetchProductsFromFirestore } from "../../data/remoteDao/fetchProductsFromFirestore";

const useProducts = () => {
  const [products, setProducts] = useRecoilState(productsState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    if (products.length > 0) return products; // Step 1: Use Recoil state if available

    setLoading(true);
    setError(null);

    try {
      // Step 2: Try fetching from local storage
      const cachedProducts = await getProductsFromLocalStorage(); // Wrapping in async for future flexibility
      if (cachedProducts.length > 0) {
        setProducts(cachedProducts);
        return cachedProducts;
      }

      // Step 3: Fetch from Firestore
      const firestoreProducts = await fetchProductsFromFirestore();
      setProducts(firestoreProducts);
      await setProductsToLocalStorage(firestoreProducts); // Update local storage
      return firestoreProducts;
    } catch (err) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { products, fetchProducts, loading, error };
};

export default useProducts;