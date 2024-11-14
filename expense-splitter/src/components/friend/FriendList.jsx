import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import Card from "../ui/Card";
import NoDataPlaceHolder from "../ui/NoDataPlaceholder";
import { db, dbFriends } from "../../utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";

const FriendList = ({ input }) => {
  const { user, friends, groups, expenses, setFriends } = UseDataContext();
  const navigate = useNavigate();

  useEffect(() => {
    // if user is not logged in, go to signin
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  useEffect(() => {
    // Any side effects based on friends update can be placed here
  }, [friends]);

  console.log(friends);

  // Create reference to dom element
  const deleteDialogRef = useRef(null);
  const cantDeleteDialogRef = useRef(null);
  const [cantDeleteMsg, setCantDeleteMsg] = useState("");
  const [deleteID, setDeleteID] = useState(null);

  // Checks data for user id
  const existsIn = (array, nestedArray, element) => {
    return array.some((obj) => obj[nestedArray].includes(element));
  };

  // Delete friend if matches id
  const handleDeleteFriend = async (id) => {
    setFriends(friends.filter((friend) => friend.id !== id));
    await deleteDoc(doc(db, dbFriends, id));
    console.log("friend deleted: ", id);
  };

  // filter friends for search bar
  const filteredData = friends.filter((friend) => {
    if (input === "") {
      return friend;
    } else {
      return friend.name.toLowerCase().includes(input);
    }
  });

  return (
    <>
      {filteredData.length > 0 ? (
        filteredData.map((friend) => (
          <Card
            key={friend.id}
            id={friend.id}
            type={"expense"}
            icon={"fa-user"}
            title={friend.name}
            subtitle={friend?.email}
            hasButtons={true}
          >
            {friend.admin ? null : (
              <Button
                variant={"small"}
                className="bg-red-700"
                // Put friend id in state and opens dialog
                onClick={() => {
                  // Check if friend is part of a group
                  if (existsIn(groups, "friendIDs", friend.id)) {
                    setCantDeleteMsg("a group");
                    cantDeleteDialogRef.current.showModal();
                    return;
                  }

                  //   Check if friend is part of an expense
                  if (
                    expenses.some((expense) => {
                      return expense.weight.find(
                        (friendId) => friendId.friendId === friend.id,
                      );
                    })
                  ) {
                    setCantDeleteMsg("an expense");
                    cantDeleteDialogRef.current.showModal();
                    return;
                  }
                  setDeleteID(friend.id);
                  deleteDialogRef.current.showModal();
                }}
              >
                <i className="fa-solid fa-trash"></i>
              </Button>
            )}
            <Button
              variant={"small"}
              className="bg-primary"
              onClick={() => {
                navigate(`/friends/edit/${friend.id}`);
              }}
            >
              <i className="fa-solid fa-pen-to-square"></i>
            </Button>
          </Card>
        ))
      ) : (
        <NoDataPlaceHolder
          title="No friends to display"
          subtitle={`There are no friends that match "${input}"`}
        />
      )}

      <Dialog
        dialogRef={deleteDialogRef}
        confirmOnClick={() => handleDeleteFriend(deleteID)}
      >
        <p>Are you sure you want to delete this friend?</p>
      </Dialog>

      <Dialog dialogRef={cantDeleteDialogRef}>
        Cannot delete a friend that is part of {cantDeleteMsg}.
      </Dialog>
    </>
  );
};

export default FriendList;
