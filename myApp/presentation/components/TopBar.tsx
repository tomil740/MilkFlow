import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../domain/states/authState";
import { useCart } from "../../domain/useCase/useCart";
import ThemeToggleBut from "../../theme/ThemeToggleBut";
import UserHeader from "./UserHeader";
import "../style/TopBar.css";
import { db } from "../../backEnd/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { User } from '../../domain/models/User'; 
import ConnectionWatcher from './ConnectionWatcher';



const TopBar = () => {
  const navigate = useNavigate(); 
  const [authUser, setAuthUser] = useRecoilState(authState);
  const { cart, initializeCart } = useCart();

  const handleNavigation = (path:string) => {
    try {
      navigate(path);
    } catch (err) {
      console.error("Navigation error:", err);
      alert("Navigation unavailable.");
    }
  };

  useEffect(() => {
    const syncUserIfNeeded = async () => {
      if (!authUser || !authUser.uid) return;

      const syncThreshold = 24 * 60 * 60 * 1000; // One day in milliseconds
      const lastSynced = authUser.syncedAt || 0;
      const timeSinceLastSync = Date.now() - lastSynced;

      if (timeSinceLastSync < syncThreshold) {
        console.log("No sync required, within sync threshold.");
        return;
      }

      try {
        console.log("Syncing user data from Firestore...");
        const userDoc = await getDoc(doc(db, "users", authUser.uid));

        if (userDoc.exists()) {
          const updatedUserData = userDoc.data() as User;
          setAuthUser({
            ...updatedUserData,
            syncedAt: Date.now(), // Update sync timestamp
          });
          console.log("User synced successfully.");
        } else {
          console.warn("User not found in Firestore.");
        }
      } catch (err) {
        console.error("Failed to sync user data:", err);
      }
    };

    syncUserIfNeeded();
  }, [authUser, setAuthUser]);


  return (
    <div className="top-bar">
      {/* Top Icons Section */}
      <div className="top-icons-wrapper">
        <ThemeToggleBut />
        <ConnectionWatcher />
      </div>

      {/* Left Section */}
      <div className="top-bar-section">
        <ActionButton
          icon="🛍️"
          label="כל המוצרים"
          onClick={() => handleNavigation("/")}
        />
      </div>

      {!authUser ? (
        <button
          className="nav-button styled-button"
          onClick={() => handleNavigation("/login")}
        >
          🔐 Login
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
          <button
            className="nav-button styled-button"
            onClick={() => setAuthUser(null)}
          >
            🚪 Logout
          </button>
          {/* Right Section */}
          <div className="top-bar-section">
            <ActionButton
              icon="📋"
              label={authUser.isDistributer ? "מנהל הזמנות" : "ההזמנות שלי"}
              onClick={() => handleNavigation("/demandsView")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TopBar;

import React from "react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <div className="action-button" onClick={onClick}>
      <div className="action-icon">{icon}</div>
      <span className="action-label">{label}</span>
    </div>
  );
};


