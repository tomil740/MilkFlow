import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../domain/states/authState";
import { useCart } from "../../domain/useCase/useCart";
import ThemeToggleBut from "../../theme/ThemeToggleBut";
import UserHeader from "./UserHeader";
import "../style/TopBar.css";

const TopBar = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useRecoilState(authState);
  const { cart, initializeCart } = useCart();


  useEffect(() => {
    const initialize = async () => {
      if (authUser) await initializeCart(authUser.uid);
    };
    initialize();
  }, [authUser]);

  const handleNavigation = (path:string) => {
    try {
      navigate(path);
    } catch (err) {
      console.error("Navigation error:", err);
      alert("Navigation unavailable.");
    }
  };

  return (
    <div className="top-bar">
      {/* Left Section */}
      <div className="top-bar-section">
        <div
          className="icon-button"
          onClick={() => handleNavigation("/")}
          title="ProductsCatalog"
        >
          🛍️
        </div>
        <ThemeToggleBut />
      </div>

      {/* Right Section */}
      <div className="top-bar-section">
        {!authUser ? (
          <button
            className="nav-button"
            onClick={() => handleNavigation("/login")}
          >
            Login
          </button>
        ) : (
          <>
            <UserHeader userId={authUser.uid} />
            {!authUser.isDistributer && (
              <div
                className="icon-button"
                onClick={() => handleNavigation("/cart")}
                title="Go to Cart"
              >
                🛒 ({cart?.length || 0})
              </div>
            )}
            <button className="nav-button" onClick={() => setAuthUser(null)}>
              Logout
            </button>
            <div
              className="icon-button"
              onClick={() => handleNavigation("/demandsView")}
              title="Demand Manager"
            >
              📋
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopBar;
