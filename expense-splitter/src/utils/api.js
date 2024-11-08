import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db, dbFriends } from "./firebase";

export const getFriends = async (user) => {
  try {
    const friendsRef = collection(db, dbFriends);
    const q = query(
      friendsRef,
      where("uid", "==", user.id),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const friends = [];
    querySnapshot.forEach((doc) => {
      const { name, email } = doc.data();
      const { id } = doc;
      friends.push({ name, email, id });
    });
    return friends;
  } catch (error) {
    console.error(error.message);
  }
};
