import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { cartState } from "../states/cartState";



export const useCart = () => {
  const [cart, setCart] = useRecoilState(cartState);
  // Initialize cart from local storage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("syncCartState init",savedCart)
    setCart(savedCart);
  }, [setCart]);

  // Sync cart to local storage
  const syncCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = (productId, amount = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.productId === productId);
      if (existing) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, amount: item.amount + amount }
            : item
        );
      }
      return [...prevCart, { productId, amount }];
    });
  };

  const updateCartItem = (productId, amount) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, amount } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart,
  };
};
