import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { auth, deleteUser } from "../../utils/firebase";
import db from "../../utils/localstoragedb";
import "../../utils/dummyData";

const SiteContext = createContext(null);

export const UseDataContext = () => useContext(SiteContext);

export const DataProvider = ({ children }) => {
  // initialize data from localStorageDB
  const initialFriends = db.queryAll("friends");
  const initalGroup = db.queryAll("groups");
  const initialExpenses = db.queryAll("expenses");

  const [user, setUser] = useState(db.queryAll("user")[0]);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [groupData, setGroupData] = useState(initalGroup);
  const [friends, setFriends] = useState(initialFriends);
  const [search, setSearch] = useState({ show: false, input: "" });
  const [menuShow, setMenuShow] = useState(false);

  const handleSetUser = (data) => {
    console.log("handleSetUser data", data);
    // update the db with the new user and add user to friends
    db.insertOrUpdate("user", { ID: 1 }, data);
    db.insertOrUpdate("friends", { ID: 1 }, data);
    db.commit();
    setFriends(db.queryAll("friends"));
    setUser(data);
  };

  const handleSetMenuShow = () => {
    setMenuShow((prev) => !prev);
  };

  useEffect(() => {
    console.log("rendered");
  }, [menuShow]);

  const handleTestData = (data) => {
    setUser(data); // set test data
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

  // test function to clear all data
  const clearData = () => {
    const user = auth.currentUser;
    console.log("user", user);
    db.drop();
    db.commit();
    window.location.reload();
    // delete user from local and firebase
    // deleteUser(user)
    //   .then(() => {
    //     console.log("user deleted");
    //     db.drop();
    //     db.commit();
    //     window.location.reload();
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
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
        handleTestData,
        menuShow,
        setMenuShow,
        handleSetMenuShow,
        clearData,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
