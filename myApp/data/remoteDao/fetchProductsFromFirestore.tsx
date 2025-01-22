import {
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { Product } from '../../domain/models/Product';

/**
 * Fetch products from Firestore
 * @returns {Promise<Product[]>} - An array of products from the Firestore collection
 */
export const fetchProductsFromFirestore = async (): Promise<Product[]> => {
  try {
    const productsCollection = collection(db, "products"); // Use `db` from firebaseConfig
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(
      productsCollection
    );

    // Map and return product data
     const a = snapshot.docs.map((doc) => ({...doc.data() } as Product));
     return a;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    throw error;
  }
};
