import { useRecoilState } from "recoil";
import { CartItem } from '../models/CartItem';
import { cartState } from "../states/cartState";


export default function useEditCart() {
      const [cartItems, setCart] = useRecoilState(cartState);


  function editCart(matchedItem: CartItem) {

    // Check if the item exists in the cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === matchedItem.productId
    );

    if (existingItemIndex !== -1) {
      let updatedCart = [...cartItems];

      if (matchedItem.amount === -1) {
        // If amount is -1, delete the item from the cart
        updatedCart = updatedCart.filter(
          (item) => item.productId !== matchedItem.productId
        );
      } else {
        // Otherwise, update the item's amount
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          amount: matchedItem.amount,
        };
      }

      // Update the cart state with the new updated cart
      setCart(updatedCart);
    }
  }
  return editCart
}
