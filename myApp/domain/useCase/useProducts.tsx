import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { fetchProductsFromFirestore } from "../../data/remoteDao/fetchProductsFromFirestore";
import { Product } from "../models/Product";
import { authState } from "../states/authState";
import { filteredProductsState, productsState } from "../states/productsState";

function useProducts() { 
  const allProducts = useRecoilValue(productsState)
  const products = useRecoilValue<Product[]>(filteredProductsState);
  const setProducts = useRecoilState(productsState)[1];
  const authenticatedUser = useRecoilValue(authState); // Authenticated user state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);

    try {
      const firestoreProducts = await fetchProductsFromFirestore();
      return firestoreProducts; // Return raw data for filtering
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    const syncProductsState = async () => {
      const allProducts = await fetchProducts();

      if (authenticatedUser) {
        if (authenticatedUser.isDistributer) {
          // Distributor: Use all products
          setProducts(allProducts);
        } else if (authenticatedUser.productsCollection) {
          // Non-distributor: Filter by `productsCollection`
          const filtered = allProducts.filter((product) =>
            authenticatedUser.productsCollection.includes(product.id)
          );
          setProducts(filtered); // Update the single global state
        }
      }
    };

    syncProductsState();
  }, [authenticatedUser]); // React to changes in the authenticated user state

  return { products, fetchProducts, loading, error, allProducts };
}

export default useProducts;
