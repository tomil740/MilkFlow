import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";

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
      setError("Invalid current status");
      return;
    }

    if (
      validTransitions[currentStatus as keyof typeof validTransitions] !==
      nextStatus
    ) {
      setError("Invalid status transition");
      return;
    }

    setUpdating(true);
    setError(null);

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: Network issue or slow response")),
        TIMEOUT
      )
    );

    const updateDemandStatus = async (): Promise<boolean> => {
      try {
        const demandDoc = doc(db, "Demands", demandId);
        await updateDoc(demandDoc, {
          status: nextStatus,
          updatedAt: Timestamp.now(),
        });
        const updatedDoc = await getDoc(demandDoc);
        return updatedDoc.exists() && updatedDoc.data()?.status === nextStatus;
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Unknown error occurred"
        );
      }
    };

    try {
      const result = await Promise.race([updateDemandStatus(), timeoutPromise]);
      setProcessCompleted(result === true);
    } catch (error: any) {
      setError(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return { updating, error, updateStatus, processCompleted };
};
