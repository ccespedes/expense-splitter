import { useNavigate } from "react-router-dom";

const HomeCard = ({
  id,
  type,
  catIcon,
  expenseName,
  expenseAmount,
  groupName,
  groupCount,
  totalSpent,
  budget,
  hasButtons,
}) => {
  const navigate = useNavigate();
  const handleInteract = (e) => {
    if (e.code === "Space" || e.code === "Enter" || e.type === "click") {
      navigate(`/${type}s/${id}`);
    }
  };

  return (
    <div
      className={`mb-4 ml-4 flex min-w-80 cursor-pointer items-center rounded-2xl bg-card-bg p-5`}
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
              <h2 className="text-kush text-xl tracking-tighter">
                {expenseName}
              </h2>
              <p className="text-sm opacity-90">
                <span className="font-medium">Expense:</span> ${expenseAmount}
              </p>
              <p className="text-xs opacity-70">October 15, 2024</p>
            </div>
          </div>
          <div className="flex w-full items-center rounded-xl bg-primary/5 p-2 px-[1rem]">
            <div className="mr-2 flex py-2">
              <i
                className={`fa-solid fa-user-group text-md mx-auto text-primary/90`}
              ></i>
            </div>
            <div className="mr-auto">
              <h2 className="text-sm leading-5 tracking-tight">{groupName}</h2>
            </div>
            <h2 className="rounded-md bg-primary/10 px-2 py-[0.15rem] text-sm leading-5 tracking-tight">
              {groupCount}
            </h2>
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
                  // width: `${progressBarStyle.width}%`,
                  // background: `${progressBarStyle.color}`,
                  width: `80%`,
                  background: `green`,
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

export default HomeCard;