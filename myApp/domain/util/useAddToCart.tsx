// In your component
import { useRecoilState } from "recoil";
import { CartItem } from '../models/CartItem';
import { cartState } from "../states/cartState";

export default function useAddToCart() {
  const [cartItems, setCart] = useRecoilState(cartState);

  function add(theItem: CartItem) {
    console.log("called addToCart",cartItems)
    // Check if the item already exists in the cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === theItem.productId
    );

    if (existingItemIndex !== -1) {
      // If item exists, update the amount by summing it
      const updatedCartVal = cartItems[existingItemIndex].amount + theItem.amount;
      const theItem2:CartItem = { ...cartItems[existingItemIndex], amount : updatedCartVal};
      const  newLst = [...cartItems]
      newLst[existingItemIndex] = theItem2
      // Update the cart state with the new updated cart
      setCart(newLst);
    } else {
      console.log("update new item ,",theItem)
      // If item doesn't exist, add new item to cart
      const updatedCart = [...cartItems, theItem];
            console.log("update new item ,", updatedCart);

      // Update the cart state with the new updated cart
      setCart(updatedCart);
    }
  }
  return add
}
