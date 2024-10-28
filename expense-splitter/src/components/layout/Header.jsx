import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import db from "../../utils/localstoragedb";
import RoundButton from "../ui/RoundButton";
import ProfilePic from "../../assets/ironman-headshot.png";
import Logo from "../../assets/splitter-logo.png";

export default function Header() {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(
    location.pathname.split("/")[1],
  );
  const [view, setView] = useState(null);
  const [showTest, setShowTest] = useState(false);

  const handleMouseEnter = () => {
    setShowTest(true);
  };

  const handleMouseOut = () => {
    setShowTest(false);
  };

  // test function to clear all data
  const clearData = () => {
    db.drop();
    db.commit();
    window.location.reload();
  };

  const loginView = () => {
    return (
      <div className="mt-8 flex items-center justify-center text-center text-[12px] font-extralight uppercase tracking-[.6rem] opacity-70">
        <img src={Logo} className="mr-4 h-12 w-auto" />
        <div>Expense Splitter</div>
      </div>
    );
  };

  const defaultView = () => {
    return (
      <>
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
              <div className="text-sm opacity-80">Fred Flintstone!</div>
            </div>
          </div>
          <h1 className="mx-auto mb-0 w-0 opacity-0">{currentPath}</h1>
          <div className="flex gap-2">
            <RoundButton>
              <i className="fa-solid fa-magnifying-glass opacity-70"></i>
            </RoundButton>
            <RoundButton
              onMouseEnter={handleMouseEnter}
              onMouseOut={handleMouseOut}
              onClick={clearData}
            >
              <i className="fa-regular fa-bell opacity-70"></i>
            </RoundButton>
          </div>
        </div>
      </>
    );
  };

  const standardView = () => {
    return (
      <div className="mb-4 flex items-center">
        <RoundButton>
          <img src={ProfilePic} className="h-8 w-8 rounded-full object-cover" />
        </RoundButton>
        <h1 className="mx-auto mb-0 opacity-100 transition-all duration-500">
          {currentPath.replace(/^\w/, (char) => char.toUpperCase())}
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
        <h1 className="mx-auto mb-0 opacity-100 transition-all duration-500">
          {currentPath.replace(/^\w/, (char) => char.toUpperCase())}
        </h1>
        <RoundButton>
          <i className="fa-solid fa-magnifying-glass opacity-70"></i>
        </RoundButton>
      </div>
    );
  };

  useEffect(() => {
    setCurrentPath(location.pathname.split("/")[1]);
    const getView = () => {
      switch (currentPath) {
        case "groups":
          return standardView();
        case "friends":
          return standardView();
        case "expenses":
          return standardView();
        case "signin":
          return loginView();
        default:
          return defaultView();
      }
    };
    setView(getView());
  }, [location.pathname, currentPath]);

  return (
    <div className="header-background flex h-[230px] flex-col bg-primary font-rubik text-white">
      <div className="mx-4">
        {/* don't show this on login page */}
        {currentPath !== "signin" && (
          <h2 className="mb-4 text-center text-[10px] font-extralight uppercase tracking-[0.5rem] opacity-70">
            Expense | Splitter
          </h2>
        )}
        <div className="mx-auto max-w-4xl">{view}</div>
      </div>
      <div
        className={`absolute left-1/2 ${showTest ? "top-8 opacity-80" : "top-36 opacity-0"} flex -translate-x-1/2 text-[8px] tracking-[.25rem] text-orange-500 transition-all duration-300`}
      >
        CLEAR TEST DATA
      </div>
    </div>
  );
}
