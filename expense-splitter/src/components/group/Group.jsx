import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import { categories } from "../../utils/dummyData";
import Button from "../ui/Button";
import Card from "../ui/Card";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import ButtonFooter from "../ui/ButtonFooter";
import TopCard from "../ui/TopCard";
import PlainSection from "../layout/PlainSection";
import NoDataPlaceHolder from "../ui/NoDataPlaceholder";

export default function Group() {
  const navigate = useNavigate();
  const { user, groupData, expenses, friends, search } = UseDataContext();

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  // filter groupDisplay for search bar
  const filteredData = groupData.filter((group) => {
    if (search.input === "") {
      return group;
    } else {
      return group.name.toLowerCase().includes(search.input.toLowerCase());
    }
  });

  const groupDisplay = filteredData
    .sort((a, b) => b.ID - a.ID)
    .map((group, i) => {
      // latest group gets TopCard
      // use reduce to add up associated expense amounts
      const totalSpent = () => {
        const total = expenses.reduce((total, expense) => {
          if (group.expenseIDs.includes(expense.id)) {
            return total + parseFloat(expense.amount);
          }
          return total;
        }, 0);
        const formattedTotal = total.toFixed(2);
        return formattedTotal.endsWith(".00")
          ? parseInt(total).toString()
          : formattedTotal;
      };

      const expenseIcons = () => {
        const groupExpenses = expenses
          .filter((expense) => expense.groupId === group.id)
          .map((expense) => expense.category);

        return categories
          .filter((cat) => groupExpenses.includes(cat.name))
          .map((cat) => cat.icon);
      };

      // get the groupMembers
      const groupMembers = () => {
        return friends.reduce((total, friend, i) => {
          if (group.friendIDs.includes(friend.id)) {
            return (total += `${friend.name.split(" ")[0]}${i === friends.length - 1 ? "" : ", "}`);
          }
          return total;
        }, "");
      };

      if (i === 0) {
        return (
          <TopCard
            key={group.id}
            id={group.id}
            type={"group"}
            catIcon={"fa-user-group"}
            title={group.name}
            expenseName={group.name}
            expenseAmount={group.amount}
            expenseIcons={expenseIcons()}
            groupMembers={groupMembers()}
            totalSpent={totalSpent()}
            budget={group.budget}
          />
        );
      }
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
    });

  return groupData.length > 0 ? (
    <div className="relative -top-[110px] pb-10">
      <div>
        {groupDisplay.length > 0 ? (
          <>{groupDisplay}</>
        ) : (
          <div className="rounded-2xl bg-card-bg p-5">
            <NoDataPlaceHolder
              title="No groups to display"
              subtitle={`There are no groups that match "${search.input}"`}
            />
          </div>
        )}
      </div>
      <ButtonFooter className="md:w-[280px]">
        <Button
          className="w-full min-w-28 bg-primary"
          onClick={() => navigate("/groups/add")}
        >
          Add a Group
        </Button>
      </ButtonFooter>
    </div>
  ) : (
    <PlainSection>
      <NoDataPlaceholder
        title="There are no groups to display"
        subtitle="Get started by creating a group."
        btnText="Add a Group"
        onClick={() => navigate("/groups/add")}
      />
    </PlainSection>
  );
}
