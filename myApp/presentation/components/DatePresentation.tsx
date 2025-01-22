import { Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore"; // Import Firebase Timestamp

// Component that receives a Date type or Firebase Timestamp
export const DatePresentation = ({
  createdAt,
  updatedAt,
}: {
  createdAt: Date | Timestamp | null;
  updatedAt: Date | Timestamp;
}) => {
  // Helper function to convert Firebase Timestamp to a Date object
  const convertToDate = (timestamp: Timestamp | Date | null): Date | null => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate(); // Convert Firebase Timestamp to Date
    }
    return timestamp instanceof Date ? timestamp : null; // If it's a Date object or null, return it
  };

  // Format date to the desired format (YYYY/MM/DD HH:mm)
  const formatDate = (date: Date | null): string | null => {
    if (!date) return null; // If date is null, return null
    // Check if the input is indeed a Date object
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid date object:", date);
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const formattedCreatedAt = createdAt
    ? formatDate(convertToDate(createdAt))
    : null;
  const formattedUpdatedAt = formatDate(convertToDate(updatedAt));

  return (
    <div
      style={{
        padding: "12px",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5", // You can adjust this based on your theme color
      }}
    >
      {/* If createdAt is available, display both */}
      {formattedCreatedAt ? (
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            marginBottom: "8px", // Margin for spacing between the lines
          }}
        >
          נוצר ב:{" "}
          <span style={{ fontWeight: "bold" }}>{formattedCreatedAt}</span>
        </Typography>
      ) : (
        ""
      )}

      {/* Display updatedAt regardless */}
      <Typography
        variant="body2"
        sx={{
          color: "text.primary",
        }}
      >
        עודכן ב:{" "}
        <span style={{ fontWeight: "bold" }}>{formattedUpdatedAt}</span>
      </Typography>
    </div>
  );
};
