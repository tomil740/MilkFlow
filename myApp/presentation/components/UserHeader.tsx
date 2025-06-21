import { useEffect, useState } from "react";
import useGetUserById from "../../domain/useCase/useGetUserById";
import PersonPinIcon from "@mui/icons-material/PersonPin"; // Correct import
import { ActionButton } from "./TopBar";


interface UserHeaderProps {
  userId: string;
  onLogout?: () => void; // <-- make logout optional
}

const UserHeader: React.FC<UserHeaderProps> = ({ userId, onLogout }) => {
  const { loading, error, data } = useGetUserById(userId);

  if (loading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.errorText}>Error/Fail</p>
      </div>
    );
  }

  if (!data || userId == null) {
    return null;
  }

  const handleClick = () => {
    if (!onLogout) return; 

      onLogout();
  
  };

  return (
    <ActionButton
      icon={<PersonPinIcon />}
      label={data.name}
      onClick={handleClick}
    />
  );
};

export default UserHeader;

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "0px 12px",
    borderRadius: "16px",
    backdropFilter: "blur(8px)",
  },
  icon: {
    fontSize: "18px", // Small icon size
    marginRight: "8px", // Space between the icon and user name
    color: "var(--color-primary)", // Match the icon color with the primary theme color
  },
  userName: {
    fontSize: "16px",
    fontWeight: "500",
    color: "var(--color-on-surface)", // Ensure text color matches theme
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden",
  },
  errorText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "var(--md-sys-color-error)",
  },
};