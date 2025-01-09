import { collection, getDocs } from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";

/**
 * Fetch products from Firestore
 * @returns {Promise<Array>} - An array of products from the Firestore collection
 */
export const fetchProductsFromFirestore = async () => {
  try {
    const productsCollection = collection(db, "products"); // Use `db` from firebaseConfig
    const snapshot = await getDocs(productsCollection);

    // Map and return product data
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    throw error;
  }
};
