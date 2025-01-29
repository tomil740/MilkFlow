import { useState, useCallback } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { 
  fetchPaginatedDemands,
  updateDemandStatus,
} from "../../data/remoteDao/demadnsView";
import { Demand } from "../models/Demand";
import { QueryDocumentSnapshot } from "firebase/firestore";

// Define the expected types for the fetched paginated data
interface PaginatedDemands {
  demands: Demand[];
  lastDoc: QueryDocumentSnapshot | null;
}

// Define the return types for the useDemandsView hook
export interface UseDemandsViewResult {
  data: Demand[];
  loading: boolean;
  error: string | null;
  updateStatus: (demandId: string, nextStatus: string) => Promise<boolean>;
  fetchNextPage: () => void; // This function doesn't need to return a Promise
  hasNextPage: boolean;
}

// Main Hook
export const useDemandsView = (
  isDistributer: boolean,
  id: string,
  status: string,
  pageSize = 2 // Default page size
): UseDemandsViewResult => {
  // Error state for mutation failures or unexpected errors
  const [error, setError] = useState<string | null>(null);

  // Infinite Query for fetching paginated demands
  const {
    data,
    fetchNextPage, 
    hasNextPage,
    isLoading: loading, 
    isError,
    error: queryError,
  } = useInfiniteQuery<PaginatedDemands, Error>(
    ["demands", isDistributer, id, status], 
    ({ pageParam = null }) =>
      fetchPaginatedDemands(isDistributer, id, status, pageSize, pageParam),
    {
      // Correctly define how to get the next page param (lastDoc)
      getNextPageParam: (lastPage) => lastPage.lastDoc ?? null,
      onError: (error: Error) => {
        // Explicitly typing the error as Error
        console.error("Error fetching demands:", error);
        setError(error.message);
      },
    }
  );

  // Flatten paginated data for easy consumption
  const flattenedData = data?.pages.flatMap((page) => page.demands) || [];

  // Mutation for updating demand status
  const mutation = useMutation(updateDemandStatus, {
    onError: (error: Error) => {
      // Explicitly typing the error as Error
      console.error("Error updating demand status:", error);
      setError(error.message);
    },
  });

  /**
   * Wrapper function to handle demand status update.
   * Includes retry logic and timeout to catch network issues.
   */
  const updateStatus = useCallback(
    async (demandId: string, nextStatus: string): Promise<boolean> => {
      const TIMEOUT = 10000; // 10 seconds timeout
      setError(null); // Clear previous error

      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: Slow network response")),
          TIMEOUT
        )
      );

      try {
        const result = await Promise.race([
          mutation.mutateAsync({ demandId, nextStatus }), // Make sure the mutation accepts these parameters
          timeoutPromise,
        ]);

        return !!result; // Return boolean indicating success
      } catch (error) {
        console.error("Final failure in updateStatus:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred."
        );
        return false;
      }
    },
    [mutation]
  );

  // Return the result in the correct format
  return {
    data: flattenedData,
    loading,
    error: isError ? queryError?.message || "Failed to fetch demands." : error,
    updateStatus,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
  };
};
