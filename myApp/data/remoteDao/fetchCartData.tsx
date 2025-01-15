import { db } from "../../backEnd/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { CartItem } from '../../domain/models/CartItem';

export async function fetchCartData(userId: string): Promise<CartItem[]> {
  try {
    if (!userId) throw new Error("User ID is required to fetch cart data.");

    const cartDoc = doc(db, "carts", userId);
    const snapshot = await getDoc(cartDoc);

    if (snapshot.exists()) {
      return snapshot.data().cart || [];
    } else {
      console.warn(`Cart not found for user ID: ${userId}`);
      return [];
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
    throw error;
  }
}
