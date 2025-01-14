import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../domain/useCase/useCart";
import "../style/TopBar.css";
import ThemeToggleBut from "../../theme/ThemeToggleBut";
import { useRecoilState } from "recoil";
import { authState } from "../../domain/states/authState";
import UserHeader from "./UserHeader";


//const authUserId = "fAHk3bhvX8yPRdTlS4zk"; // Mock authenticated user ID for now
 
const TopBar = () => {
  const navigate = useNavigate();
  const [authUser,setAuthUser] = useRecoilState(authState)
  const { cart, initializeCart, syncCartToRemote, clearCart } = useCart();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize cart when user logs in
  useEffect(() => {
    const initialize = async () => {
      if (authUser) {
        await initializeCart(authUser.uid);
      } else {
       // clearCart(authUserId); // Clear cart if user logs out
      }
    };
    initialize();
  }, [authUser]);

  const handleSaveCart = async () => {
    if (!authUser) {
      console.log("User not authenticated. Cannot save cart.");
      return;
    }

    setIsSaving(true); 
    try {
      await syncCartToRemote(authUser?.uid);
    } catch (error) {
      console.error("Error saving cart:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = () => {
    navigate("/Login");
  };

  const handleLogout = () => {
    setAuthUser(null); // Simulate logout
  };

  return (
    <div className="top-bar">
      <div className="logo" onClick={() => navigate("/")}>
        🛍️
      </div>
      <ThemeToggleBut />
      {authUser ? (
        <div className="auth-container">
          <UserHeader userId={authUser?.uid} />

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

          <div className="logo" onClick={() => navigate("/demandsView")}>
            📋
          </div>
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
