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
  getDocs,
  startAfter,
  limit,
  getDoc,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { Demand } from "../../domain/models/Demand";

/**
 * Fetch paginated demands from Firestore.
 * @param isDistributer - Whether the user is a distributor.
 * @param id - The ID to match (distributorId or uid).
 * @param status - The status to filter by.
 * @param pageSize - The number of documents per page.
 * @param lastDoc - The last document from the previous query (for pagination).
 * @returns Paginated demands and the last document.
 */
export const fetchPaginatedDemands = async (
  isDistributer: boolean,
  id: string,
  status: string,
  pageSize: number,
  lastDoc: QueryDocumentSnapshot | null
): Promise<{ demands: Demand[]; lastDoc: QueryDocumentSnapshot | null }> => {
  try {
    const demandsRef = collection(db, "Demands");
    const q = query(
      demandsRef,
      where(isDistributer ? "distributerId" : "userId", "==", id),
      where("status", "==", status),
      orderBy("updatedAt", "desc"),
      ...(lastDoc ? [startAfter(lastDoc)] : []), // Handle pagination
      limit(50)
    );

    const snapshot = await getDocs(q);
    console.log(
      `Fetched ${snapshot.size} documents for ${
        isDistributer ? "distributer" : "user"
      } with status ${status}`
    );
    const demands: Demand[] = snapshot.docs.map((doc) => ({
      demandId: doc.id,
      ...(doc.data() as Omit<Demand, "demandId">),
    }));

    // Return demands and the last document in the snapshot
    return {
      demands,
      lastDoc:
        snapshot.docs.length > 0
          ? snapshot.docs[snapshot.docs.length - 1]
          : null,
    };
  } catch (error) {
    console.error("Error fetching paginated demands:", error);
    throw new Error("Failed to fetch demands. Please try again.");
  }
};

/**
 * Set up a real-time subscription for demand updates.
 * @param isDistributer - Whether the user is a distributor.
 * @param id - The ID to match (distributorId or uid).
 * @param status - The status to filter by.
 * @param onUpdate - Callback to handle updates (push changes to React Query cache).
 * @param onError - Callback for errors during real-time sync.
 * @returns Unsubscribe function to stop the listener.
 */
export const subscribeToDemandUpdates123 = (
  isDistributer: boolean,
  id: string,
  status: string,
  onUpdate: (updatedDemand: Demand) => void,
  onError: (error: string) => void
): (() => void) => {
  try {
    const demandsRef = collection(db, "Demands");
    const q = query(
      demandsRef,
      where(isDistributer ? "distributerId" : "userId", "==", id),
      where("status", "==", status)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const demand = {
            demandId: change.doc.id,
            ...(change.doc.data() as Omit<Demand, "demandId">),
          };

          onUpdate(demand); // Push changes into React Query cache
        });
      },
      (error: FirestoreError) => {
        console.error("Error during real-time sync:", error);
        onError(error.message);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Failed to set up subscription:", error);
    throw new Error("Failed to set up real-time updates.");
  }
};

/**
 * Update the status of a specific demand.
 * @param demandId - The ID of the demand to update.
 * @param nextStatus - The next status to set.
 * @param verify - Whether to verify the update by reading the document.
 * @returns Promise resolving to a boolean indicating success.
 */
export const updateDemandStatus = async ({
  demandId,
  nextStatus,
  verify,
}: UpdateDemandStatusPayload): Promise<boolean> => {
  try {
    const demandDoc = doc(db, "Demands", demandId);
    await updateDoc(demandDoc, {
      status: nextStatus,
      updatedAt: Timestamp.now(),
    });
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
  console.log(demandId, nextStatus, verify); // For now, we log it
  return true; // Simulating a successful update
};

interface UpdateDemandStatusPayload {
  demandId: string;
  nextStatus: string;
  verify?: boolean; // Optional parameter
}


/*import {
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
/*
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
/*
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

*/
