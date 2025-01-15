import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {db} from "../../backEnd/firebaseConfig"

// Fetches distributer users from Firestore
export const fetchDistributers = async () => {
  try {
    const usersRef = collection(db, "users"); // Reference to the "users" collection
    const distributersQuery = query(
      usersRef,
      where("isDistributer", "==", true)
    ); // Query for distributers
    const snapshot = await getDocs(distributersQuery); // Execute the query

    // Map Firestore documents to an array of distributer objects
    const distributers = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
    }));

    return distributers; // Return the list of distributers
  } catch (error) {
    console.error("Error fetching distributers:", error);
    throw new Error("Failed to fetch distributers.");
  }
};
