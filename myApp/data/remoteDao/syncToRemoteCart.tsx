import { db } from "../../backEnd/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { CartItem } from '../../domain/models/CartItem';


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
