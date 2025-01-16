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

const DemandsView = () => {
  const userAuth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");
  const [productView, setProductView] = useState(true);

  const isAuthenticated = Boolean(userAuth);
  const userId = isAuthenticated ? userAuth?.uid : "-1"; // Default ID for unauthenticated users
  const { data, loading, error, updateStatus } = useDemandsView(
    userAuth?.isDistributer || false,
    (userId == undefined) ? "-1" : userId,
    status
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const statuses = ["pending", "placed", "completed"];

  useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: `Failed to load: ${error}`,
        type: "error",
      });
    }
  }, [error]);

  const handleStatusChange = async (theData: Demand[]) => {
    if (!userAuth?.isDistributer || status === "completed") return;

    const nextStatus = statuses[statuses.indexOf(status) + 1];
    setDialogOpen(true);
    setSnackbar({
      open: true,
      message: `Updating status to ${nextStatus}...`,
      type: "info",
    });

    try {
      await Promise.all(
        theData.map((demand) => updateStatus(demand.demandId, nextStatus))
      );
      setSnackbar({
        open: true,
        message: `Status updated to ${nextStatus}!`,
        type: "success",
      });
      setStatus(nextStatus);
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update status",
        type: "error",
      });
    } finally {
      setDialogOpen(false);
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
          <Typography variant="body1">Updating status...</Typography>
        </div>
      </Dialog>

      <header className="demands-header">Demands View</header>

      <div className="status-menu">
        {statuses.map((s) => (
          <button
            key={s}
            className={`status-btn ${s === status ? "selected" : ""}`}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>

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
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className={`snackbar-${snackbar.type}`}
        />
      )}

      <div className="demands-list">
        {data?.length > 0 && isAuthenticated && (!loading) ? (
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
            No demands available for this status.
          </Typography>
        )}
      </div>

      {userAuth?.isDistributer &&
        status !== "completed" &&
        data?.length > 0 && (
          <button
            className="update-status-btn"
            onClick={() => handleStatusChange(data)}
          >
            Update Status to {statuses[statuses.indexOf(status) + 1]}
          </button>
        )}
    </div>
  );
};

export default DemandsView;
