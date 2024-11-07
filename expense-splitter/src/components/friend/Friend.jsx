import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import Button from "../ui/Button";
import FriendList from "./FriendList";
import ButtonFooter from "../ui/ButtonFooter";
import PlainSection from "../layout/PlainSection";

const Friend = () => {
  const navigate = useNavigate();
  const { user, search } = UseDataContext();

  useEffect(() => {
    // if user is not logged in, go to signin
    if (!user) {
      navigate("/signin");
    }
  }, [user]);

  return (
    <PlainSection>
      <div className="flex flex-col-reverse pb-16">
        <FriendList input={search.input.toLowerCase()} />
        <ButtonFooter className="md:w-[280px]">
          <Button
            className="w-full min-w-28 bg-primary"
            onClick={() => navigate("/friends/add")}
          >
            Add a Friend
          </Button>
        </ButtonFooter>
      </div>
    </PlainSection>
  );
};

export default Friend;
