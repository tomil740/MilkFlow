import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import {useState,useEffect} from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { cartProductsSelector, cartState } from "../domain/states/cartState";
import "./style/cart.css";
import { useCreateDemand } from "../domain/useCase/useCreateDemand";
import ProductDialog from "./components/ProductDialog";
import { authState } from "../domain/states/authState";
import { ProductWithAmount } from '../domain/models/Product';
import { useNavigate } from "react-router-dom";



const CartScreen: React.FC = () => {
  const { createDemand, loading, error, data } = useCreateDemand();
  const cartProducts = useRecoilValue(cartProductsSelector);
  const setCartState = useRecoilState(cartState)[1];
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithAmount | null>(null);
  const navigate = useNavigate();
  


  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);

  const handleCloseDialog = () => setSelectedProduct(null);
  /*//save cart function...
  //disable the remote saving of the cart...
  //const [isSaving, setIsSaving] = useState(false);
  //const {syncCartToRemote, clearCart } = useCart();
  const handleSaveCart = async () => {
    if (!authUser) {
      setSnackbar({
        open: true,
        message: "User not authenticated. Cannot save cart.",
        type: "error",
      });
      console.log("User not authenticated. Cannot save cart.");
      return;
    }else if (isSaving) {
      setSnackbar({
        open: true,
        message: "A save process is runing...",
        type: "error",
      });
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
  */

  const totalItems = cartProducts.length;

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
      setTimeout(() => navigateBack(), 2000);
    } else if (error != null) {
      setSnackbar({
        open: true,
        message: `Failed to create demand ${error}`,
        type: "error",
      });
    }
  }, [data, error]);

  const navigateBack = () => {
    navigate("/demandsView");
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <div className="cart-container">
      <div className="cart-header-container">
        <header className="cart-header">סיכום הזמנה</header>
        <div className="cart-summary">
          <div>סך הכל מוצרים: {totalItems}</div>
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
              src={`productsImages/regular/${product.imgKey}.jpg`}
              alt={product.name}
              className="product-img"
              onError={(e) => {
                e.currentTarget.src = `productsImages/logos/large_logo.png`;
              }}
            />
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-amount">
                כמות: <b>{product.amount}</b>
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
          amountInit={selectedProduct?.amount}
        />
      )}

      <button
        className={`checkout-btn ${loading ? "loading" : ""}`}
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "מבצע..." : "בצע הזמנה"}
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