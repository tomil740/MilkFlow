import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
  updateDoc,
  doc,
  QuerySnapshot,
  QueryDocumentSnapshot,
  FirestoreError,
  orderBy,
} from "firebase/firestore";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  activeDemandsState,
  pendingDemandsState,
  completedDemandsState,
} from "../states/demands";
import { db } from "../../backEnd/firebaseConfig";
import { authState } from "../states/authState";
import { checkInternetConnection } from "../../data/remoteDao/util/checkInternetConnection";


export const useDemandsSync = () => {
  const setActiveDemands = useSetRecoilState(activeDemandsState);
  const setPendingDemandsState = useSetRecoilState(pendingDemandsState);
  const setCompletedDemandsState = useSetRecoilState(completedDemandsState);

  const activeDemands = useRecoilValue(activeDemandsState);
  const pendingDemands = useRecoilValue(pendingDemandsState);
  const completedDemands = useRecoilValue(completedDemandsState);
  const user = useRecoilValue(authState); // Assuming this contains user info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const attachObserver = (
    q: any,
    setRecoilState: any, // Directly update Recoil state
    setLoading: any,
    setError: any
  ) => {
    return onSnapshot(
      q,
      (snapshot: QuerySnapshot) => {
        const data = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecoilState(data); // Update Recoil state
        setLoading(false); // Stop loading when data is synced
      },
      (err: FirestoreError) => {
        setError(`Error fetching data: ${err.message}`);
        setLoading(false);
        console.error("Error fetching data: ", err.message);
      }
    );
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const demandsRef = collection(db, "Demands");
    const queries = {
      pending: query(
        demandsRef,
        where(user.isDistributer ? "distributerId" : "userId", "==", user.uid),
        where("status", "==", "pending"),
        orderBy("updatedAt", "desc") // Order by updatedAt field, most recent first
      ),
      inProgress: query(
        demandsRef,
        where(user.isDistributer ? "distributerId" : "userId", "==", user.uid),
        where("status", "==", "placed"),
        orderBy("updatedAt", "desc") // Order by updatedAt field, most recent first
      ),
      completed: query(
        demandsRef,
        where(user.isDistributer ? "distributerId" : "userId", "==", user.uid),
        where("status", "==", "completed"),
        orderBy("updatedAt", "desc"), // Order by updatedAt field, most recent first
        limit(20)
      ),
    };

    // Attach the listeners to keep data in sync and update Recoil state
    const unsubscribers: (() => void)[] = [];
    unsubscribers.push(
      attachObserver(
        queries.pending,
        setPendingDemandsState,
        setLoading,
        setError
      )
    );
    unsubscribers.push(
      attachObserver(queries.inProgress, setActiveDemands, setLoading, setError)
    );
    unsubscribers.push(
      attachObserver(
        queries.completed,
        setCompletedDemandsState,
        setLoading,
        setError
      )
    );

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user]);

  /**
   * Wrapper function to handle demand status update with better user feedback.
   */
  const updateStatus = useCallback(
    async (demandId: string, nextStatus: string): Promise<boolean> => {
      const TIMEOUT = 10000; // 10 seconds timeout
      setError(null);

      // Pre-check for internet connection
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        setError("אין חיבור לאינטרנט. נסה שוב כאשר החיבור יחזור.");
        return false;
      }

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: Slow network response")),
          TIMEOUT
        )
      );

      try {
        await Promise.race([
          updateDoc(doc(db, "Demands", demandId), { status: nextStatus }),
          timeoutPromise,
        ]);
        return true;
      } catch (error: any) {
        setError(
          error.message.includes("Timeout")
            ? "שגיאה: חיבור רשת איטי מדי. נסה שוב."
            : "שגיאה בעדכון הסטטוס. אנא נסה מאוחר יותר."
        );
        return false;
      }
    },
    []
  );

  return {
    activeDemands,
    pendingDemands,
    completedDemands,
    loading,
    error,
    updateStatus,
  };
};
