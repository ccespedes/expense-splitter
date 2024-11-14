import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { auth, dbExpenses, dbGroups, deleteUser } from "../../utils/firebase";
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
  const localUser = localStorage.getItem("user");
  const [user, setUser] = useState(localUser ? JSON.parse(localUser) : null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState({ show: false, input: "" });
  const [menuShow, setMenuShow] = useState(false);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingExpenses, setLoadingExpenses] = useState(true);

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

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const groupsRef = collection(db, dbGroups);
      const q = query(
        groupsRef,
        where("uid", "==", user.id),
        orderBy("createdAt", "desc"),
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const updatedGroups = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(updatedGroups);
        setLoadingGroups(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const expensesRef = collection(db, dbExpenses);
      const q = query(
        expensesRef,
        where("uid", "==", user.id),
        orderBy("createdAt", "desc"),
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const updatedExpenses = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExpenses(updatedExpenses);
        setLoadingExpenses(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleSetUser = (data) => {
    setUser(data);
    setFriends([...friends, data]);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const handleSetMenuShow = () => {
    setMenuShow((prev) => !prev);
  };

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

  return (
    <SiteContext.Provider
      value={{
        user,
        loggedIn,
        handleSetUser,
        groups,
        loadingGroups,
        setGroups,
        friends,
        setFriends,
        expenses,
        loadingExpenses,
        setExpenses,
        search,
        setSearch,
        handleSearch,
        handleTestData,
        menuShow,
        setMenuShow,
        handleSetMenuShow,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
