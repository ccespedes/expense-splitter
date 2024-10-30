import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import ButtonFooter from "../ui/ButtonFooter";
import Card from "../ui/Card";
import NoDataPlaceholder from "../ui/NoDataPlaceholder";
import { categories } from "../../utils/dummyData";
import PlainSection from "../layout/PlainSection";

export default function Expense() {
  const navigate = useNavigate();
  const { user, search, expenses } = UseDataContext();

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/signin");
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

  const filteredExpenses = expenseDisplay.filter((expense) => {
    if (search.input === "") {
      return expense;
    } else {
      return (
        expense.props.title
          .toLowerCase()
          .includes(search.input.toLowerCase()) ||
        expense.props.subtitle
          .toLowerCase()
          .includes(search.input.toLowerCase())
      );
    }
  });

  return (
    <PlainSection>
      <div className="pb-16">
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
