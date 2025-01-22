import statusPresentation from "../util/statusPresentation";
import { DatePresentation } from "./DatePresentation";
import UserHeader from "./UserHeader";



// Define an interface for the props of DemandPreviewItem
interface DemandPreviewItemProps {
  uid: string;  // Assuming uid is a string (you can adjust based on your data)
  amount: number; // Assuming amount is a number
  lastUpdate: Date
  status: string; // Assuming status is a string
  onClick1: () => void; // Assuming onClick1 is a function with no parameters and no return value
}
 
const DemandPreviewItem: React.FC<DemandPreviewItemProps> = ({ uid, amount, lastUpdate, status, onClick1 }) => {
  return (
    <div className={`demand-preview-item status-${status}`} onClick={onClick1}>
      <UserHeader userId={uid} />
      <div className="demand-info">
        <div>
          סטטוס: <span className="status-text">{statusPresentation(status)}</span>
        </div>
        <div>סך מוצרים: {amount}</div>
        <div>
          <DatePresentation updatedAt={lastUpdate} createdAt={null} />
        </div>
      </div>
    </div>
  );
};

export default DemandPreviewItem;
