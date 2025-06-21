import { Outlet } from "react-router-dom";
import TopBar from "../presentation/components/TopBar";
import { useState } from "react";
import { LogoutDialog } from "../presentation/components/LogoutDialog";
import { useRecoilState } from "recoil";
import { authState } from "../domain/states/authState";

const RootLayout = () => {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false);
    setAuthUser(null); // clear auth state
  };

  const [authUser, setAuthUser] = useRecoilState(authState);


  const handleLogoutDismiss = () => {
    setShowLogoutDialog(false);
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <TopBar onRequestLogout={() => setShowLogoutDialog(true)} />
      <main className="flex-grow">
        <Outlet />
      </main>
      {showLogoutDialog && (
        <LogoutDialog
          onConfirm={handleLogoutConfirm}
          onDismiss={handleLogoutDismiss}
        />
      )}
    </div>
  );
};

export default RootLayout;
