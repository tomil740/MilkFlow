import { useState, useEffect } from "react";
import { observeDemands, updateDemandStatus } from "../../data/remoteDao/DemadnsView";
import { Demand } from '../models/Demand';


export interface UseDemandsViewResult {
  data: Demand[];
  loading: boolean;
  error: string | null;
  updateStatus: (demandId: string, nextStatus: string) => Promise<void>;
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

  const updateStatus = async (
    demandId: string,
    nextStatus: string
  ): Promise<void> => {
    try {
      await updateDemandStatus(demandId, nextStatus);
    } catch (error) {
      throw error;
    }
  };

  return { data, loading, error, updateStatus };
};