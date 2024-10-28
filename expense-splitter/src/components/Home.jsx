import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "./context/SiteContext";
import Card from "./ui/Card";
import NoDataPlaceholder from "./ui/NoDataPlaceholder";
import HomeCard from "./ui/HomeCard";
import { categories } from "../utils/dummyData";
import PlainSection from "./layout/PlainSection";

export default function Home() {
  const navigate = useNavigate();
  const { user, groupData, expenses } = UseDataContext();

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/signin");
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
            subtitle={expenseGroup?.name}
            price={expense.amount}
          />
        );
      }
    });

  const heroDisplay = expenses
    .sort((a, b) => b.ID - a.ID) // show latest expense up top
    .map((expense, i) => {
      // get the category icon
      const catIcon = categories.find(
        (cat) => cat.name === expense.category,
      ).icon;
      // get the group associated with this expense
      const expenseGroup = groupData.find(
        (group) => group.id === expense.groupId,
      );

      // calculate total spent
      const expenseIds = expenseGroup.expenseIDs;
      const totalSpent = () => {
        let total = 0;
        expenseIds.forEach((id) =>
          expenses.find((expense) => {
            if (id === expense.id) {
              total += parseFloat(expense.amount);
            }
          }),
        );
        return (Math.round(total * 100) / 100).toFixed(2);
      };

      return (
        <HomeCard
          key={expense.id}
          id={expense.id}
          type={"expense"}
          catIcon={catIcon}
          expenseName={expense.name}
          expenseAmount={expense.amount}
          expenseDate={expense.date}
          groupName={expenseGroup.name}
          groupCount={expenseGroup.friendIDs.length}
          totalSpent={totalSpent()}
          budget={expenseGroup.budget}
        />
      );
    });

  return (
    // if heroDisplay exists (at least one group and one expense exists)
    heroDisplay.length > 0 ? (
      <div className="relative -top-[110px]">
        <div className="-ml-4 -mr-4 mb-8 flex overflow-x-auto pr-4">
          {heroDisplay}
        </div>
        <div className="mb-8">
          <h3 className="mb-2 font-medium">Recent Groups</h3>
          {groupData.length > 0 ? (
            <>{groupDisplay}</>
          ) : (
            <NoDataPlaceholder
              title="There are no groups to display"
              subtitle="Get started by creating a group."
              btnText="Add a Group"
              onClick={() => navigate("/groups/add")}
            />
          )}
        </div>

        <>
          <h3 className="mb-2 font-medium">Recent Expenses</h3>
          {expenses.length > 0 ? (
            <>{expenseDisplay}</>
          ) : (
            <NoDataPlaceholder
              title="There are no expenses to display"
              subtitle="Get started by creating an expense."
              btnText="Add Expense"
              onClick={() => navigate("/expenses/add")}
            />
          )}
        </>
      </div>
    ) : (
      <PlainSection>
        <div className="mb-8">
          <h3 className="mb-4 font-medium">Recent Groups</h3>
          {groupData.length > 0 ? (
            <>{groupDisplay}</>
          ) : (
            <NoDataPlaceholder
              title="There are no groups to display"
              subtitle="Get started by creating a group."
              btnText="Add a Group"
              onClick={() => navigate("/groups/add")}
            />
          )}
        </div>

        <>
          <h3 className="mb-4 font-medium">Recent Expenses</h3>
          {expenses.length > 0 ? (
            <>{expenseDisplay}</>
          ) : (
            <NoDataPlaceholder
              title="There are no expenses to display"
              subtitle="Get started by creating an expense."
              btnText="Add an Expense"
              onClick={() => navigate("/expenses/add")}
            />
          )}
        </>
      </PlainSection>
    )
  );
}
