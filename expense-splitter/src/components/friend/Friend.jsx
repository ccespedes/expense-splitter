import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import SearchBar from "../ui/SearchBar";
import Button from "../ui/Button";
import FriendList from "./FriendList";
import ButtonFooter from "../ui/ButtonFooter";
import PlainSection from "../layout/PlainSection";

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
      navigate("/signin");
    }
  }, [user]);

  return (
    <>
      <PlainSection>
        {/* <div className="mb-2">
          {friends.length > 3 && (
            <SearchBar input={inputText} inputHandler={inputHandler} />
          )}
        </div> */}
        <FriendList input={inputText} />
        <ButtonFooter className="md:w-[280px]">
          <Button
            className="w-full min-w-28 bg-primary"
            onClick={() => navigate("/friends/add")}
          >
            Add a Friend
          </Button>
        </ButtonFooter>
      </PlainSection>
    </>
  );
};

export default Friend;
