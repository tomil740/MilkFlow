import { useState, useEffect } from "react";
import {useSetRecoilState, useRecoilValue } from "recoil";
import { fetchProductsFromFirestore } from "../../data/remoteDao/fetchProductsFromFirestore";
import { Product } from "../models/Product";
import { authState } from "../states/authState";
import {
  filteredProductsState,
  allProductsState,
} from "../states/productsState"; 
import { getFromLocalStorage } from "../../data/localCacheDao/localStorageDao";

function useProducts() {
  const allProducts = useRecoilValue(allProductsState);
  const products = useRecoilValue<Product[]>(filteredProductsState);
  const setProducts = useSetRecoilState(allProductsState); 
  const authenticatedUser = useRecoilValue(authState); // Authenticated user state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);

    try {
      // Validate if data needs fetching
      const localData = await getFromLocalStorage("products");
      if (localData.length === allProducts.length && allProducts.length >= 15) {
        return allProducts; // Return cached data
      }

      // Fetch fresh data from Firestore if necessary
      const fetchedProducts = await fetchProductsFromFirestore();

      // Update state and return the fetched data
      setProducts(fetchedProducts);
      return fetchedProducts;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const syncProductsState = async () => {
      let allProductsLoacl = allProducts
      if(allProducts.length < 15){
        const isLoadingProducts = (await getFromLocalStorage("products")).length;
        if (isLoadingProducts != allProducts.length) return;
        allProductsLoacl = await fetchProducts();
      }
    };

    syncProductsState();
  }, [authenticatedUser]); // React to changes in the authenticated user state

  return { products, fetchProducts, loading, error, allProducts };
}

export default useProducts;
