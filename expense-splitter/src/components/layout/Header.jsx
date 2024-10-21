import RoundButton from "../ui/RoundButton";
import ProfilePic from "../../assets/ironman-headshot.png";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(
    location.pathname.split("/")[1],
  );
  const [view, setView] = useState(null);
  console.log(currentPath);

  const standardView = () => {
    return (
      <div className="mb-4 flex items-center">
        <RoundButton>
          <img src={ProfilePic} className="h-8 w-8 rounded-full object-cover" />
        </RoundButton>
        <h1 className="mx-auto mb-0 opacity-100 transition-opacity duration-1000">
          Groups
        </h1>
        <RoundButton>
          <i className="fa-solid fa-magnifying-glass opacity-70"></i>
        </RoundButton>
      </div>
    );
  };

  const arrowBackView = () => {
    return (
      <div className="mb-4 flex items-center">
        <RoundButton>
          <i className="fa-solid fa-chevron-left opacity-70"></i>
        </RoundButton>
        <h1 className="mx-auto mb-0">Groups</h1>
        <div className="opacity-0">
          <RoundButton>
            <i className="fa-solid fa-chevron-right opacity-7"></i>
          </RoundButton>
        </div>
      </div>
    );
  };

  const defaultView = () => {
    return (
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <RoundButton>
            <img
              src={ProfilePic}
              className="h-8 w-8 rounded-full object-cover"
            />
          </RoundButton>
          <div className="tracking-normal">
            <div className="text-xs font-light opacity-50">Welcome back,</div>
            <div className="text-sm opacity-80">Carlos Cespedes!</div>
          </div>
        </div>
        <h1 className="mx-auto mb-0 w-[1px] opacity-0">Groups</h1>
        <div className="flex gap-2">
          <RoundButton>
            <i className="fa-solid fa-magnifying-glass opacity-70"></i>
          </RoundButton>
          <RoundButton>
            <i className="fa-regular fa-bell opacity-70"></i>
          </RoundButton>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setCurrentPath(location.pathname.split("/")[1]);
    const getView = () => {
      switch (currentPath) {
        case "groups":
          return standardView();
        case "friend":
          return standardView();
        case "expense":
          return standardView();
        default:
          return defaultView();
      }
    };
    setView(getView());
  }, [location.pathname, currentPath]);

  return (
    <div className="header-background flex h-[230px] flex-col bg-primary font-rubik text-white">
      <div className="mx-4">
        <h2 className="mb-5 text-center text-[10px] font-extralight uppercase tracking-[0.5rem] opacity-70">
          Expense | Splitter
        </h2>
        <div className="mx-auto max-w-4xl">{view}</div>
      </div>
    </div>
  );
}
