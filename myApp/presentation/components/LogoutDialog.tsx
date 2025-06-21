import "../style/LogoutDialog.css";



type LogoutDialogProps = {
  onConfirm: () => void;
  onDismiss: () => void;
};

export const LogoutDialog: React.FC<LogoutDialogProps> = ({
  onConfirm,
  onDismiss,
}) => {
  return (
    <div className="logout-dialog__backdrop">
      <div className="logout-dialog__container">
        <h2 className="logout-dialog__title">🚪 התנתקות</h2>
        <p className="logout-dialog__text">האם אתה בטוח שברצונך להתנתק?</p>
        <div className="logout-dialog__buttons">
          <button className="logout-dialog__button logout-dialog__cancel" onClick={onDismiss}>
            ביטול
          </button>
          <button className="logout-dialog__button logout-dialog__confirm" onClick={onConfirm}>
            התנתק
          </button>
        </div>
      </div>
    </div>
  );
};
