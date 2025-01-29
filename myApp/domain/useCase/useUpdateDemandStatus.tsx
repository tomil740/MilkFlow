import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { checkInternetConnection } from "../../data/remoteDao/util/checkInternetConnection";


export interface UseUpdateDemandStatusResult {
  updating: boolean; 
  error: string | null;
  updateStatus: (
    demandId: string,
    currentStatus: string,
    nextStatus: string
  ) => Promise<void>;
  processCompleted: boolean; 
}

export const useUpdateDemandStatus = (): UseUpdateDemandStatusResult => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processCompleted, setProcessCompleted] = useState<boolean>(false);

  useEffect(() => {
    setProcessCompleted(false);
  }, []);

  const updateStatus = async (
    demandId: string,
    currentStatus: string,
    nextStatus: string
  ) => {
    if (updating || processCompleted) return;

    const TIMEOUT = 10000;
    const validTransitions: { [key in "pending" | "placed"]: string } = {
      pending: "placed",
      placed: "completed",
    };

    if (!validTransitions[currentStatus as keyof typeof validTransitions]) {
      setError("מצב נוכחי אינו תקין");
      return;
    }

    if (
      validTransitions[currentStatus as keyof typeof validTransitions] !==
      nextStatus
    ) {
      setError("מעבר מצב אינו חוקי");
      return;
    }

    const isConnected = await checkInternetConnection();
    if (!isConnected) {
      setError("אין חיבור לאינטרנט. אנא בדוק את החיבור ונסה שוב.");
      return;
    }

    setUpdating(true);
    setError(null);

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error("פסק זמן: בעיית רשת או תגובה איטית")),
        TIMEOUT
      )
    );

    try {
      const demandDoc = doc(db, "Demands", demandId);

      // Perform update and check if status was successfully set
      const updateAndValidateStatus = async (): Promise<boolean> => {
        await updateDoc(demandDoc, {
          status: nextStatus,
          updatedAt: Timestamp.now(),
        });

        const updatedDoc = await getDoc(demandDoc);
        return updatedDoc.exists() && updatedDoc.data()?.status === nextStatus;
      };

      const result = await Promise.race([
        updateAndValidateStatus(),
        timeoutPromise,
      ]);
      setProcessCompleted(result === true);

      
    } catch (error: any) {
      setError(error.message || "נכשל בעדכון המצב");
    } finally {
      setUpdating(false);
    }
  };

  return { updating, error, updateStatus, processCompleted };
};

