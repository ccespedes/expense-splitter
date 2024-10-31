import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UseDataContext } from "../context/SiteContext";
import db from "../../utils/localstoragedb";
import RoundButton from "../ui/RoundButton";
import ProfilePic from "../../assets/ironman-headshot.png";
import Logo from "../../assets/splitter-logo.png";
import TopSearch from "../ui/TopSearch";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPath, setCurrentPath] = useState(location.pathname.split("/"));
  const [isNestedPath, setIsNestedPath] = useState(false);
  const [view, setView] = useState(null);
  const [showTest, setShowTest] = useState(false);
  const { search, setSearch } = UseDataContext();

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

  const homeView = () => {
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
            <div className="text-sm opacity-80">Fred Flintstone!</div>
          </div>
        </div>
        <div className="flex gap-2">
          <RoundButton
            onMouseEnter={handleMouseEnter}
            onMouseOut={handleMouseOut}
            onClick={clearData}
          >
            <i className="fa-regular fa-bell opacity-70"></i>
          </RoundButton>
        </div>
      </div>
    );
  };

  console.log("isNestedPath", isNestedPath);
  console.log("search.show", search.show);

  const standardView = () => {
    return (
      <div className="mb-4 flex items-center">
        {isNestedPath ? (
          <RoundButton
            onClick={() => navigate(`/${location.pathname.split("/")[1]}`)}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </RoundButton>
        ) : (
          <RoundButton
            onClick={() =>
              setSearch((prev) => ({ ...prev, show: !prev.show, input: "" }))
            }
          >
            <i
              className={`fa-solid ${search.show ? "fa-xmark" : "fa-magnifying-glass"}`}
            ></i>
          </RoundButton>
        )}
        <div className="mx-auto flex items-center justify-center opacity-100 transition-all duration-500">
          <div className="relative flex items-center">
            {!isNestedPath && search.show ? (
              <div
                className={`${!search.show && "opacity-0"} transition-all duration-200`}
              >
                <TopSearch />
              </div>
            ) : (
              <h1
                className={`absolute left-1/2 mb-0 -translate-x-1/2 transition-all duration-200 ${
                  search.show && "opacity-100"
                }`}
              >
                {currentPath.replace(/^\w/, (char) => char.toUpperCase())}
              </h1>
            )}
          </div>
        </div>
        <RoundButton>
          <img src={ProfilePic} className="h-8 w-8 rounded-full object-cover" />
        </RoundButton>
      </div>
    );
  };

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    console.log(pathSegments);
    setCurrentPath(pathSegments[1]);
    setIsNestedPath(!!pathSegments[2]);
  }, [location.pathname, search]);

  useEffect(() => {
    const getView = () => {
      switch (currentPath) {
        case "groups":
        case "friends":
        case "expenses":
          return standardView();
        case "signin":
          return loginView();
        default:
          return homeView();
      }
    };
    setView(getView());
  }, [currentPath, isNestedPath, search]);

  return (
    <div className="header-background flex h-[230px] flex-col bg-primary font-rubik text-white">
      <div className="mx-4">
        {/* don't show this on login page */}
        {currentPath !== "signin" && (
          <h2 className="mb-3 text-center text-[10px] font-extralight uppercase tracking-[0.5rem] opacity-70">
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
