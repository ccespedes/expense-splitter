import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoDataPlaceholder from "./NoDataPlaceholder";
import { formatWithCommas } from "../../utils/functions";

const TopCard = ({
  id,
  type,
  catIcon,
  title,
  groupMembers,
  totalSpent,
  expenseIcons,
  budget,
  hasButtons,
}) => {
  const [progressBarStyle, setProgressBarStyle] = useState({
    width: 0,
    color: "#D4E2F7",
  });
  const navigate = useNavigate();
  const handleInteract = (e) => {
    if (e.code === "Space" || e.code === "Enter" || e.type === "click") {
      navigate(`/${type}s/${id}`);
    }
  };

  // figure out the width of the expense percentage bar
  // max it out at 100 to avoid growing outside the div
  const expensePercentage =
    ((totalSpent / budget) * 100).toFixed() >= 100
      ? 100
      : ((totalSpent / budget) * 100).toFixed();

  // set the percentage and color to state and disply as style
  // tailwind is not great at rendering dynamically
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

  const expenseIconsList = expenseIcons.map((expenseIcon) => (
    <div key={expenseIcon} className="flex rounded-md bg-primary/10 px-2 py-2">
      <i
        className={`fa-solid ${expenseIcon} text-md mx-auto text-primary/90`}
      ></i>
    </div>
  ));
  const expenseMsg =
    expenseIcons.length < 2 ? `1 Expense` : `${expenseIcons.length} Expenses`;

  return (
    <div
      className={`mb-4 flex min-w-80 ${expenseIcons.length > 0 ? "cursor-pointer" : "pointer-events-auto"} items-center rounded-2xl bg-card-bg p-5`}
      onClick={expenseIcons.length > 0 ? handleInteract : null}
    >
      <div className="relative flex w-full items-center justify-between">
        <div className="flex w-full flex-col gap-4">
          <div
            onClick={hasButtons ? null : handleInteract}
            className="flex cursor-pointer items-center"
          >
            <div className="mr-3 flex w-20 items-center justify-center rounded-2xl bg-primary/20 p-5">
              <i
                className={`fa-solid ${catIcon} mx-auto text-4xl text-primary`}
              ></i>
            </div>
            <div>
              <h2 className="mb-0 tracking-tighter text-accent">{title}</h2>
              <p className="text-sm opacity-90">
                <span className="font-medium">Group Members: </span>
                {groupMembers}
              </p>
            </div>
          </div>

          {expenseIcons.length > 0 ? (
            <>
              <div className="flex w-full items-center justify-between rounded-xl bg-primary/5 px-[1rem] py-[1rem]">
                <h3 className="text-sm leading-5 tracking-tight">
                  {expenseMsg}
                </h3>
                <div className="flex gap-2">{expenseIconsList}</div>
              </div>
              {/* dollars and progress bar */}
              <div>
                <div className="text-md mb-1 flex justify-between font-semibold tracking-tight opacity-80">
                  <div>${formatWithCommas(totalSpent)}</div>
                  <div className="opacity-50">
                    budget: ${formatWithCommas(budget)}
                  </div>
                </div>
                <div className="relative flex">
                  <div
                    className={`absolute h-3 rounded-[.3rem] transition-all duration-500 ease-out`}
                    style={{
                      width: `${progressBarStyle.width}%`,
                      background: `${progressBarStyle.color}`,
                    }}
                  ></div>
                  <div className="h-3 w-full rounded-[.3rem] bg-primary"></div>
                </div>
              </div>
            </>
          ) : (
            <NoDataPlaceholder
              title="There are no expenses to display"
              subtitle="Get started by creating an expense."
              btnText="Add an Expense"
              onClick={() => navigate(`/expenses/add?groupId=${id}`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCard;
