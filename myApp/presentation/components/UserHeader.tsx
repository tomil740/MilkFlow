import useGetUserById from "../../domain/useCase/useGetUserById";

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
    return null; // No user data available
  }

  return (
    <div style={styles.container}>
      <p style={styles.userName}>{data.name}</p>
      <img
        src={data.imageUrl}
        alt={data.name}
        style={styles.profileImage}
        onError={(e) =>
          ((e.target as HTMLImageElement).src = "/placeholder.png")
        }
      />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "var(--md-sys-color-surface-variant)", // Material 3 theme surface variant
  },
  profileImage: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "8px",
    objectFit: "cover",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "500",
    color: "var(--md-sys-color-on-surface)", // Material 3 theme on-surface color
  },
  errorText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "var(--md-sys-color-error)", // Material 3 theme error color
  },
};

export default UserHeader;
