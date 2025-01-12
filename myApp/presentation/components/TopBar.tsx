import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../domain/useCase/useCart";
import "../style/TopBar.css";
import ThemeToggleBut from "../../theme/ThemeToggleBut";

const authUserId = "fAHk3bhvX8yPRdTlS4zk"; // Mock authenticated user ID for now
 
const TopBar = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(true); // Replace with useRecoilState(authState) when ready
  const { cart, initializeCart, syncCartToRemote, clearCart } = useCart();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize cart when user logs in
  useEffect(() => {
    const initialize = async () => {
      if (authUser) {
        await initializeCart(authUserId);
      } else {
        clearCart(authUserId); // Clear cart if user logs out
      }
    };
    initialize();
  }, [authUser]);

  const handleSaveCart = async () => {
    if (!authUserId) {
      console.log("User not authenticated. Cannot save cart.");
      return;
    }

    setIsSaving(true);
    try {
      await syncCartToRemote(authUserId);
    } catch (error) {
      console.error("Error saving cart:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    setAuthUser(null); // Simulate logout
  };

  return (
    <div className="top-bar">
      <div className="logo">
        🛍️
        <ThemeToggleBut />
      </div>

      {authUser ? (
        <div className="auth-container">
          <span className="user-name">Hello, {"Tomi"}!</span>
          <div
            className={`save-cart-icon ${isSaving ? "saving" : ""}`}
            onClick={handleSaveCart}
            title="Save Cart"
          >
            {isSaving ? "⏳" : "💾"} {/* Spinner or save icon */}
          </div>
          <div
            className="cart-icon"
            onClick={() => navigate("/cart")}
            title="Go to cart"
          >
            🛒 ({cart.length || 0})
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      )}
    </div>
  );
};

export default TopBar;
