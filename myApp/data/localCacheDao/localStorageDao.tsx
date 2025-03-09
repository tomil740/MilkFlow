import { Timestamp } from "firebase/firestore";
import { Product } from "../../domain/models/Product";

// Define a type for the object stored in localStorage (adjust according to your app's data structure)
interface StoredData {
  products?: Product[]; // Add the specific types for your app's data, here it's `products` for example
  lastProductsUpdate?: string; // Timestamp as string
  checkProductSync?: string; // Timestamp as string
}

/**
 * Get data from localStorage
 * @param key - The key for the data in localStorage
 * @returns {Promise<any[]>} - A promise that resolves to the parsed data or an empty array
 */
export async function getFromLocalStorage<T>(key: string): Promise<T | null> {
  return new Promise((resolve) => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        resolve(JSON.parse(data) as T); // Safely parse the data into the expected type
      } catch (e) {
        console.error(`Error parsing ${key} from localStorage`, e);
        resolve(null); // Return null if parsing fails
      }
    } else {
      resolve(null); // Return null if no data exists
    }
  });
}

/**
 * Set data to localStorage
 * @param key - The key for storing the data in localStorage
 * @param object - The object to store in localStorage
 * @returns {Promise<void>} - A promise that resolves when data is saved
 */
export async function setToLocalStorage<T>(
  key: string,
  object: T
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const serializedData = JSON.stringify(object);
      localStorage.setItem(key, serializedData);
      resolve();
    } catch (e) {
      console.error(`Error saving ${key} to localStorage`, e);
      reject(new Error("Failed to save to localStorage")); // Reject in case of error
    }
  });
}


/**
 * Get products from localStorage
 * @returns {Promise<Product[]>} - A promise that resolves to an array of products
 */
export async function getProductsFromLocalStorage(): Promise<Product[]> {
  try {
    // Get products from local storage
    const products = await getFromLocalStorage("products");

    // Ensure it's an array of Product or return an empty array if invalid
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Error fetching products from localStorage:", error);
    return []; // Fallback to an empty array on error
  }
}
export
const getLocalLastUpdate = async (): Promise<Timestamp | null> => {
  const localData: string | null = await getFromLocalStorage(
    "lastProductsUpdate"
  );
  if (!localData) return null;

  try {
    const parsedData = JSON.parse(localData) as Timestamp;
    if (
      typeof parsedData.seconds === "number" &&
      typeof parsedData.nanoseconds === "number"
    ) {
      return parsedData;
    }
  } catch (error) {
    console.error("Failed to parse local last update:", error);
  }
  return null;
};

const areTimestampsEqual = (
  remote: Timestamp,
  local: Timestamp
): boolean => {
  return (
    remote.seconds === local.seconds && remote.nanoseconds === local.nanoseconds
  );
};

export const saveLastUpdateToLocal = async (timestamp: Timestamp) => {
  const localTimestamp = toPlainTimestamp(timestamp);
  await setToLocalStorage("lastProductsUpdate", JSON.stringify(localTimestamp));
};

const toPlainTimestamp = (timestamp: Timestamp) => ({
  seconds: timestamp.seconds,
  nanoseconds: timestamp.nanoseconds,
});
