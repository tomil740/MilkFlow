import { useState } from "react";
import { useRecoilValue } from "recoil";
import { cartState } from "../states/cartState";
import { addDemand } from "../../data/remoteDao/addDemand";
import { authState } from "../states/authState";
import { Demand } from "../models/Demand";
import { doc, getDoc} from "firebase/firestore";
import { db } from "../../backEnd/firebaseConfig";
import { checkInternetConnection } from "../../data/remoteDao/util/checkInternetConnection";

export const useCreateDemand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Demand | null>(null);

  const userAuth = useRecoilValue(authState);
  const cartItems = useRecoilValue(cartState);

  const createDemand = async () => {
    console.log("Start creating a new demand...");
    setError(null);
    setLoading(true);

    try {
      // Validate user authentication
      if (!userAuth || !userAuth.uid) {
        throw new Error("משתמש אינו מחובר.");
      }

      // Validate user is a customer
      if (userAuth.isDistributer) {
        throw new Error("מפיצים אינם יכולים ליצור דרישות.");
      }

      // Validate cart state
      if (!cartItems || cartItems.length === 0) {
        throw new Error("העגלה ריקה.");
      }

      // Validate timeframe (08:00 - 18:00)
      const currentHour = new Date().getHours();
      if (currentHour < 8 || currentHour >= 18) {
        throw new Error("ניתן להגיש דרישות רק בין השעות 08:00 ל-18:00.");
      }

      // Check for internet connection before proceeding
      const isConnected = await checkInternetConnection();
      if (!isConnected) {
        throw new Error("אין חיבור לאינטרנט. נסה שוב מאוחר יותר.");
      }

      // Build demand object
      const demand: Demand = {
        id: "",
        userId: userAuth.uid,
        distributerId: userAuth.distributerId,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        products: cartItems,
      };

      // Attempt to add demand
      await addDemand(demand); // Add demand to Firestore
      setData(demand); // If no error, proceed to update state
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Handle specific error messages
      } else {
        setError("שגיאה בלתי צפויה התרחשה.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setError(null), 3000); // Auto-clear error after 3 seconds
    }
  };

  return { createDemand, loading, error, data };
};
