import { useState } from "react";
import { createContext, useContext } from "react";
import db from "../../utils/localstoragedb";
import "../../utils/dummyData";

const SiteContext = createContext(null);

export const UseDataContext = () => useContext(SiteContext);

export const DataProvider = ({ children }) => {
  // initialize data from localStorageDB
  const initialFriends = db.queryAll("friends");
  const initalGroup = db.queryAll("groups");
  const initialExpenses = db.queryAll("expenses");

  const [user, setUser] = useState(db.queryAll("user")[0]?.name || "");
  const [expenses, setExpenses] = useState(initialExpenses);
  const [groupData, setGroupData] = useState(initalGroup);
  const [friends, setFriends] = useState(initialFriends);
  const [search, setSearch] = useState({ show: false, input: "" });

  const handleSetUser = (username) => {
    setUser(username);
  };

  const handleSearch = (task, input) => {
    if (task === "show") {
      setSearch((prev) => ({ ...prev, show: true }));
    } else if (task === "hide") {
      setSearch((prev) => ({ ...prev, show: false, input: "" }));
    } else {
      setSearch((prev) => ({ ...prev, input: input }));
    }
  };

  return (
    <SiteContext.Provider
      value={{
        user,
        handleSetUser,
        groupData,
        setGroupData,
        friends,
        setFriends,
        expenses,
        setExpenses,
        search,
        setSearch,
        handleSearch,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
