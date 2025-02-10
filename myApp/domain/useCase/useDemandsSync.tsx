import { useEffect, useState, useCallback } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import {
  activeDemandsState,
  pendingDemandsState,
  completedDemandsState,
} from "../states/demands";
import { authState } from "../states/authState";
import { checkInternetConnection } from "../../data/remoteDao/util/checkInternetConnection";
import {
  fetchDemandQuery,
  attachDemandObserver,
  updateDemandStatus,
} from "../../data/remoteDao/demandDao";

export const useDemandsSync = () => {
  const setActiveDemands = useSetRecoilState(activeDemandsState);
  const setPendingDemandsState = useSetRecoilState(pendingDemandsState);
  const setCompletedDemandsState = useSetRecoilState(completedDemandsState);

  const activeDemands = useRecoilValue(activeDemandsState);
  const pendingDemands = useRecoilValue(pendingDemandsState);
  const completedDemands = useRecoilValue(completedDemandsState);
  const user = useRecoilValue(authState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const unsubscribers: (() => void)[] = [];

    const attachObservers = async () => {
      try {
        setLoading(true);

        const pendingQuery = fetchDemandQuery(
          user.uid,
          user.isDistributer,
          "pending"
        );
        const inProgressQuery = fetchDemandQuery(
          user.uid,
          user.isDistributer,
          "placed"
        );
        const completedQuery = fetchDemandQuery(
          user.uid,
          user.isDistributer,
          "completed",
          20
        );

        unsubscribers.push(
          attachDemandObserver(
            pendingQuery,
            (data) => {
              setPendingDemandsState(data);
              setLoading(false);
            },
            handleError
          )
        );
        unsubscribers.push(
          attachDemandObserver(
            inProgressQuery,
            (data) => {
              setActiveDemands(data);
              setLoading(false);
            },
            handleError
          )
        );
        unsubscribers.push(
          attachDemandObserver(
            completedQuery,
            (data) => {
              setCompletedDemandsState(data);
              setLoading(false);
            },
            handleError
          )
        );
      } catch (err: any) {
        handleError(err);
      }
    };

    const handleError = (err: any) => {
      setError(`Error fetching data: ${err.message}`);
      setLoading(false);
    };

    attachObservers();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user]);

  const updateStatus = useCallback(
    async (demandId: string, nextStatus: string): Promise<boolean> => {
      const TIMEOUT = 10000;
      setError(null);

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
          updateDemandStatus(demandId, nextStatus),
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
