import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

const Layout = () => {
  return (
    <>
      <Header />
      {/* was mb-36 */}
      <div className="mx-auto mb-36 max-w-4xl">
        <div className="mx-4">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
