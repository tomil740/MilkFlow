import { db } from "../../backEnd/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
} from "firebase/firestore";
import { Product } from "../../domain/models/Product";

/**
 * Replaces the entire products collection with the provided data.
 * @param collectionName - The name of the products collection.
 * @param products - The new products data to replace the collection.
 */
export async function replaceProductsCollection(
  products: Product[]
): Promise<void> {
  try {
    console.log(`Starting to replace the products collection: ${"products"}`);

    // Delete all existing documents in the collection
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);

    for (const docSnapshot of querySnapshot.docs) {
      await setDoc(doc(productsRef, docSnapshot.id), {}, { merge: false }); // Clearing documents
    }

    // Add new products
    for (const product of products) {
      const productRef = doc(productsRef, product.id.toString());
      await setDoc(productRef, product, { merge: false });
      console.log(`Added product with ID: ${product.id}`);
    }

    console.log("Successfully replaced the products collection.");
  } catch (error) {
    console.error(
      `Failed to replace the products collection. Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Updates the products collection by adding new products with unique IDs.
 * @param collectionName - The name of the products collection.
 * @param products - The new products to add to the collection.
 */
export async function updateProductsWithUniqueIds(
  collectionName: string,
  products: { id: number; [key: string]: any }[]
): Promise<void> {
  try {
    console.log(
      `Starting to update the products collection: ${collectionName}`
    );

    const productsRef = collection(db, collectionName);
    const existingDocs = await getDocs(productsRef);
    const existingIds = new Set(existingDocs.docs.map((doc) => doc.id));

    for (const product of products) {
      if (existingIds.has(product.id.toString())) {
        console.log(`Skipping duplicate product with ID: ${product.id}`);
        continue;
      }

      const productRef = doc(productsRef, product.id.toString());
      await setDoc(productRef, product, { merge: true });
      console.log(`Added product with ID: ${product.id}`);
    }

    console.log(
      "Successfully updated the products collection with unique IDs."
    );
  } catch (error) {
    console.error(
      `Failed to update the products collection. Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
