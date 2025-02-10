import { useRecoilState } from "recoil";
import { cartState } from "../states/cartState";
import { fetchCartData, syncToRemoteCart } from "../../data/remoteDao/cartDao";

export const useCart = () => {
  const [cart, setCart] = useRecoilState(cartState);

  const initializeCart = async (userId: string | null) => {
    if (!userId) {
      console.log("User not authenticated. Cart feature disabled.");
      setCart([]); // Reset state for unauthenticated users
      return;
    }

    const localStorageKey = `cart_${userId}`;
    try {
      // Attempt to load cart from local storage
      const localCart = JSON.parse(
        localStorage.getItem(localStorageKey) || "null"
      );

      if (localCart) {
        setCart(localCart); // Sync state with local storage
        console.log("Cart loaded from local storage for user:", userId);
      } else {
        // No local data, fallback to remote cart
        const remoteCart = await fetchCartData(userId);
        setCart(remoteCart || []); // Sync state
        localStorage.setItem(localStorageKey, JSON.stringify(remoteCart || [])); // Save remote cart locally
        console.log("Cart loaded from Firebase for user:", userId);
      }
    } catch (error) {
      console.error("Error initializing cart for user:", userId, error);
      setCart([]); // Fallback to empty state
    }
  };

  const syncCartToRemote = async (userId: string) => {
    const localStorageKey = `cart_${userId}`;
    try {
      if (!userId) throw new Error("No user ID available for sync.");
      await syncToRemoteCart(userId, cart);
      console.log("Cart successfully synced to remote.");
      localStorage.setItem(localStorageKey, JSON.stringify(cart)); // Save synced cart locally
    } catch (error) {
      console.error("Error syncing cart to remote:", error);
    }
  };

  const clearCart = async (userId: string) => {
    const localStorageKey = `cart_${userId}`;
    try {
      setCart([]); // Clear state
      localStorage.removeItem(localStorageKey); // Remove local cart
      if (userId) {
        await syncToRemoteCart(userId, []); // Clear remote cart
        console.log("Cart successfully cleared for user:", userId);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return { cart, initializeCart, syncCartToRemote, clearCart };
};
