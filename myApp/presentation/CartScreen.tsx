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
import FetchImage from './util/FetchImage';



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

  const totalItems = cartProducts.length;

  // Manage the state of the demand creation process
  const handleCheckout = async () => {
    setShowLoadingDialog(true); // Show loading overlay
    setSnackbar({ open: false, message: "", type: "" }); // Clear any previous snackbars
    try {
      await createDemand(); // Assuming createDemand is successful
    } catch (err) {
      console.error("Error creating demand:", err);
      setSnackbar({
        open: true,
        message: "לא הצלחנו ליצור את הבקשה, אנא נסה שוב",
        type: "error",
      });
    } finally {
      setShowLoadingDialog(false); // Hide loading dialog
    }
  };

  useEffect(() => {
    if (data) {
      setSnackbar({
        open: true,
        message: "הבקשה נוצרה בהצלחה!",
        type: "success",
      });
      setCartState([]); // Clear cart only if the demand is successfully created
      setTimeout(() => navigateBack(), 2000); // Navigate after 2 seconds
    } else if (error) {
      setSnackbar({
        open: true,
        message: `הייתה שגיאה ביצירת הבקשה: ${error}`,
        type: "error",
      });
    }
  }, [data, error]);

  const navigateBack = () => {
    navigate("/demandsView"); // Navigate to the demands view
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
            <FetchImage
              imgId={product.imgKey} // Only pass the image ID
              className="product-img"
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
