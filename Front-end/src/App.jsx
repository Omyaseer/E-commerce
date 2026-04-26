import { Outlet, useLocation } from "react-router-dom";
import "./App.css";
import Footer from "./component/Footer/Footer";
import Header from "./component/Header/Header";
import UpperHeader from "./component/UpperHeader/UpperHeader";
import { ToastContainer } from "react-toastify";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/Login" || 
                     location.pathname === "/CreateAccount" || 
                     location.pathname === "/ForgetPassword";

  return (
    <>
      {!isAuthPage && <UpperHeader />}
      {!isAuthPage && <Header />}
      < Outlet />
      {!isAuthPage && <Footer />}
      <ToastContainer position="top-right" autoClose={5000}/>
    </>
  );
}

export default App;
