import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "./context/SiteContext";
import Card from "./ui/Card";
import NoDataPlaceholder from "./ui/NoDataPlaceholder";
import GetStarted from "./widgets/GetStarted";

export default function Home() {
  const navigate = useNavigate();
  const { user, groupData, expenses } = UseDataContext();

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const groupDisplay = groupData
    .sort((a, b) => b.ID - a.ID) // show latest expense up top
    .map((group, i) => {
      // show a max of 3 groups
      if (i <= 2) {
        return (
          <Card
            key={group.id}
            id={group.id}
            type={"group"}
            icon={"fa-user-group"}
            title={group.name}
            subtitle={group.description}
          />
        );
      }
    });

  const expenseDisplay = expenses
    .sort((a, b) => b.ID - a.ID) // show latest expense up top
    .map((expense, i) => {
      // show a max of 3 expenses
      if (i <= 2) {
        // get the group associated with this expense
        const expenseGroup = groupData.find(
          (group) => group.id === expense.groupId,
        );

        return (
          <Card
            key={expense.id}
            id={expense.id}
            type={"expense"}
            icon={"fa-money-check-dollar"}
            title={expense.name}
            subtitle={expenseGroup?.name}
            price={expense.amount}
          />
        );
      }
    });

  return (
    <div>
      <h1 className="text-center">Welcome, {user}!</h1>
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-medium">Recent Groups</h2>
        {groupData.length > 0 ? (
          <>{groupDisplay}</>
        ) : (
          <NoDataPlaceholder
            title="There are no groups to display"
            subtitle="Get started by creating a group."
            btnText="Create a Group"
            onClick={() => navigate("/groups/add")}
          />
        )}
      </div>

      <>
        <h2 className="mb-4 text-2xl font-medium">Recent Expenses</h2>
        {expenses.length > 0 ? (
          <>{expenseDisplay}</>
        ) : (
          <NoDataPlaceholder
            title="There are no expenses to display"
            subtitle="Get started by creating an expense."
            btnText="Create Expense"
            onClick={() => navigate("/expenses/add")}
          />
        )}
      </>
      <GetStarted />
      {/* <FooterHome /> // remove footer from home until we establish outlets*/}
    </div>
  );
}
