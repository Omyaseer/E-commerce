import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Contact from "../Pages/Contact/Contact";
import About from "../Pages/About/About";
import Error from "../Pages/Error/Error";
import Login from "../Pages/Login/Login";
import CreateAccount from "../Pages/CreateAccount/CreateAccount";
import ForgetPassword from "../Pages/ForgetPassword/ForgetPassword";
import Test from "../Pages/Test/Test";
import WhishList from "../Pages/WishList/WhishList";
import Homepage from "../Pages/Homepage/Homepage";
import Cart from "../Pages/Cart/Cart";
import Checkout from "../Pages/Checkout/Checkout";
import Products from "../Pages/Products/Products";
import User from "../Pages/User/User";
import ProtectedRoute from "../component/ProtectedRoute/ProtectedRoute";
const Routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {index: true,element: <Navigate to="/Login" replace />},
      {path: "Login",element: <Login />},
      {path: "CreateAccount",element: <CreateAccount />},
      {path: "ForgetPassword",element: <ForgetPassword />},

      {path: "home", element:(
          <ProtectedRoute> 
             <Homepage /> 
          </ProtectedRoute>
        )},
      {path: "cart",element:(
          <ProtectedRoute>
             <Cart />
           </ProtectedRoute>
        )},
      {path: "checkout",element:(
          <ProtectedRoute>
             <Checkout />
          </ProtectedRoute>
        )},
      {path: "contact",element:(
          <ProtectedRoute>
             <Contact />
          </ProtectedRoute>
          )},
      {path: "about", element:(
          <ProtectedRoute>
             <About />
          </ProtectedRoute>
        )},
      {path: "Whishlist", element:(
         <ProtectedRoute>
             <WhishList />
         </ProtectedRoute>
        )},
      {path: "products", element:(
         <ProtectedRoute>
             <Products />
         </ProtectedRoute>
        )},
      {path: "user", element:(
         <ProtectedRoute>
             <User />
         </ProtectedRoute>
        )},
      
      { path: "*", element: <Error /> },
    ],
  },
]);

export default Routes;
