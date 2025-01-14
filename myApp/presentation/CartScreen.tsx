import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import {useState,useEffect} from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { cartProductsSelector, cartState } from "../domain/states/cartState";
import "./style/cart.css";
import { useCreateDemand } from "../domain/useCase/useCreateDemand";
import ProductDialog from "./components/ProductDialog";
import { useCart } from "../domain/useCase/useCart";
import { authState } from "../domain/states/authState";




const CartScreen: React.FC = () => { 
  const { createDemand, loading, error, data } = useCreateDemand();
  const cartProducts = useRecoilValue(cartProductsSelector);
  const authUser = useRecoilValue(authState);
  const setCartState = useRecoilState(cartState)[1];
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const {syncCartToRemote, clearCart } = useCart();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  const handleCloseDialog = () => setSelectedProduct(null);

  const handleSaveCart = async () => {
    if (!authUser) {
      setSnackbar({
        open: true,
        message: "User not authenticated. Cannot save cart.",
        type: "error",
      });
      console.log("User not authenticated. Cannot save cart.");
      return;
    }

    setIsSaving(true);
    try {
      await syncCartToRemote(authUser?.uid);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error saving cart:${error}`,
        type: "error",
      });
      console.error("Error saving cart:", error);
    } finally {
      setSnackbar({
        open: true,
        message: `successfuly saved cart`,
        type: "success",
      });
      setIsSaving(false);
    }
  };

  const totalItems = cartProducts.length;
  const totalPrice = cartProducts.reduce(
    (sum, p) => sum + p.price * p.amount,
    0
  );

  const handleCheckout = async () => {
    setShowLoadingDialog(true); // Show loading overlay
    try {
      await createDemand();
    } catch (err) {
      console.error("Error creating demand:", err);
      setSnackbar({
        open: true,
        message: "Failed to create demand",
        type: "error",
      });
    } finally {
      setTimeout(() => setShowLoadingDialog(false), 2000); // Hide loading dialog after timeout
    }
  };

  useEffect(() => {
    if (data) {
      setSnackbar({
        open: true,
        message: "Demand successfully created!",
        type: "success",
      });
      setCartState([]); // Clear cart
      navigateBack(); // Simulate navigation
    }else if(error!=null){
      setSnackbar({
        open: true,
        message: `Failed to create demand ${error}`,
        type: "error",
      });
    }
  }, [data, error]);

  const navigateBack = () => {
    console.log("Navigating back...");
    // Replace with actual navigation logic
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <div className="cart-container">
      <div className="cart-header-container">
        <header className="cart-header">Cart</header>
        <div
          className={`save-cart-icon ${isSaving ? "saving" : ""}`}
          onClick={!isSaving ? handleSaveCart : null} // Disable click when saving
          title="Save Cart"
        >
          {isSaving ? "⏳" : "💾"} {/* Spinner or save icon */}
        </div>
      </div>
      <div className="cart-products">
        {cartProducts.map((product) => (
          <div key={product.id} className="cart-product">
            <button
              className="edit-cart-item-btn"
              onClick={() => setSelectedProduct(product)}
            >
              ✎
            </button>
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
          addToCart={() => {}}
          isCartItem={true}
          amountInit={selectedProduct.amount}
        />
      )}

      <div className="cart-summary">
        <div>Total Items: {totalItems}</div>
        <div>Total Price: {totalPrice.toFixed(2)}₪</div>
      </div>

      <button
        className={`checkout-btn ${loading ? "loading" : ""}`}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Processing..." : "Make a Demand"}
      </button>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        className={
          snackbar.type === "error" ? "snackbar-error" : "snackbar-success"
        }
      />

      {/* Loading Dialog */}
      {showLoadingDialog && (
        <div className="loading-dialog">
          <CircularProgress color="inherit" />
          <div className="loading-text">Processing...</div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;