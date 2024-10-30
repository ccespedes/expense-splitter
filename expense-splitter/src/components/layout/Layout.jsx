import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import GetStarted from "../widgets/GetStarted";

const Layout = () => {
  return (
    <>
      <Header />
      {/* was mb-36 */}
      <div className="mx-auto mb-10 max-w-4xl">
        <div className="mx-4">
          <Outlet />
          <GetStarted />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
