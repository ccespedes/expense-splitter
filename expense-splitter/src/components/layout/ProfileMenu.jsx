import { signOut, auth } from "../../utils/firebase";
import { UseDataContext } from "../context/SiteContext";
import NavButton from "../ui/NavButton";
import useOutsideClick from "../../hooks/useOutsideClick";

const ProfileMenu = () => {
  const { clearData, handleSetMenuShow } = UseDataContext();

  const ref = useOutsideClick(handleSetMenuShow);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("signing out successful");
      clearData();
      //   console.log("auth", auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      ref={ref}
      className="z-10 mx-4 w-56 rounded-lg bg-white py-4 text-primary shadow-xl"
    >
      <p className="mx-6 border-primary/30 pb-2 font-semibold">My Account</p>
      <div className="border-b-[.05rem]"></div>
      <div className="mx-2 my-4">
        <ul className="flex flex-col gap-2 text-sm tracking-normal">
          <NavButton icon="fa-user">Profile</NavButton>
          <NavButton icon="fa-gear">Settings</NavButton>
          <NavButton onClick={handleSignOut} icon="fa-right-from-bracket">
            Logout
          </NavButton>
        </ul>
      </div>
    </div>
  );
};

export default ProfileMenu;
