import { useState } from "react";
import { Controller } from "react-hook-form";
import useOutsideClick from "../../hooks/useOutsideClick";

export default function MultiSelectDropdown({
  friends,
  control,
  editFriends,
  errors,
}) {
  const [isOpen, setIsOpen] = useState(false);
  //this is to store friends list to display after added to group
  const [displayFriendNameIds, setDisplayFriendNameIds] = useState(() =>
    editFriends ? editFriends : null,
  );

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = () => {
    setIsOpen(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  //handle adding selected friend to the list to be displayed
  const handleDisplaySelectedFriends = (arr) => {
    setDisplayFriendNameIds([...arr]);
  };

  return (
    <div ref={ref}>
      <div
        className={`flex cursor-pointer items-center justify-between rounded-lg bg-primary/10 px-4 py-3 font-roboto font-light ${errors ? "border-red-500 outline-red-500" : "border-transparent"}`}
        onClick={toggleDropdown}
      >
        <div className="text-primary/50">Select Friends</div>
        <i className="fa-solid fa-chevron-down text-3xl text-accent"></i>
      </div>
      {isOpen && (
        <div className="z-10 mt-1 w-full cursor-pointer rounded-md border bg-white">
          {friends.map((friend) => (
            <label key={friend.id} className="flex items-center p-2">
              <Controller
                name="friendIDs"
                control={control}
                render={({ field }) => (
                  <input
                    id={`friend-${friend.id}`}
                    type="checkbox"
                    value={friend.id}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const valueArray = field.value || [];
                      const newValue = isChecked
                        ? [...valueArray, friend.id]
                        : valueArray.filter((id) => id !== friend.id);
                      field.onChange(newValue);
                      //update the checked friends list
                      handleDisplaySelectedFriends(newValue);
                    }}
                    checked={field.value?.includes(friend.id) || false}
                  />
                )}
              />
              <span className="ml-2">{friend.name}</span>
            </label>
          ))}
        </div>
      )}
      {displayFriendNameIds && (
        <p className="mt-2 text-sm opacity-80">
          <span className="font-bold">Friends: </span>
          {friends.map(
            (friend, i) =>
              displayFriendNameIds.includes(friend.id) && (
                <span key={friend.id} className="pl-[2px]">
                  {friend.name.split(" ")[0]}
                  {displayFriendNameIds.length > i + 1 && `, `}
                </span>
              ),
          )}
        </p>
      )}
    </div>
  );
}
