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
import { Typography } from "@mui/material";


const DemandsView = () => {
  const userAuth = useRecoilValue(authState);
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending"); // Default status
  const [productView, setProductView] = useState(true);

  const isAuthenticated = userAuth !== null;
  const userId = isAuthenticated ? userAuth.uid : "-1"; // Fake ID to indicate unauthenticated user

  const { data, loading, error, updateStatus } = useDemandsView(
    isAuthenticated ? userAuth.isDistributer : false,
    userId,
    status
  );

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (error != null) {
      setSnackbar({
        open: true,
        message: `Failed to load: ${error}`,
        type: "error",
      });
    }
  }, [error]);

  const statuses = ["pending", "placed", "completed"];

  const handleStatusChange = async (theData: Demand[]) => {
    if (userAuth?.isDistributer && status !== "completed") {
      const nextStatus = statuses[statuses.indexOf(status) + 1];
      try {
        await Promise.all(
          theData.map((demand) => updateStatus(demand.demandId, nextStatus))
        );
        setSnackbar({
          open: true,
          message: `Status updated to ${nextStatus}!`,
          type: "success",
        });
        setStatus(nextStatus); // Automatically switch to the next status view
      } catch (err) {
        setSnackbar({
          open: true,
          message: "Failed to update status",
          type: "error",
        });
      }
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const handleDemandClick = (demand: Demand) => {
    navigate(`/Demand/${demand.demandId}`, { state: { demand } });
  };

  return (
    <div className={`demands-view-container status-${status}`}>
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

      {error && (
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          className="snackbar-error"
        />
      )}

      <div className="demands-list">
        <div className="switchContainer">
          <TwoWaySwitch value={productView} onChange={setProductView} />
        </div>

        {/* Conditional Rendering */}
        {productView ? (
          <DemandsProductView demands={data} />
        ) : (
          <div className="demands-list">
            {!userAuth ? (
              // Display this if userAuth is null
              <Typography variant="h6">
                Please authenticate to see the demand data.
              </Typography>
            ) : (
              // Render the list of demands if userAuth is available
              data.map((demand) => (
                <DemandPreviewItem
                  key={demand.demandId}
                  uid={
                    userAuth.isDistributer
                      ? demand.userId
                      : demand.distributerId!
                  }
                  amount={demand.products.length}
                  lastUpdate={demand.updatedAt}
                  status={demand.status}
                  onClick1={() => handleDemandClick(demand)} // Navigate to DemandItemPage
                />
              ))
            )}
          </div>
        )}
      </div>

      {userAuth?.isDistributer && status !== "completed" && (
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
