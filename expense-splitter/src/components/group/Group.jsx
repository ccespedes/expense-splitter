import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import Card from "../ui/Card";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import ButtonFooter from "../ui/ButtonFooter";
import TopCard from "../ui/TopCard";
import PlainSection from "../layout/PlainSection";

export default function Group() {
  const navigate = useNavigate();
  const { user, groupData, expenses, friends } = UseDataContext();

  const [inputText, setInputText] = useState("");

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user]);

  const groupDisplay = groupData
    .sort((a, b) => b.ID - a.ID)
    .map((group, i) => {
      // latest group gets TopCard
      // use reduce to add up associated expense amounts
      const totalSpent = () => {
        return expenses
          .reduce((total, expense) => {
            if (group.expenseIDs.includes(expense.id)) {
              return total + parseFloat(expense.amount);
            }
            return total;
          }, 0)
          .toFixed(2);
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
            groupName={group.name}
            expenseName={group.name}
            expenseAmount={group.amount}
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

  // filter groupDisplay for search bar
  const filteredData = groupDisplay.filter((search) => {
    if (inputText === "") {
      return search;
    } else {
      return search.props.title.toLowerCase().includes(inputText);
    }
  });

  return groupData.length > 0 ? (
    <div className="relative -top-[110px]">
      {groupData.length > 3 && (
        <div className="mb-2">
          <SearchBar input={inputText} inputHandler={inputHandler} />
        </div>
      )}
      <div>{filteredData.length > 0 && <>{filteredData}</>}</div>
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
