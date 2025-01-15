import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { filteredProductsState, productsState } from "../states/productsState";
import { fetchProductsFromFirestore } from "../../data/remoteDao/fetchProductsFromFirestore";
import { Product } from '../models/Product';


function useProducts() {
  const products = useRecoilValue<Product[]>(filteredProductsState);
  const setProducts = useRecoilState(productsState)[1];
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<Product[]> => {
    if (products.length > 0) return products; // Step 1: Use Recoil state if available

    setLoading(true);
    setError(null);

    try {
      // Step 3: Fetch from Firestore
      const firestoreProducts = await fetchProductsFromFirestore();
      setProducts(firestoreProducts);
      return firestoreProducts;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, fetchProducts, loading, error };
}

export default useProducts;
