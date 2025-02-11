import { useState, useEffect } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  fetchProductsFromFirestore,
  fetchRemoteLastUpdate,
} from "../../data/remoteDao/fetchProductsFromFirestore";
import { Product } from "../models/Product";
import { authState } from "../states/authState";
import {
  filteredProductsState,
  allProductsState,
} from "../states/productsState";
import {
  getFromLocalStorage,
  getLocalLastUpdate,
  getProductsFromLocalStorage,
  saveLastUpdateToLocal,
  setToLocalStorage,
} from "../../data/localCacheDao/localStorageDao";
import safeParseDate from "../util/safeParseDate";

function useProducts() {
  const allProducts = useRecoilValue(allProductsState);
  const products = useRecoilValue<Product[]>(filteredProductsState);
  const setProducts = useSetRecoilState(allProductsState);
  const authenticatedUser = useRecoilValue(authState); // Authenticated user state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper: Check if sync is required based on timestamps
  const isSyncRequired = async (): Promise<boolean> => {
    console.log("Checking if sync is required...");

    const localLastUpdate = await getLocalLastUpdate(
      ); // Ensure it's safe for null result on fail
    const localCheckSync: string | null = await getFromLocalStorage(
      "checkProductSync"
    );

    console.log("Local last update:", localLastUpdate);
    console.log("Local check sync:", localCheckSync);


    if (localCheckSync){
      // Use the safeParseDate function to get a valid Date object or null
      const checkSyncDate = safeParseDate(localCheckSync);
    if (!checkSyncDate) {
      console.error("Invalid checkProductSync date");
      return true; // Invalid date, trigger sync
    }
    // Check if local check sync is from today, if not, trigger the pull
    const todayRef = new Date();
    const checkSyncDay = checkSyncDate.getDate();
    const todayDay = todayRef.getDate();
    const isSameDay = checkSyncDay === todayDay;

    if (isSameDay) {
      console.log("Local sync check is from today. Sync isnt required.");
      return false; // Sync is needed if not the same day
    }
  }else{
    console.log("no localCheckSync is avialble, skip the pre check...");
  }

  if (localLastUpdate){
    // Compare remote and local last update timestamps
    const remoteLastUpdate = await fetchRemoteLastUpdate();
    console.log("Remote last update:", remoteLastUpdate);

    if (
      !remoteLastUpdate ||
      remoteLastUpdate.seconds !== localLastUpdate.seconds ||
      remoteLastUpdate.nanoseconds !== localLastUpdate.nanoseconds
    ) {
      console.log("Remote last update differs from local. Sync required.");
      return true; // Trigger sync if the remote timestamp differs
    }

    console.log("No sync required. remote and lcoal are in sync");
    return false; // No sync needed
  }else{
    console.log("no localLastUpdate is aviilable , to make sure in sync, fetch to sync data");
    return true
  }
  };

  const fetchProducts = async (): Promise<Product[]> => {
    setLoading(true);
    setError(null);
    console.log("Fetching products...");

    let previousProducts: Product[] | null = null;
    let previousLastUpdate: string | null = null;
    let previousCheckProductSync: string | null = null;

    try {
      // Save previous data in case we need to revert in case of error
      previousProducts = await getFromLocalStorage("products");
      previousLastUpdate = await getFromLocalStorage("lastProductsUpdate");
      previousCheckProductSync = await getFromLocalStorage("checkProductSync");

      console.log("Previous products:", previousProducts);
      console.log("Previous last update:", previousLastUpdate);
      console.log("Previous check sync:", previousCheckProductSync);

      const needsSync = await isSyncRequired();
      const localData = previousProducts || [];

      if (
        needsSync //||
        //localData.length !== allProducts.length ||
        //allProducts.length <= 15
      ) {
        console.log("Syncing data...");

        // Fetch the products from Firestore
        const fetchedProducts = await fetchProductsFromFirestore();

        console.log("Fetched products:", fetchedProducts);

        // Update Recoil state and local storage transactionally
        setProducts(fetchedProducts);
        await setToLocalStorage("products", fetchedProducts);

        // Update lastProductsUpdate with the remote last update timestamp
        const remoteLastUpdate = await fetchRemoteLastUpdate();

        if (remoteLastUpdate) {
          await saveLastUpdateToLocal(remoteLastUpdate); // Save remote timestamp
          console.log(
            "Updated lastProductsUpdate with remote timestamp:",
            remoteLastUpdate
          );
        }

        // Mark the current day as the day the sync was checked
        await setToLocalStorage("checkProductSync", new Date().toISOString());
        console.log("Set checkProductSync to current timestamp.");

        return fetchedProducts; // Successfully return fetched products
      } else {
        console.log("No sync needed, using local data.");
        return localData; // If no sync needed, return local data
      }
    } catch (err: any) {
      // If something fails, revert to the previous state and update the error state
      if (previousProducts !== null)
        await setToLocalStorage("products", previousProducts);
      if (previousLastUpdate !== null)
        await setToLocalStorage("lastProductsUpdate", previousLastUpdate);
      if (previousCheckProductSync !== null)
        await setToLocalStorage("checkProductSync", previousCheckProductSync);

      console.error("Error occurred during product fetch:", err.message || err);
      setError(err.message || "An error occurred");
      return []; // Return empty array to handle failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const syncProductsState = async () => {
      console.log("Synchronizing products state...");

        const allProductsLocal = await fetchProducts();
        console.log("Updated allProductsLocal:", allProductsLocal);
      
    };

    syncProductsState();
  }, [authenticatedUser]); // React to changes in the authenticated user state

  return { products, fetchProducts, loading, error, allProducts };
}

export default useProducts;
