import { useState } from "react";
import { useRecoilValue } from "recoil";
import { cartState } from "../states/cartState";
import { addDemand } from "../../data/remoteDao/addDemand";
import { authState } from "../states/authState";
import { Demand } from '../models/Demand';

export const useCreateDemand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Demand | null>(null);

  const userAuth = useRecoilValue(authState);
  const cartItems = useRecoilValue(cartState);

  const createDemand = async () => {
    console.log("start new deamnd...")
    setError(null);
    setLoading(true);

    try {
      // Validate user authentication
      if (!userAuth || !userAuth.uid) {
        throw new Error("User is not authenticated.");
      }

      // Validate user is a customer
      if (userAuth.isDistributer) {
        throw new Error("Distributors cannot create demands.");
      }

      // Validate cart state
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty.");
      }
      const defaultDate = new Date(0); // Unix epoch as a placeholder

      // Build demand object
      const demand: Demand = {
        demandId:"",
        userId: userAuth.uid,
        distributerId: userAuth.distributerId,
        status: "pending",
        createdAt: defaultDate, // Will be set by Firebase
        updatedAt: defaultDate, // Will be set by Firebase
        products: cartItems,
      };

      // Add demand to Firestore
      await addDemand(demand);

      // Update state
      setData(demand);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Now TypeScript knows `err` is an `Error` type
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
      setTimeout(()=>setError(null), 1000);
    }
  };

  return { createDemand, loading, error, data };
};
