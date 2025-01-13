import React, { useState, useEffect } from "react";
import Select from "react-select";
import UserHeader from "./UserHeader";
import { fetchDistributers } from "../../data/remoteDao/fetchDistributers";
import "../style/authintication.css";

interface DistributerPickerProps {
  distributerPick: string | null;
  setDistributerPick: React.Dispatch<React.SetStateAction<string | null>>;
}

export const DistributerPicker: React.FC<DistributerPickerProps> = ({
  distributerPick,
  setDistributerPick,
}) => {
  const [distributers, setDistributers] = useState<
    { value: string; label: React.ReactNode }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDistributers = async () => {
      try {
        const distributerList = await fetchDistributers();
         const options = distributerList.map((user) => ({
           value: user.id,
           label: <UserHeader userId={user.id} />,
         }));
        setDistributers(options);
      } catch (err) {
        setError("Failed to load distributors.");
      }
    };
    loadDistributers();
  }, []);

  const handleChange = (selectedOption: any) => {
    setDistributerPick(selectedOption?.value || "-1");
  };

  return (
    <div className="distributer-picker">
      <h3 className="picker-title">בחר מפיץ</h3>
      {error ? (
        <div className="error-message">שגיאה בטעינת מפיצים, אנא נסה שוב</div>
      ) : (
        <Select
          options={distributers}
          value={distributers.find(
            (option) => option.value === distributerPick
          )}
          onChange={handleChange}
          placeholder="בחר מפיץ"
          classNamePrefix="distributer-select"
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-outline)",
              borderRadius: "8px",
              boxShadow: "none",
            }),
            singleValue: (base) => ({
              ...base,
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--color-on-surface)",
            }),
          }}
        />
      )}
      {distributerPick !== "-1" && (
        <div className="picked-distributer">
          <strong>מפיץ שנבחר:</strong> {distributerPick}
        </div>
      )}
    </div>
  );
};
