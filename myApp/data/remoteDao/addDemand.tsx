import { db } from "../../backEnd/firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Demand, DemandToPush } from '../../domain/models/Demand';


export async function addDemand(demand: Demand): Promise<void> {
  try {
    if (!demand) throw new Error("Demand data is required.");

    const demandToPush: DemandToPush = {
      userId: demand.userId,
      distributerId: demand.distributerId,
      status: demand.status,
      createdAt: demand.createdAt,
      updatedAt: demand.updatedAt,
      products: demand.products,
    };
      // Add the demand to the Firestore "Demands" collection
      await addDoc(collection(db, "Demands"), {
        ...demandToPush,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
  } catch (error) {
    console.error("Error adding demand:", error);
    throw error;
  }
}
