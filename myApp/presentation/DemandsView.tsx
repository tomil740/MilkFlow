import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { useDemandsView } from "../domain/useCase/useDemandsView";
import { useRecoilValue } from "recoil";
import { authState } from "../domain/states/authState";
import DemandPreviewItem from "./components/DemandPreviewItem";
import "./style/demandsFeature.css";
import { DemandsProductView } from "./components/DemandsProductView";
import TwoWaySwitch from "./components/TwoWaySwitch";
import { Demand } from "../domain/models/Demand";
import { useNavigate } from "react-router-dom";
import { Typography, Dialog } from "@mui/material";
import statusPresentation from "./util/statusPresentation";

const DemandsView = () => {
  const userAuth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [productView, setProductView] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false); // Loading state for status update

  const isAuthenticated = Boolean(userAuth);
  const userId = isAuthenticated ? userAuth?.uid : "-1"; // Default ID for unauthenticated users
  
  // Using the updated hook
  const { data, loading, error, updateStatus } = useDemandsView(
    userAuth?.isDistributer || false,
    userId == undefined ? "-1" : userId,
    status
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const statuses = ["pending", "placed", "completed"];

  // Handle errors
  useEffect(() => {
    let isMounted = true; // Track component mount status
    if (isMounted && error) {
      setSnackbar({
        open: true,
        message: `שגיאה בטעינת הדרישות: ${error}`,
        type: "error",
      });
    }
    return () => {
      isMounted = false;
    };
  }, [error]);

  const handleStatusChange = async (theData: Demand[]) => {
    if (!userAuth?.isDistributer || status === "completed") return;

    const nextStatus = statuses[statuses.indexOf(status) + 1];
    setDialogOpen(true);
    setLoadingStatus(true); // Start loading indicator

    try {
      await Promise.all(
        theData.map((demand) => updateStatus(demand.demandId, nextStatus))
      );
      setSnackbar({
        open: true,
        message: `הסטטוס עודכן ל- ${statusPresentation(nextStatus)}!`,
        type: "success",
      });
      setStatus(nextStatus);
    } catch (error: any) {
      const errorMessage = error?.message || "שגיאה בעדכון הסטטוס";
      setSnackbar({
        open: true,
        message: errorMessage,
        type: "error",
      });
    } finally {
      setDialogOpen(false);
      setLoadingStatus(false); // Stop loading indicator
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleDemandClick = (demand: Demand) => {
    navigate(`/Demand/${demand.demandId}`, { state: { demand } });
  };

  return (
    <div className={`demands-view-container status-${status}`}>
      <Dialog open={dialogOpen}>
        <div className="loading-dialog">
          <CircularProgress />
          <Typography variant="body1">מעדכן סטטוס ביצוע...</Typography>
        </div>
      </Dialog>

      <header className="demands-header">מנהל דרישות</header>

      <div className="status-menu-container">
        <div className="status-menu-header">סינון לפי סטטוס</div>
        <div className="status-menu">
          {statuses.map((s) => (
            <button
              key={s}
              className={`status-btn ${s === status ? "selected" : ""}`}
              onClick={() => setStatus(s)}
            >
              {statusPresentation(s)}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}

      {error && (
        <Typography variant="h6">שגיאה בטעינת הדרישות, {error}</Typography>
      )}

      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className={`snackbar-${snackbar.type}`}
        />
      )}

      <div className="demands-list">
        {data?.length > 0 && isAuthenticated && !loading ? (
          <>
            <div className="switchContainer">
              <TwoWaySwitch value={productView} onChange={setProductView} />
            </div>
            {productView ? (
              <DemandsProductView demands={data} />
            ) : (
              data.map((demand) => (
                <DemandPreviewItem
                  key={demand.demandId}
                  uid={
                    userAuth?.isDistributer
                      ? demand.userId
                      : demand.distributerId!
                  }
                  amount={demand.products.length}
                  lastUpdate={demand.updatedAt}
                  status={demand.status}
                  onClick1={() => handleDemandClick(demand)}
                />
              ))
            )}
          </>
        ) : (
          <Typography variant="h6">
            אין דרישות מתאימות לסטטוס הנבחר...
          </Typography>
        )}
      </div>

      {userAuth?.isDistributer &&
        status !== "completed" &&
        data?.length > 0 && (
          <button
            className="update-status-btn"
            onClick={() => handleStatusChange(data)}
            disabled={loadingStatus} // Disable button while loading
          >
            {loadingStatus ? (
              <CircularProgress size={24} />
            ) : (
              `עדכן סטטוס ל ${statusPresentation(
                statuses[statuses.indexOf(status) + 1]
              )}`
            )}
          </button>
        )}
    </div>
  );
};

export default DemandsView;
