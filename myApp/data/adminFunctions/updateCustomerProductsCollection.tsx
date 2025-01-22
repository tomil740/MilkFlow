import { db } from "../../backEnd/firebaseConfig";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export async function updateCustomerProductsCollection(
  updates: { name: string; productsCollection: number[] }[]
): Promise<void> {
  for (const { name, productsCollection } of updates) {
    console.log(`Processing update for user: ${name}`);

    try {
      // Query the collection for users matching the given name
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("name", "==", name));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        console.error(`No user found with the name: ${name}`);
        continue; // Skip to the next update
      }

      if (querySnapshot.size > 1) {
        console.error(
          `Conflict: Multiple users found with the name: ${name}. Users:`,
          querySnapshot.docs.map((doc) => doc.data())
        );
        continue; // Skip to the next update
      }

      // If only one match is found, update their productsCollection
      const matchedDoc = querySnapshot.docs[0];
      const userId = matchedDoc.id;

      await setDoc(
        doc(usersRef, userId),
        { productsCollection },
        { merge: true } // Merge to avoid overwriting other fields
      );

      console.log(
        `Successfully updated productsCollection for user: ${name} (ID: ${userId})`
      );
    } catch (error) {
      console.error(
        `Failed to update productsCollection for user: ${name}. Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}

//test this method should replace the matched found user "ProductsCollection" field not to update it!!!
