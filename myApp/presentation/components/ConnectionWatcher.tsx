import { useEffect, useState } from "react";
import { MdOutlineWifiOff } from "react-icons/md";
import { FaWifi} from "react-icons/fa"; // You can use other icons from react-icons
import { useRecoilState } from "recoil";
import { networkState } from "../../domain/states/networkState";

// Function to check internet connection
const checkInternetConnection = async (): Promise<boolean> => {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return false;
  }

  try {
    const response = await fetch("https://www.gstatic.com/generate_204", {
      method: "HEAD",
      cache: "no-store",
      mode: "no-cors",
    });
    return true;
  } catch (error) {
    return false;
  }
};

const ConnectionWatcher = () => {
  const [isConnected, setIsConnected] = useRecoilState(networkState);

  const updateConnectionStatus = async () => {
    const connectionStatus = await checkInternetConnection();
    setIsConnected(connectionStatus);
  };

  useEffect(() => {
    // Initially check for connection
    updateConnectionStatus();

    // Set up an interval to check connection every few seconds
    const intervalId = setInterval(updateConnectionStatus, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [setIsConnected]);

  return (
    <div className="connection-status">
      {isConnected ? (
        <FaWifi color="green" size={24} title="Connected" />
      ) : (
        <MdOutlineWifiOff
          color="red"
          size={24}
          title="No internet connection"
        />
      )}
    </div>
  );
};

export default ConnectionWatcher;
