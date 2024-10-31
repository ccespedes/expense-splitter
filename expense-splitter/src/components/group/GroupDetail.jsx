import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import db from "../../utils/localstoragedb";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Dialog from "../ui/Dialog";
import PieChart from "../widgets/PieChart";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import ButtonFooter from "../ui/ButtonFooter";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../utils/firebase";
import { categories } from "../../utils/dummyData";
import PlainSection from "../layout/PlainSection";
import { formatWithCommas } from "../../utils/functions";

function GroupDetail() {
  const [seeMore, setSeeMore] = useState(false);
  const [progressBarStyle, setProgressBarStyle] = useState({
    width: 0,
    color: "#D4E2F7",
  });
  const { groupData, setGroupData, friends, expenses, setExpenses } =
    UseDataContext();

  // Create reference to dom elements
  const deleteDialogRef = useRef(null);

  const { groupId } = useParams();
  const navigate = useNavigate();

  const singleGroup = groupData.find((group) => group.id === groupId);

  // get all the group expenses
  const groupExpenses = expenses.filter((expense) =>
    singleGroup?.expenseIDs?.includes(expense.id),
  );

  // get the total group expense amount
  const totalExpenseAmount = groupExpenses
    .map((expense) => parseFloat(expense.amount))
    .reduce((acc, curr) => acc + curr, 0)
    .toFixed(2);

  const displayTotal = () => {
    const formattedTotal = totalExpenseAmount;
    return formattedTotal.endsWith(".00")
      ? parseInt(totalExpenseAmount).toString()
      : formattedTotal;
  };

  // figure out the width of the expense percentage bar
  // max it out at 100 to avoid growing outside the div
  const expensePercentage =
    ((totalExpenseAmount / singleGroup?.budget) * 100).toFixed() >= 100
      ? 100
      : ((totalExpenseAmount / singleGroup?.budget) * 100).toFixed();

  // set the percentage and color to state and disply as style
  // tailwind is bad at rendering dynamically
  useEffect(() => {
    let barColor;
    switch (true) {
      case expensePercentage <= 70:
        barColor = "#1d9e05"; //green
        break;
      case expensePercentage <= 85:
        barColor = "#de6000"; //orange
        break;
      default:
        barColor = "#d20000"; //red
    }
    setProgressBarStyle((prev) => ({
      ...prev,
      width: expensePercentage,
      color: barColor,
    }));
  }, [expensePercentage]);

  // 404 if no ID found
  if (!singleGroup) {
    return <Navigate to={"/404"} />;
  }

  // pie data
  const pieData = () => {
    const results = {};
    groupExpenses.forEach((expense) => {
      const cat = expense.category;
      const amt = parseFloat(expense.amount);
      if (results[cat]) {
        results[cat] += amt;
      } else {
        results[cat] = amt;
      }
    });
    return results;
  };

  // Closes or opens the dialog
  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  //delete a group
  const handleDelete = (id) => {
    // Create an array of promises
    const deleteReceiptPromises = groupExpenses.map((expense) => {
      if (expense.receipt_URL) {
        const receiptRef = ref(storage, expense.receipt_URL);
        return deleteObject(receiptRef);
      }
    });

    // Delete all receipts from firebase
    Promise.all(deleteReceiptPromises)
      .then(() => {
        // Delete from local storage
        groupExpenses.forEach((expense) => {
          db.deleteRows("expenses", { id: expense.id });
        });
        db.deleteRows("groups", { id: id });
        db.commit();

        //call setState to render the component
        setGroupData(db.queryAll("groups"));
        setExpenses(db.queryAll("expenses"));

        // after deleting, navigate to groups
        navigate("/groups");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const friendsList = friends
    .filter((friend) => singleGroup.friendIDs.includes(friend.id))
    .map((friend) => friend.name.split(" ")[0]);

  const friendsDisplay =
    friendsList.length > 3 ? (
      seeMore ? (
        <>
          {friendsList.join(", ")}{" "}
          <span
            onClick={() => setSeeMore(false)}
            className="cursor-pointer font-semibold hover:underline"
          >
            see less
          </span>
        </>
      ) : (
        <>
          {friendsList.slice(0, 3).join(", ")}
          ...{" "}
          <span
            onClick={() => setSeeMore(true)}
            className="cursor-pointer font-semibold hover:underline"
          >
            see more
          </span>
        </>
      )
    ) : (
      friendsList.join(", ")
    );

  const expenseDisplay = groupExpenses
    .sort((a, b) => b.ID - a.ID) // show latest expense up top
    .map((expense, i) => {
      const catIcon = categories.find(
        (cat) => cat.name === expense.category,
      ).icon;
      return (
        <Card
          key={expense.id}
          id={expense.id}
          type={"expense"}
          icon={catIcon}
          title={expense.name}
          price={expense.amount}
        />
      );
    });

  return (
    <PlainSection>
      <div className="mb-32">
        <div className="mb-4 rounded-2xl bg-card-bg px-4 pb-4 pt-4">
          <h2 className="mb-2 text-center text-3xl">{singleGroup.name}</h2>
          <p className="mb-2">
            <span className="font-semibold">Description: </span>
            {singleGroup.description}
          </p>
          <p className="mb-4">
            <span className="font-semibold">Group Members: </span>
            {friendsDisplay}
          </p>

          {groupExpenses.length < 1 ? (
            <p className="text-center font-normal">
              <span className="font-semibold">Budget this month:</span> $
              {singleGroup.budget}
            </p>
          ) : (
            <>
              <p className="mb-2 text-center font-normal">
                <span className="font-semibold">
                  Budget spending this month:
                </span>{" "}
                ${formatWithCommas(displayTotal())} / $
                {formatWithCommas(singleGroup.budget)}
              </p>
              <div className="relative mb-2 flex">
                <div
                  className={`absolute h-6 rounded-lg transition-all duration-500 ease-out`}
                  style={{
                    width: `${progressBarStyle.width}%`,
                    background: `${progressBarStyle.color}`,
                  }}
                ></div>
                <div className="h-6 w-full rounded-lg bg-primary"></div>
              </div>
            </>
          )}
        </div>

        {groupExpenses.length > 0 && (
          <PieChart label={"Categories"} pieData={pieData()} />
        )}

        <div className="mt-8">
          {groupExpenses.length > 0 ? (
            <>{expenseDisplay}</>
          ) : (
            <NoDataPlaceholder
              title="There are no expenses to display"
              subtitle="Get started by creating an expense."
              btnText="Add an Expense"
              onClick={() =>
                navigate(`/expenses/add?groupId=${singleGroup.id}`)
              }
            />
          )}
        </div>

        <ButtonFooter className={"md:w-[500px]"}>
          <Button
            className="w-full bg-red-700 md:min-w-40"
            onClick={() => {
              toggleDialog(deleteDialogRef);
            }}
          >
            Delete
          </Button>
          <Button
            className="w-full bg-primary md:min-w-40"
            onClick={() => navigate(`/groups/edit/${singleGroup.ID}`)}
          >
            Edit
          </Button>
          <Button
            className="w-full bg-primary md:min-w-40"
            onClick={() => navigate(`/expenses/add?groupId=${singleGroup.id}`)}
          >
            Add an Expense
          </Button>
        </ButtonFooter>

        <Dialog
          dialogRef={deleteDialogRef}
          cancelOnClick={() => toggleDialog(deleteDialogRef)}
          confirmOnClick={() => handleDelete(groupId)}
        >
          <p className="text-center">
            Deleting this group will also delete all associated expenses.
            <br />
            Are you sure you want to delete this group?
          </p>
        </Dialog>
      </div>
    </PlainSection>
  );
}

export default GroupDetail;
