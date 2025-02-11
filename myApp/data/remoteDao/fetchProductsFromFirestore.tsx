import {
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
  doc,
  getDoc,
  Timestamp,
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

/**
 * Fetch the remote last update timestamp for products from Firestore
 * @returns {Promise<Timestamp | null>} - A promise that resolves to the remote last update timestamp or null if not found
 */
export const fetchRemoteLastUpdate = async (): Promise<Timestamp | null> => {
  try {
    const docRef = doc(db, "metadata", "productSync"); // Access the metadata document for product sync
    const docSnapshot = await getDoc(docRef); // Get the document snapshot

    // If the document exists, return the updatedAt field as a string, otherwise return null
    if (docSnapshot.exists()) {
      return docSnapshot.data()?.updatedAt || null;
    } else {
      console.log("No such document found for productSync");
      return null; // If the document does not exist, return null
    }
  } catch (error) {
    console.error("Error fetching remote last update from Firestore:", error);
    return null; // Return null in case of any error
  }
};
