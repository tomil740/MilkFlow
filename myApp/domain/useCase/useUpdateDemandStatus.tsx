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

    const TIMEOUT = 10000; // 10 seconds timeout
    const validTransitions: { [key in "pending" | "placed"]: string } = {
      pending: "placed",
      placed: "completed",
    };

    if (!Object.keys(validTransitions).includes(currentStatus)) {
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

    // Check internet connection
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

    const updateDemandStatus = async (): Promise<boolean> => {
      try {
        const demandDoc = doc(db, "Demands", demandId);
        console.log("the status",nextStatus)
        await updateDoc(demandDoc, {
          status: nextStatus,
          updatedAt: Timestamp.now(),
        });
        const updatedDoc = await getDoc(demandDoc);
        return updatedDoc.exists() && updatedDoc.data()?.status === nextStatus;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "שגיאה לא ידועה התרחשה"
        );
      }
    };

    try {
      const result = await Promise.race([updateDemandStatus(), timeoutPromise]);
      setProcessCompleted(result === true);
    } catch (error: any) {
      setError(error.message || "נכשל בעדכון המצב");
    } finally {
      setUpdating(false);
    }
  };

  return { updating, error, updateStatus, processCompleted };
};
