import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TopCard = ({
  id,
  type,
  catIcon,
  groupName,
  participants,
  totalSpent,
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

  return (
    <div
      className={`mb-4 flex min-w-80 cursor-pointer items-center rounded-2xl bg-card-bg p-5`}
      onClick={hasButtons ? null : handleInteract}
    >
      <div className="relative flex w-full items-center justify-between">
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center">
            <div className="mr-3 flex w-20 items-center justify-center rounded-2xl bg-primary/20 p-5">
              <i
                className={`fa-solid ${catIcon} mx-auto text-4xl text-primary`}
              ></i>
            </div>
            <div>
              <h2 className="text-xl tracking-tighter text-accent">
                {groupName}
              </h2>
              <p className="text-sm opacity-90">
                <span className="font-medium">Participants: </span>
                {participants}
              </p>
            </div>
          </div>
          <div className="flex w-full items-center rounded-xl bg-primary/5 px-[1rem] py-[1rem]">
            <div className="mr-2 flex rounded-md bg-primary/10 px-2 py-2">
              <i
                className={`fa-solid fa-gift text-md mx-auto text-primary/90`}
              ></i>
            </div>
            <div className="mr-2 flex rounded-md bg-primary/10 px-2 py-2">
              <i
                className={`fa-solid fa-cart-shopping text-md mx-auto text-primary/90`}
              ></i>
            </div>
            <div className="mr-auto">
              <h2 className="text-sm leading-5 tracking-tight"></h2>
            </div>
            <h2 className="text-sm leading-5 tracking-tight">$445.00</h2>
          </div>
          {/* dollars and progress bar */}
          <div>
            <div className="text-md mb-1 flex justify-between font-semibold tracking-tight opacity-80">
              <div>${totalSpent}</div>
              <div className="opacity-50">budget: ${budget}</div>
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
        </div>
      </div>
    </div>
  );
};

export default TopCard;
