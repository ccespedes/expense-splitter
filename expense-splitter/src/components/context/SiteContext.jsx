import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { auth, deleteUser } from "../../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
// import db from "../../utils/localstoragedb";
import { db as db, dbFriends } from "../../utils/firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const SiteContext = createContext(null);

export const UseDataContext = () => useContext(SiteContext);

export const DataProvider = ({ children }) => {
  // initialize data from localStorageDB
  // const initialFriends = db.queryAll("friends");
  // const initialFriends = getFriends();
  // const initalGroup = db.queryAll("groups");
  // const initialExpenses = db.queryAll("expenses");

  // const [user, setUser] = useState(db.queryAll("user")[0]);
  const localUser = localStorage.getItem("user");
  const [user, setUser] = useState(localUser ? JSON.parse(localUser) : null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState({ show: false, input: "" });
  const [menuShow, setMenuShow] = useState(false);

  // console.log("user", user);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in?
        const uid = user.uid;
        // console.log('user is logged in', uid)
        setUser({
          name: user.displayName,
          email: user.email,
          id: user.uid,
          photoURL: user.photoURL,
        });
        setLoggedIn(true);
        // setLoading(false)
      } else {
        // User is signed out
        console.log("user is logged out");
        setLoggedIn(false);
        // setLoading(false)
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      const friendsRef = collection(db, dbFriends);
      const q = query(
        friendsRef,
        where("uid", "==", user.id),
        orderBy("createdAt", "desc"),
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const updatedFriends = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFriends(updatedFriends);
      });

      // Clean up the listener on unmount
      return () => unsubscribe();
    }
  }, [user]);

  const handleSetUser = (data) => {
    console.log("handleSetUser data", data);
    // update the db with the new user and add user to friends
    // db.insertOrUpdate("user", { ID: 1 }, data);
    // db.insertOrUpdate("friends", { ID: 1 }, data);
    // db.commit();
    // setFriends(db.queryAll("friends"));
    setUser(data);
    setFriends([...friends, data]);
    localStorage.setItem("user", JSON.stringify(data));
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
    // db.drop();
    // db.commit();
    localStorage.clear(); // also clears out localStorageDB
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
        loggedIn,
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
