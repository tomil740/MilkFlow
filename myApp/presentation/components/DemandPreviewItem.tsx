import UserHeader from "./UserHeader";

const DemandPreviewItem = ({ uid, amount, lastUpdate, status, onClick1 }) => {
  return (
    <div className={`demand-preview-item status-${status}`} onClick={onClick1}>
      <UserHeader userId={uid} />
      <div className="demand-info">
        <div>
          Status: <span className="status-text">{status}</span>
        </div>
        <div>Items: {amount}</div>
        <div>
          {" "}
          Last Updated: {new Date(lastUpdate.seconds * 1000).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default DemandPreviewItem;
