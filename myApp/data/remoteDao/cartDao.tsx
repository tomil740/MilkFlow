import { db } from "../../backEnd/firebaseConfig";
import { doc, setDoc,getDoc } from "firebase/firestore";
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

export const syncToRemoteCart = async (userId: string, cart: CartItem[]) => {
  try {
    const cartRef = doc(db, "carts", userId);
    await setDoc(cartRef, { cart }, { merge: true }); // Save or merge cart
    console.log("Cart saved to Firebase for user:", userId);
  } catch (error) {
    console.error("Failed to save cart to Firebase:", error);
    throw error;
  }
};

