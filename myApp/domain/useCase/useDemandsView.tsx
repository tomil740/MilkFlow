import { useState, useEffect } from "react";
import { observeDemands, updateDemandStatus } from "../../data/remoteDao/demadnsView"; 
import { Demand } from '../models/Demand';
import { retryOperation } from '../../data/remoteDao/util';

 
export interface UseDemandsViewResult {
  data: Demand[];
  loading: boolean;
  error: string | null;
  updateStatus: (demandId: string, nextStatus: string) => Promise<boolean>;
}

export const useDemandsView = (
  isDistributer: boolean,
  id: string, 
  status: string
): UseDemandsViewResult => {
  const [data, setData] = useState<Demand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === "-1") {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = observeDemands(
      isDistributer,
      id,
      status,
      (fetchedData) => {
        setData(fetchedData);
        setLoading(false);
      },
      (errorMessage) => {
        setError(errorMessage); 
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isDistributer, id, status]);

  /**
   * Update the status of a demand with retries and timeout handling.
   * @param demandId - The ID of the demand to update.
   * @param nextStatus - The next status to set.
   * @returns Promise resolving to a boolean indicating success.
   */
  const updateStatus = async (
    demandId: string,
    nextStatus: string
  ): Promise<boolean> => {
    const TIMEOUT = 10000; // 10 seconds timeout

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: Network issue or slow response")),
        TIMEOUT
      )
    );

    try {
      const result = await Promise.race([
        retryOperation(() => updateDemandStatus(demandId, nextStatus), 3, 1000),
        timeoutPromise,
      ]);

      return (result!=null)?result:false;
    } catch (error) {
      console.error("Final failure in updateStatus:", error);
      return false;
    }
  };

  return { data, loading, error, updateStatus };
};