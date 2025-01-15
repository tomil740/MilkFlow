import { useState } from "react";
import { updateDemandStatus } from "../../data/remoteDao/DemadnsView";

export interface UseUpdateDemandStatusResult {
  updating: boolean;
  error: string | null;
  updateStatus: (demandId: string, nextStatus: string) => Promise<void>;
}

export const useUpdateDemandStatus = (): UseUpdateDemandStatusResult => {
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (demandId: string, nextStatus: string) => {
    console.log("update demand ",demandId)
    setUpdating(true);
    setError(null);
    try {
      await updateDemandStatus(demandId, nextStatus);
    } catch (err: any) {
      setError(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return { updating, error, updateStatus };
};
