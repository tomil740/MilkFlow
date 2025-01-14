import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { filteredProductsState, productsState } from "../states/productsState";
import { fetchProductsFromFirestore } from "../../data/remoteDao/fetchProductsFromFirestore";

function useProducts(){
  const products = useRecoilValue(filteredProductsState);
  const setProducts = useRecoilState(productsState)[1];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
 
  const fetchProducts = async () => {
    if (products.length > 0) return products; // Step 1: Use Recoil state if available

    setLoading(true);
    setError(null);

    try {
      // Step 3: Fetch from Firestore
      const firestoreProducts = await fetchProductsFromFirestore();
      setProducts(firestoreProducts);
      return firestoreProducts;
    } catch (err) {
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
};

export default useProducts;
