import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { authState } from "../domain/states/authState";
import DemandPreviewItem from "./components/DemandPreviewItem";
import { useRecoilValue } from "recoil";
import "./style/demandsFeature.css";
import { DemandsProductView } from "./components/DemandsProductView";
import TwoWaySwitch from "./components/TwoWaySwitch";
import { Demand } from "../domain/models/Demand";
import { useNavigate } from "react-router-dom";
import { Typography, Dialog } from "@mui/material";
import statusPresentation from "./util/statusPresentation";
import { useDemandsSync } from "../domain/useCase/useDemandsSync";
import { MdOutlineWifiOff } from "react-icons/md";
import { checkInternetConnection } from "../data/remoteDao/util/checkInternetConnection";


const DemandsView = () => {
  const userAuth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [productView, setProductView] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false); // Loading state for status update
  const [isConnected, setIsConnected] = useState(true); // Track connection state

  const isAuthenticated = Boolean(userAuth);
  const userId = isAuthenticated ? userAuth?.uid : "-1"; // Default ID for unauthenticated users

  // Using the updated hook
  const {
    activeDemands,
    pendingDemands,
    completedDemands,
    loading,
    error,
    updateStatus,
  } = useDemandsSync();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const statuses = ["pending", "placed", "completed"];

  useEffect(() => {
    // Periodically check connection status
    const interval = setInterval(async () => {
      const online = await checkInternetConnection();
      if (online !== isConnected) {
        setIsConnected(online);

        if (online) {
          setSnackbar({
            open: true,
            message: "🔄 החיבור חודש, מסנכרן נתונים כעת...",
            type: "success",
          });
          // Refresh demands when back online

          //refreshDemands();
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const handleStatusChange = async (theData: Demand[]) => {
    if (!userAuth?.isDistributer || status === "completed") return;

    const nextStatus = statuses[statuses.indexOf(status) + 1];
    setDialogOpen(true);
    setLoadingStatus(true); // Start loading indicator

    try {
      await Promise.all(
        theData.map((demand) => updateStatus(demand.id, nextStatus))
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

  const handleDemandClick = (demand: Demand) => {
    navigate(`/Demand/${demand.id}`, { state: { demand } });
  };

  const getMatchedData = () => {
    switch (status) {
      case "pending":
        return pendingDemands;
      case "placed":
        return activeDemands;
      case "completed":
        return completedDemands;
      default:
        return [];
    }
  }; 

  return (
    <div className={`demands-view-container status-${status}`}>
      <Dialog open={dialogOpen}>
        <div className="loading-dialog">
          <CircularProgress />
          <Typography variant="body1">מעדכן סטטוס ביצוע...</Typography>
        </div>
      </Dialog>

      <header className="demands-header">
        {userAuth?.isDistributer ? "מנהל הזמנות" : "ההזמנות שלי"}
      </header>

      <div className="status-menu-container">
        <div className="status-menu-header">סטטוס</div>
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

      {!isConnected && (
        <div className="connection-status-badge">
          <MdOutlineWifiOff color="red" size={24} />
          <span>אין חיבור לאינטרנט - הנתונים עשויים להיות לא מעודכנים</span>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <CircularProgress />
        </div>
      )}

      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className={`snackbar-${snackbar.type}`}
        />
      )}

      <div className="demands-list">
        {isAuthenticated ? (
          getMatchedData()?.length > 0 && !loading ? (
            <>
              <div className="switchContainer">
                <TwoWaySwitch value={productView} onChange={setProductView} />
              </div>
              {productView ? (
                <DemandsProductView demands={getMatchedData()} isDistributer ={userAuth?.isDistributer ? userAuth.isDistributer : false}/>
              ) : (
                getMatchedData().map((demand: Demand) => (
                  <DemandPreviewItem
                    key={demand.id}
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
          )
        ) : (
          <Typography variant="h6">
            משתמש לא מזוהה. אנא התחבר כדי לראות דרישות.
          </Typography>
        )}
      </div>

      {userAuth?.isDistributer &&
        status !== "completed" &&
        getMatchedData()?.length > 0 && (
          <button
            className="update-status-btn"
            onClick={() => handleStatusChange(getMatchedData())}
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
