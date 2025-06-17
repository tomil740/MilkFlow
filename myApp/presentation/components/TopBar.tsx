import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { authState } from "../../domain/states/authState";
import { useCart } from "../../domain/useCase/useCart";
import UserHeader from "./UserHeader";
import "../style/TopBar.css";
import { db } from "../../backEnd/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { User } from '../../domain/models/User'; 
import ConnectionWatcher from './ConnectionWatcher';

type TopBarProps = {
  onRequestLogout: () => void;
};

const TopBar: React.FC<TopBarProps> = ({ onRequestLogout }) => {
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
      <ActionButton
        icon="🛍️"
        label="כל המוצרים"
        onClick={() => handleNavigation("/")}
      />
      {!authUser ? (
        <div className="guest-presentation">
          <span className="guest-message">היי אורח</span>

          <button
            className="nav-button styled-button login-guest-button"
            onClick={() => handleNavigation("/login")}
          >
            🔐 התחבר כדי לצפות בנתונים שלך
          </button>
        </div>
      ) : (
        <>
          <UserHeader
            userId={authUser.uid}
            onLogout={onRequestLogout}
            //() => setAuthUser(null)}
          />
          {!authUser.isDistributer && (
            <ActionButton
              icon="🛒"
              label="העגלה שלי"
              floatingLab={cart?.length || 0}
              onClick={() => handleNavigation("/cart")}
            />
          )}
          <ActionButton
            icon="📋"
            label={authUser.isDistributer ? "מנהל הזמנות" : "ההזמנות שלי"}
            onClick={() => handleNavigation("/demandsView")}
          />
        </>
      )}
    </div>
  );

};

export default TopBar;


interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  floatingLab?: number;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  floatingLab,
}) => {
  return (
    <div className="action-button-wrapper" onClick={onClick}>
      <div className="action-button-frame">
        <div className="action-button-icon">{icon}</div>
        {floatingLab !== undefined && (
          <div className="floating-badge">{floatingLab}</div>
        )}
      </div>
      <span className="action-button-label">{label}</span>
    </div>
  );
};





