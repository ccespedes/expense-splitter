import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import Card from "../ui/Card";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import ButtonFooter from "../ui/ButtonFooter";
import GetStarted from "../widgets/GetStarted";
import TopCard from "../ui/TopCard";

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

      // get the participants
      const participants = () => {
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
            participants={participants()}
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

  return (
    <>
      <div className="relative -top-[110px]">
        {/* <h1 className="text-center">Groups</h1> */}
        {groupData.length > 3 && (
          <div className="mb-2">
            <SearchBar input={inputText} inputHandler={inputHandler} />
          </div>
        )}
        <div>
          {filteredData.length > 0 ? (
            <>{filteredData}</>
          ) : (
            <NoDataPlaceholder
              title="There are no groups to display"
              subtitle="Get started by creating a group."
              btnText="Create a Group"
              onClick={() => navigate("/groups/add")}
            />
          )}
        </div>
        <ButtonFooter>
          <Button
            className="bg-primary"
            onClick={() => navigate("/groups/add")}
          >
            Create Group
          </Button>
        </ButtonFooter>
        <GetStarted />
      </div>
    </>
  );
}
