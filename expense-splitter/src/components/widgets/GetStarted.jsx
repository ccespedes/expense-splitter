import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import { getFriends, getGroups } from "../../utils/api";

const GetStarted = () => {
  const { groups, user } = UseDataContext();

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

  useEffect(() => {
    const checkFriends = async () => {
      const friends = await getFriends(user);
      if (friends.length < 2) {
        toggleDialog(addFriendDialogRef);
      }
    };
    checkFriends();
    const checkGroups = async () => {
      const groups = await getGroups(user);
      if (groups.length === 0) {
        toggleDialog(addGroupDialogRef);
      }
    };
    checkGroups();
  }, []);

  const toggleDialog = (ref) => {
    if (!ref.current) {
      return;
    }
    ref.current.hasAttribute("open")
      ? ref.current.close()
      : ref.current.showModal();
  };

  // Create reference to dom elements
  const addFriendDialogRef = useRef(null);
  const addGroupDialogRef = useRef(null);
  return (
    <>
      {currentPath !== "friends" && currentPath !== "signin" && (
        <Dialog isCustom={true} dialogRef={addFriendDialogRef}>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-6 text-center">
              Get started by adding a friend to split expenses with.
            </p>
            <Button
              className="w-full bg-primary"
              onClick={() => navigate("/friends/add")}
            >
              Add a Friend
            </Button>
          </div>
        </Dialog>
      )}
      {currentPath !== "groups" && currentPath !== "friends" && (
        <Dialog isCustom={true} dialogRef={addGroupDialogRef}>
          <div className="flex flex-col items-center justify-center">
            <p className="mb-6 text-center">
              Create a group to add expenses with friends.
            </p>
            <Button
              className="w-full bg-primary"
              onClick={() => navigate("/groups/add")}
            >
              Add a Group
            </Button>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default GetStarted;
