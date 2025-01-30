import useGetUserById from "../../domain/useCase/useGetUserById";
import PersonPinIcon from "@mui/icons-material/PersonPin"; // Correct import

const styles1 = {
  profileImage: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "10px",
    objectFit: "cover" as "cover",
  },
};

interface UserHeaderProps {
  userId: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({ userId }) => {
  let { loading, error, data } = useGetUserById(userId);

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

  return (
    <div style={styles.container}>
      <h1 style={styles.userName}>{data.name}</h1>
      <PersonPinIcon style={styles.icon} /> {/* Using PersonPinIcon */}
    </div>
  );
};

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

export default UserHeader;
