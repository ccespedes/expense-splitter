import db from "../../utils/localstoragedb";
import Dialog from "../ui/Dialog";
import { useRef } from "react";
import deleteReceiptFromStorage from "../../utils/deleteReceipt";
import Button from "../ui/Button";

const DisplayReceipt = ({ expense, setExpenses }) => {
  const deleteReceiptRef = useRef(null);

  const deleteReceiptURL = () => {
    // Remove url form local storage
    db.update("expenses", { id: expense.id }, (expense) => {
      expense.receipt_URL = null;
      return expense;
    });
    db.commit();

    // Update state
    setExpenses(db.queryAll("expenses"));
  };

  return (
    <div className="mb-4 flex flex-col items-center rounded-2xl bg-card-bg px-4 pb-4 pt-4">
      <div className="mb-2" data-html2canvas-ignore>
        <img
          src={expense.receipt_URL}
          alt={`Receipt for ${expense.name}`}
          className="rounded-2xl"
        />
      </div>
      <Button
        variant="small"
        className="bg-red-700 px-8"
        onClick={() => {
          deleteReceiptRef.current.showModal();
        }}
      >
        Delete Receipt
      </Button>

      <Dialog
        dialogRef={deleteReceiptRef}
        confirmOnClick={() => {
          deleteReceiptFromStorage(expense.receipt_URL, deleteReceiptURL);
        }}
      >
        <p>Are you sure you want to delete this receipt?</p>
      </Dialog>
    </div>
  );
};

export default DisplayReceipt;
