import React from "react";
import { useCart } from "../../domain/useCase/useCart";
import { useRecoilValue } from "recoil";
import { cartProductsSelector, cartState } from "../../domain/states/cartState";
import "./style/cart.css";



const CartScreen: React.FC = () => {
  const { syncCart, clearCart } = useCart();
  const cartProducts = useRecoilValue(cartProductsSelector);
  //test
  const myCart = useRecoilValue(cartState)
  console.log("mycart in sync",myCart)



  const totalItems = cartProducts.reduce((sum, p) => sum + p.amount, 0);
  const totalPrice = cartProducts.reduce(
    (sum, p) => sum + p.price * p.amount,
    0
  );

  const handleCheckout = () => {
    // Trigger checkout action
    console.log("Checkout initiated!");
    syncCart();
  };

  return (
    <div className="cart-container">
      <header className="cart-header">Cart</header>

      <div className="cart-products">
        {cartProducts.map((product) => (
          <div key={product.id} className="cart-product">
            <img
              src={product.imgUrl}
              alt={product.name}
              className="product-img"
            />
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-amount">
                Amount: <b>{product.amount}</b>
              </div>
              <div className="product-price">
                Price: <b>{(product.price * product.amount).toFixed(2)}₪</b>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div>Total Items: {totalItems}</div>
        <div>Total Price: {totalPrice.toFixed(2)}₪</div>
      </div>

      <button className="checkout-btn" onClick={handleCheckout}>
        Make a Demand
      </button>
    </div>
  );
};

export default CartScreen;
