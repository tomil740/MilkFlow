import { db } from "../../backEnd/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { DemandItem } from '../../domain/models/DemandItem';


export async function addDemand(demand: DemandItem): Promise<void> {
  try {
    if (!demand) throw new Error("Demand data is required.");

    // Add the demand to the Firestore "Demands" collection
    await addDoc(collection(db, "Demands"), {
      ...demand,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding demand:", error);
    throw error;
  }
}
