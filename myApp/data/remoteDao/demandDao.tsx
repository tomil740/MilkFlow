import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  doc,
  Query,
  QuerySnapshot,
  FirestoreError,
  DocumentData,
  getDoc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";

/**
 * Create a Firestore query to fetch demands based on user role and status.
 *
 * @param uid - User ID (distributor or customer).
 * @param isDistributer - Boolean indicating if the user is a distributor.
 * @param status - The status of the demands to filter by.
 * @param limitResults - Optional limit on the number of results.
 * @returns Firestore query object.
 */
export const fetchDemandQuery = (
  uid: string,
  isDistributer: boolean,
  status: string,
  limitResults?: number
): Query<DocumentData> => {
  const demandsRef = collection(db, "Demands");
  let baseQuery = query(
    demandsRef,
    where(isDistributer ? "distributerId" : "userId", "==", uid),
    where("status", "==", status),
    orderBy("updatedAt", "desc")
  );

  if (limitResults) {
    baseQuery = query(baseQuery, limit(limitResults));
  }

  return baseQuery;
};

/**
 * Attach a real-time observer to a Firestore query.
 *
 * @param demandQuery - The Firestore query to observe.
 * @param onSuccess - Callback to handle successful data fetching.
 * @param onError - Callback to handle errors during fetching.
 * @returns Unsubscribe function to detach the observer.
 */
export const attachDemandObserver = (
  demandQuery: Query<DocumentData>,
  onSuccess: (data: any[]) => void,
  onError: (err: FirestoreError) => void
): (() => void) => {
  return onSnapshot(
    demandQuery,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      onSuccess(data);
    },
    (err: FirestoreError) => {
      console.error("Error fetching data: ", err.message);
      onError(err);
    }
  );
};

/*
export const updateDemandStatus = async (
  demandId: string,
  nextStatus: string
): Promise<void> => {
  try {
    const demandRef = doc(db, "Demands", demandId);
    await updateDoc(demandRef, { status: nextStatus });
  } catch (error) {
    console.error("Error updating demand status: ", error);
    throw error;
  }
};
*/
/**
 * Update the status of a specific demand in Firestore.
 *
 * @param demandId - The ID of the demand to update.
 * @param nextStatus - The new status to set for the demand.
 * @returns Promise resolving when the update is complete.
 */
export const updateDemandStatus = async (
  demandId: string,
  nextStatus: string
): Promise<boolean> => {
  try {
    const demandDoc = doc(db, "Demands", demandId);

    // Perform the update and validate the status update
    await updateDoc(demandDoc, {
      status: nextStatus,
      updatedAt: Timestamp.now(),
    });

    const updatedDoc = await getDoc(demandDoc);
    return updatedDoc.exists() && updatedDoc.data()?.status === nextStatus;
  } catch (error) {
    console.error("Error updating demand status: ", error);
    return false
  }
};
