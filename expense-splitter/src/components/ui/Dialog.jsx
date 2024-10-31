import Button from "./Button";
import PropTypes from "prop-types";

const Dialog = ({ dialogRef, confirmOnClick, children, isCustom }) => {
  // Add or remove the open attribute as needed
  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl px-6 py-10 backdrop:bg-black backdrop:opacity-60"
    >
      {isCustom ? (
        <>{children}</>
      ) : (
        <>
          <div className="mb-6">{children}</div>
          <div className="flex gap-2">
            <Button onClick={toggleDialog} className="w-full bg-primary/70">
              Cancel
            </Button>

            {confirmOnClick && ( //Render 2nd button if 2nd onClick is provided
              <Button
                className="w-full bg-primary"
                onClick={() => {
                  confirmOnClick();
                  toggleDialog();
                }}
              >
                Confirm
              </Button>
            )}
          </div>
        </>
      )}
    </dialog>
  );
};

// Props validation
Dialog.propTypes = {
  dialogRef: PropTypes.object.isRequired,
  cancelOnClick: PropTypes.func,
  confirmOnClick: PropTypes.func,
  children: PropTypes.node,
};

export default Dialog;
