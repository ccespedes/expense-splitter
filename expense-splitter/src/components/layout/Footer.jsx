import { NavLink } from "react-router-dom";
import IconButton from "../ui/IconButton";

const Footer = () => {
  return (
    <>
      <div className="over fixed bottom-0 left-1/2 z-40 flex h-[100px] w-full -translate-x-1/2 flex-col rounded-t-3xl bg-white text-primary/40">
        <nav className="m-auto w-full max-w-4xl px-4">
          <div className="mb-6 flex justify-between gap-2">
            <NavLink to="/home">
              <IconButton icon={"house"}>Home</IconButton>
            </NavLink>
            <NavLink to="/groups">
              <IconButton icon={"user-group"}>Groups</IconButton>
            </NavLink>
            <NavLink to="/friends">
              <IconButton icon={"address-book"}>Friends</IconButton>
            </NavLink>
            <NavLink to="/expenses">
              <IconButton icon={"credit-card"}>Expenses</IconButton>
            </NavLink>
          </div>
        </nav>
      </div>
      <div className="over pointer-events-none fixed bottom-0 left-1/2 z-10 flex w-full -translate-x-1/2 bg-gradient-to-t from-black/20 to-black/0 pb-28 pt-20"></div>
    </>
  );
};

export default Footer;
