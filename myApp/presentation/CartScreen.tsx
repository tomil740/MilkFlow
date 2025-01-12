import {useState} from "react";
import { useRecoilValue } from "recoil";
import { cartProductsSelector, cartState } from "../domain/states/cartState";
import "./style/cart.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { Product } from '../domain/models/Product';
import ProductDialog from "./components/ProductDialog";



const CartScreen: React.FC = () => {
  const cartProducts = useRecoilValue(cartProductsSelector);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCloseDialog = () => {
    setSelectedProduct(null);
  };

  const totalItems = cartProducts.reduce((sum, p) => sum + p.amount, 0);
  const totalPrice = cartProducts.reduce(
    (sum, p) => sum + p.price * p.amount,
    0
  );

  const handleCheckout = () => {
    // Trigger checkout action
    console.log("Checkout initiated!");
  };

  return (
    <div className="cart-container">
      <header className="cart-header">Cart</header>

      <div className="cart-products">
        {cartProducts.map((product) => (
          <div key={product.id} className="cart-product">
            {/* Edit Icon Button */}
            <IconButton
              className="edit-cart-item-btn"
              onClick={() => setSelectedProduct(product)}
            >
              <EditIcon />
            </IconButton>

            {/* Product Details */}
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
      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          onClose={handleCloseDialog}
          addToCart={()=>{}}
          isCartItem={true}
          amountInit={selectedProduct.amount}
        />
      )}

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
