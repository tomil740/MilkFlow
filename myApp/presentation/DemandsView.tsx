import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { useDemandsView } from "../domain/useCase/useDemandsView";
import { useRecoilValue } from "recoil";
import { authState } from "../domain/states/authState";
import DemandPreviewItem from "./components/DemandPreviewItem";
import "./style/demandsFeature.css";
import { DemandsProductView } from './components/DemandsProductView';

const DemandsView = () => {
  const userAuth = useRecoilValue(authState);
  const [status, setStatus] = useState("pending"); // Default status

  const isAuthenticated = userAuth !== null;
  const userId = isAuthenticated
    ? userAuth.isDistributer
      ? userAuth.uid
      : userAuth.distributerId
    : "-1"; // Fake ID to indicate unauthenticated user

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

  useEffect(()=>{
    if(error!=null){
        setSnackbar({
          open: true,
          message: `Fail to laod,${error}`,
          type: "error",
        });
    }
  },[error])

  const statuses = ["pending", "approved", "completed"];
            console.log(data.length);

  const handleStatusChange = async () => {
    if (userAuth?.isDistributer && status !== "completed") {
      const nextStatus = statuses[statuses.indexOf(status) + 1];
      try {
        await Promise.all(
          data.map((demand) => updateStatus(demand.demandId, nextStatus))
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
        <DemandsProductView demands={data}/>
        {data.map((demand) => (
          <DemandPreviewItem
            key={demand.demandId}
            uid={userAuth?.isDistributer ? demand.userId : demand.distributerId}
            amount={demand.products.length}
            lastUpdate={demand.updatedAt}
            status={demand.status}
          />
        ))}
      </div>

      {userAuth?.isDistributer && status !== "completed" && (
        <button className="update-status-btn" onClick={handleStatusChange}>
          Update Status to {statuses[statuses.indexOf(status) + 1]}
        </button>
      )}
    </div>
  );
};

export default DemandsView;
