import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import ButtonFooter from "../ui/ButtonFooter";
import Card from "../ui/Card";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import { categories } from "../../utils/dummyData";
import PlainSection from "../layout/PlainSection";

export default function Expense() {
  const navigate = useNavigate();
  const { user, handleSetModal, modal, expenses } = UseDataContext();

  const [inputText, setInputText] = useState("");

  let inputHandler = (e) => {
    let lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Sort expenses by db ID
  const expenseDisplay = expenses
    .sort((a, b) => b.ID - a.ID)
    .map((expense) => {
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
          subtitle={expense.description}
          price={expense.amount}
        />
      );
    });

  const filteredExpenses = expenseDisplay.filter((search) => {
    if (inputText === "") {
      return search;
    } else {
      return (
        search.props.title.toLowerCase().includes(inputText) ||
        search.props.subtitle.toLowerCase().includes(inputText)
      );
    }
  });

  return (
    <PlainSection>
      <div className="pb-8">
        {/* <div className="mb-2">
        {expenses.length > 3 && (
          <SearchBar input={inputText} inputHandler={inputHandler} />
        )}
      </div> */}
        {expenseDisplay.length < 1 ? (
          <NoDataPlaceholder
            title="There are no expenses to display"
            subtitle="Get started by creating a new expense"
            btnText="Add an Expense"
            onClick={() => navigate("/expenses/add")}
          />
        ) : filteredExpenses.length > 0 ? (
          filteredExpenses
        ) : (
          <NoDataPlaceholder
            title="There are no expenses matching this search"
            subtitle="Would you like to create a new expense?"
            btnText="Add an Expense"
            onClick={() => {
              navigate(-1);
            }}
          />
        )}
        <ButtonFooter className="md:w-[280px]">
          <Button
            className="w-full min-w-28 bg-primary"
            onClick={() => navigate("/expenses/add")}
          >
            Add an Expense
          </Button>
        </ButtonFooter>
      </div>
    </PlainSection>
  );
}
