import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import FriendList from "./FriendList";
import ButtonFooter from "../ui/ButtonFooter";
import GetStarted from "../widgets/GetStarted";

const Friend = () => {
  const navigate = useNavigate();
  const { user, friends } = UseDataContext();

  const [inputText, setInputText] = useState("");

  const inputHandler = (e) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    // if user is not "logged in", go to login
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <>
      <h1 className="text-center">Friends</h1>
      <div className="mb-2">
        {friends.length > 3 && (
          <SearchBar input={inputText} inputHandler={inputHandler} />
        )}
      </div>
      <FriendList input={inputText} />
      <ButtonFooter>
        <Button className="bg-primary" onClick={() => navigate("/friends/add")}>
          Add Friend
        </Button>
      </ButtonFooter>
      <GetStarted />
    </>
  );
};

export default Friend;
