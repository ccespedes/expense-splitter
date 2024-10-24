import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../ui/Button";
import { UseDataContext } from "../context/SiteContext";
import { nanoid } from "nanoid";
import db from "../../utils/localstoragedb";
import { categories } from "../../utils/dummyData";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Icon, IconButton, Tooltip } from "@mui/material";
import PlainSection from "../layout/PlainSection";

export default function CreateExpense() {
  const { groupData, setExpenses, setGroupData, friends, modal } =
    UseDataContext();

  const navigate = useNavigate();

  const [allFriends, setAllFriends] = useState([]);
  const [weightTotal, setWeightTotal] = useState(0);

  const queryParams = new URLSearchParams(location.search);
  const params = Object.fromEntries(queryParams.entries());

  const {
    handleSubmit,
    register,
    setValue,
    watch, // lets use this to track values
    formState: { errors },
  } = useForm();

  // watch all fields
  const watchedValues = watch();

  //run when expense is created inside a group
  useEffect(() => {
    if (params.groupId) {
      //set the default value for group to set up the initial values of friends cotribution
      setValue("group", params.groupId);
    }
  }, []);

  useEffect(() => {
    // reset all friends in group
    setAllFriends([]);
    // spread in friends in group
    setAllFriends((prev) => [...prev, ...friendsInGroup]);
  }, [watchedValues["group"]]);

  // update weight/dollar on weight value/amount change
  useEffect(() => {
    if (watchedValues["amount"]) {
      // get friends with non-zeros
      const getFriendsWithNonZeros = () => {
        let results = [];
        allFriends.forEach((friend) => {
          if (watchedValues[friend.name] != "0") {
            results.push({ ...friend, weight: watchedValues[friend.name] });
          }
        });
        return results;
      };
      const friendsWithNonZeros = getFriendsWithNonZeros();

      // get friends with empty weights
      const hasEmptyWeights = friendsWithNonZeros.some(
        (friend) => friend.weight === "",
      );

      // filter out friends with empty weights
      const friendsWithWeight = friendsWithNonZeros.filter(
        (friend) => friend.weight !== "",
      );

      // calculate non-zero percentage
      const totalPercentages = !hasEmptyWeights
        ? friendsWithNonZeros.reduce(
            (acc, curr) => acc + parseFloat(curr.weight),
            0,
          )
        : friendsWithWeight.reduce(
            (acc, curr) => acc + parseFloat(curr.weight),
            0,
          );

      // update weight/dollar on weight value change
      const updatedFriends = allFriends.map((friend) => {
        const newWeight = watchedValues[friend.name];
        const zeroDefault =
          watchedValues["amount"] / parseFloat(allFriends.length);
        // generate the dollar amount based on weight
        const newDollar =
          parseFloat(newWeight) === 0
            ? zeroDefault
            : (parseFloat(watchedValues[friend.name]) *
                watchedValues["amount"]) /
              100;

        const newZeroWeight =
          (100 - totalPercentages) /
          (allFriends.length - friendsWithNonZeros.length);

        const weightLimit = totalPercentages - parseFloat(newWeight);

        const calculateTotal = () => {
          if (totalPercentages > 100) {
            return totalPercentages;
          }
          if (totalPercentages === 0) {
            return 100;
          } else if (parseFloat(newWeight) === 0) {
            return 100;
          }
          return totalPercentages;
        };

        setWeightTotal(calculateTotal());

        const acceptedWeight =
          parseFloat(newWeight) <= weightLimit ? newWeight : "0";

        // if a new weight has been inputted
        return newWeight !== "0"
          ? {
              ...friend,
              weight: acceptedWeight.toString(),
              dollar: !newWeight ? 0 : `$${newDollar.toFixed(2)}`,
            }
          : {
              ...friend,
              weight: newZeroWeight.toString(),
              dollar: !newZeroWeight
                ? 0
                : `$${((newZeroWeight * watchedValues["amount"]) / 100).toFixed(2)}`,
            };
      });

      setAllFriends(updatedFriends);
      // only update state when friend values change
    }
  }, [
    allFriends.map((friend) => watchedValues[friend.name]).join(),
    watchedValues["amount"],
  ]);

  // get the friends in the group
  const friendIdsArr = groupData.find(
    (group) => group.id === watchedValues["group"],
  )?.friendIDs;

  const friendsInGroup = friends
    .filter((friends) => friendIdsArr?.includes(friends.id))
    .map((friend, i) => ({
      name: friend.name,
      weight: 0,
      id: friendIdsArr[i],
    }));

  // generate friend contribution fields
  const friendContributionFields = allFriends?.map((friend) => {
    return (
      <div
        key={friend.name}
        className="mb-2 grid grid-cols-3 items-center justify-between gap-2"
      >
        <label className="mr-2" htmlFor={friend.name}>
          {friend.name}
        </label>
        <div className="relative ml-auto flex w-[98px] items-center">
          <input
            id={friend.name}
            type="number"
            className="w-full pr-4"
            name={friend.name}
            required
            placeholder="0"
            defaultValue={0}
            {...register(`${friend.name}`, {
              pattern: {
                value: /^\d{1,2}$/,
                message:
                  "Invalid input. Please enter a number between 0 and 99.",
              },
            })}
            // Allow only numbers with up to 2 whole numbers, a period, and 2 decimal places
            onInput={(e) => {
              const input = e.target;
              input.value = input.value
                .replace(/[^0-9.]/g, "") // Remove non-numeric and non-period characters
                .replace(/^(\d{1,2})\.(\d{2}).*/, "$1.$2") // Limit to 2 decimal places
                .replace(/^(\d{3,})/, "$1") // Prevents more than 2 whole numbers
                .slice(0, 5); // Ensure the input length is capped (2 whole, period, 2 decimal)
            }}
          />
          <span className="absolute right-4 font-roboto font-light text-gray-800">
            %
          </span>
        </div>
        <div className="h-16 rounded-lg bg-accent/50 p-5 text-center font-semibold">
          {friend.dollar}
        </div>
      </div>
    );
  });

  const onSubmit = (values) => {
    // get friends with non-zeros
    const friendsWithNonZeros = allFriends.filter(
      (friend) => friend.weight != "0" && friend.name,
    );

    // calculate non-zero percentage
    const nonZeroPercentage = friendsWithNonZeros.reduce(
      (acc, curr) => acc + parseFloat(curr.weight),
      0,
    );
    const id = nanoid();
    const weightObj = allFriends.map((friend) => {
      const finalWeight =
        friend.weight === "0"
          ? // subtract non-zero percentage and divide by remaining friends
            (
              (100 - nonZeroPercentage) /
              (allFriends.length - friendsWithNonZeros.length)
            ).toFixed()
          : parseFloat(friend.weight);
      return { friendId: friend.id, percentage: finalWeight };
    });
    const newExpense = {
      id,
      ...values,
      date: new Date(),
      weight: weightObj,
      groupId: values.group,
    };

    db.insert("expenses", { ...newExpense });
    // update groups state with new expense id
    setGroupData((prev) =>
      prev.map((group) =>
        group.id === values.group
          ? { ...group, expenseIDs: [...group.expenseIDs, id] }
          : group,
      ),
    );
    // update groups with new expense id
    db.update("groups", { id: values.group }, (row) => ({
      ...row,
      expenseIDs: [...row.expenseIDs, id],
    }));
    db.commit();
    // update expenses state with new db values
    setExpenses(db.queryAll("expenses"));
    navigate(`/expenses/${id}`);
  };

  const weightInfo =
    "Expenses are split evenly by default. Assign a percentage and the remaining 0's will divided evenly from the remaning balance.";

  return (
    <PlainSection>
      <h2 className="text-center">Add an Expense </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-5 flex flex-col">
          <label className="mb-1" aria-required="true" htmlFor="name">
            Name:*{" "}
          </label>
          <input
            id="name"
            autoComplete="name"
            placeholder="Name of expense"
            {...register("name", { required: "A name is required" })}
          />
          <div className="error-text">{errors.name && errors.name.message}</div>
        </div>

        <div className="mb-5 flex flex-col">
          <label className="mb-1" aria-required="true" htmlFor="description">
            Description:*{" "}
          </label>
          <input
            id="description"
            placeholder="Describe the expense"
            {...register("description", {
              required: "A description is required",
            })}
          />
          <div className="error-text">
            {errors.description && errors.description.message}
          </div>
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="category" className="mb-1" aria-required="true">
            Category:*
          </label>
          <select
            id="category"
            className="h-16"
            name="category"
            {...register("category", {
              required: "Please select a category",
            })}
          >
            <option value=""></option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name.replace(/^\w/, (char) => char.toUpperCase())}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="error-text"> {errors.category.message}</p>
          )}
        </div>

        <div className="mb-5 flex flex-col">
          <label className="mb-1" aria-required="true" htmlFor="amount">
            Amount:*{" "}
          </label>
          <input
            id="amount"
            placeholder="Enter a value"
            {...register("amount", {
              required: "Please enter an amount",
              pattern: {
                value: /^[0-9]*(.[0-9]{2})?$/i,
                message:
                  "Please enter a valid dollar amount (e.g., 10, 10.50).",
              },
            })}
            onInput={(e) => {
              const input = e.target;
              input.value = input.value.replace(/[^0-9.]/g, ""); // Remove non-numeric and non-period characters
            }}
          />
          {errors.amount && (
            <p className="error-text"> {errors.amount.message} </p>
          )}
        </div>

        <div className="mb-5 flex flex-col">
          <label htmlFor="group" className="mb-2" aria-required="true">
            Group Name:*
          </label>

          <select
            id="group"
            className="h-16"
            name="group"
            {...register("group", {
              required: "Pleaes select a group to apply this expense to",
            })}
          >
            <option value=""></option>
            {groupData.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          {errors.group && (
            <p className="error-text"> {errors.group.message}</p>
          )}
        </div>

        <div className="mb-8">
          {watchedValues["group"] && (
            <>
              <h3 className="mb-4">
                Weight Contributions:*
                <Tooltip
                  title={weightInfo}
                  placement="top-end"
                  enterTouchDelay={0}
                  leaveTouchDelay={5000}
                >
                  <IconButton className="ml-1">
                    <Icon className="fa-solid fa-circle-info rounded-full text-accent" />
                  </IconButton>
                </Tooltip>
              </h3>
              <div className="bg-neutral/[2%] mb-4 flex items-center justify-between rounded-xl border border-primary/10 p-4">
                <div>
                  {weightTotal !== 100 ? (
                    <p className="error-text">Combined weights must be 100%</p>
                  ) : (
                    <p>Combined weights:</p>
                  )}
                </div>
                <div>
                  <p
                    className={`font-bold ${weightTotal === 100 ? "text-green-800" : "text-red-500"}`}
                  >
                    {weightTotal}% <span className="font-normal">of</span> 100%
                  </p>
                </div>
              </div>
              {friendContributionFields}
            </>
          )}
        </div>

        <div className="flex gap-8">
          <Button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full md:max-w-48"
          >
            Cancel
          </Button>
          {weightTotal !== 100 ? (
            <Button
              disabled={true}
              className="w-full cursor-not-allowed bg-primary opacity-25 md:max-w-48"
            >
              Submit
            </Button>
          ) : (
            <Button className="w-full bg-primary md:max-w-48">Submit</Button>
          )}
        </div>
      </form>
    </PlainSection>
  );
}
