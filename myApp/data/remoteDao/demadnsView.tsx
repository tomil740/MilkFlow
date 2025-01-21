import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  FirestoreError,
  Timestamp,
  getDoc
} from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { Demand } from '../../domain/models/Demand';




/**
 * Fetch and observe demands from Firestore.
 * @param isDistributer - Whether the user is a distributor.
 * @param id - The ID to match (distributorId or uid).
 * @param status - The status to filter by.
 * @param onSuccess - Callback for successful data retrieval.
 * @param onError - Callback for errors during data retrieval.
 * @returns Unsubscribe function to stop observing data.
 */
export const observeDemands = (
  isDistributer: boolean,
  id: string,
  status: string,
  onSuccess: (demands: Demand[]) => void,
  onError: (errorMessage: string) => void
): (() => void) => {
  console.log("called observedaemdns with id ",id )
    console.log("calle with status ", status);
 



  const demandsRef = collection(db, "Demands");
  const q = query(
    demandsRef,
    where(isDistributer ? "distributerId" : "userId", "==", id),
    where("status", "==", status),
    orderBy("updatedAt", "desc")
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const demands: Demand[] = snapshot.docs.map((doc) => ({
        demandId: doc.id,
        ...(doc.data() as Omit<Demand, "demandId">),
      }));
      onSuccess(demands);
    },
    (error: FirestoreError) => {
      console.error("Error observing demands:", error);
      onError(error.message);
    }
  );

  return unsubscribe;
};

/**
 * Update the status of a specific demand and optionally verify the update.
 * @param demandId - The ID of the demand to update.
 * @param nextStatus - The next status to set.
 * @param verify - Whether to verify the update by reading the document.
 * @returns Promise resolving to a boolean indicating success.
 */
export const updateDemandStatus = async (
  demandId: string,
  nextStatus: string,
  verify: boolean = true
): Promise<boolean> => {
  try {
    const demandDoc = doc(db, "Demands", demandId);
    await updateDoc(demandDoc, { status: nextStatus, updatedAt: Timestamp.now() });
    console.log("Updated demand successfully:", demandId);

    if (verify) {
      const updatedDoc = await getDoc(demandDoc);
      return updatedDoc.exists() && updatedDoc.data()?.status === nextStatus;
    }

    return true; // Assume success if no verification
  } catch (error) {
    console.error("Failed to update demand status:", error);
    return false;
  }
};


