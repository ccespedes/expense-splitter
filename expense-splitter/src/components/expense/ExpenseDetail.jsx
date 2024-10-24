import { useParams, useNavigate, Navigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import Card from "../ui/Card";
import PieChart from "../widgets/PieChart";
import DownloadPDF from "../widgets/DownloadPDF";
import { useRef, useState } from "react";
import ButtonFooter from "../ui/ButtonFooter";
import Button from "../ui/Button";
import db from "../../utils/localstoragedb";
import Dialog from "../ui/Dialog";
import formatDate from "../../utils/formatDate";
import ReceiptUpload from "../upload/ReceiptUpload";
import DisplayReceipt from "../upload/DisplayReceipt";
import deleteReceiptFromStorage from "../../utils/deleteReceipt";
import PlainSection from "../layout/PlainSection";

function ExpenseDetail() {
  const { expenses, groupData, friends, setExpenses } = UseDataContext();
  const { expenseId } = useParams();
  const navigate = useNavigate();

  // Create reference to dom elements
  const deleteDialogRef = useRef(null);
  const downloadRef = useRef(null);

  const [deleteID, setDeleteID] = useState(null);

  // get expense details
  const expenseDetails = expenses.find((expense) => expense.id === expenseId);

  // Closes or opens the dialog
  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  //delete an expense
  const deleteExpense = () => {
    db.deleteRows("expenses", { id: expenseDetails.id });
    db.commit();
    //call setState to render the component
    setExpenses(db.queryAll("expenses"));
    // after deleting, navigate to groups
    navigate("/expenses");
  };

  const handleDelete = () => {
    if (expenseDetails.receipt_URL) {
      deleteReceiptFromStorage(expenseDetails.receipt_URL, deleteExpense);
    } else {
      deleteExpense();
    }
  };

  // Redirect to 404 page if expense not found
  if (!expenseDetails) {
    return <Navigate to={"404"} />;
  }

  // get group connected to expense
  const expenseGroup = groupData.filter(
    (group) => group.id === expenseDetails.groupId,
  )[0];

  // set data for pie chart to be array of contribution values
  const pieChartData = {};

  // get date and format it
  const expenseDate = formatDate(expenseDetails.date);

  const expenseAmount = parseFloat(expenseDetails.amount).toFixed(2);

  expenseDetails.weight.forEach((weight) => {
    const friendInfo = friends.find((friend) => friend.id === weight.friendId);
    pieChartData[friendInfo.name] = (
      (weight.percentage / 100) *
      expenseDetails.amount
    ).toFixed(2);
  });

  // sort payers by contribution amount
  const sortedContributions = expenseDetails.weight.sort(function (a, b) {
    return b.percentage - a.percentage;
  });

  const memberDisplay = sortedContributions.map((friend) => {
    return (
      <Card
        key={friend.friendId}
        icon={"fa-user"}
        hasButtons={true}
        title={friends.find((i) => i.id === friend.friendId).name}
        subtitle={parseFloat(friend.percentage).toFixed(2) + "%"}
        price={((friend.percentage / 100) * expenseDetails.amount).toFixed(2)}
      />
    );
  });

  return (
    <PlainSection>
      <div ref={downloadRef} className="mb-28">
        <div className="mb-4 rounded-2xl bg-card-bg px-4 pb-4 pt-4">
          <div className="mb-2 flex items-center">
            <i
              data-html2canvas-ignore
              onClick={() => navigate("/expenses")}
              className="fa-solid fa-chevron-left ml-2 cursor-pointer text-3xl text-accent"
            ></i>
            <h2 className="mx-auto mb-0">{expenseDetails.name}</h2>
            <i className="fa-solid fa-chevron-right mr-2 text-3xl text-accent opacity-0"></i>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="p-2 text-center text-4xl font-semibold text-green-900">
              ${expenseAmount}
            </h2>
            <p>
              <span className="mr-1 font-semibold">Description:</span>{" "}
              {expenseDetails.description}
            </p>
            <p>
              <span className="mr-1 font-semibold">Category:</span>
              {expenseDetails.category.replace(/^\w/, (char) =>
                char.toUpperCase(),
              )}
            </p>
            <p className="mb-2">
              <span className="mr-1 font-semibold">Date:</span>
              {expenseDate}
            </p>
            <div className="flex items-center justify-between">
              <Button
                variant="card"
                className="rounded-xl bg-primary/10 px-4 py-2 hover:bg-primary/20"
                onClick={() => {
                  navigate(`/groups/${expenseGroup.id}`);
                }}
              >
                <div className="flex items-center">
                  <i
                    className={`fa-solid fa-user-group mx-auto mr-3 text-xl text-primary/90`}
                  ></i>
                  <p className="text-sm text-primary">{expenseGroup.name}</p>
                </div>
              </Button>
              <DownloadPDF
                filename={expenseDetails.name}
                contentRef={downloadRef}
              />
            </div>
          </div>
        </div>

        <PieChart label="Amount Owed" pieData={pieChartData} />

        <div className={"html2pdf__page-break"}></div>

        <div className="mt-4">
          <>{memberDisplay}</>
        </div>
        {expenseDetails.receipt_URL ? (
          <DisplayReceipt expense={expenseDetails} setExpenses={setExpenses} />
        ) : (
          <ReceiptUpload
            expenseDetails={expenseDetails}
            setExpenses={setExpenses}
            expenses={expenses}
          />
        )}

        <ButtonFooter className="md:w-[320px]">
          <Button
            className="w-full min-w-32 bg-red-700"
            onClick={() => {
              setDeleteID(expenseDetails.ID);
              toggleDialog(deleteDialogRef);
            }}
          >
            Delete
          </Button>
          <Button
            className="w-full min-w-32 bg-primary"
            onClick={() => navigate(`/expenses/edit/${expenseDetails.ID}`)}
          >
            Edit
          </Button>
        </ButtonFooter>
        <Dialog
          dialogRef={deleteDialogRef}
          cancelOnClick={() => toggleDialog(deleteDialogRef)}
          confirmOnClick={() => handleDelete()}
        >
          <p>Are you sure you want to delete this expense?</p>
        </Dialog>
      </div>
    </PlainSection>
  );
}

export default ExpenseDetail;
