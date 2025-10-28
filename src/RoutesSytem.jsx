//react
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
//stores
//lazy (usando alias para rutas más limpias)
const EncargaloApp = lazy(() => import("./EncargaloApp.jsx"));
const ShopMenu = lazy(() => import("./features/shops/components/ShopMenu.jsx"));
const CustomerProfile = lazy(() => import("./features/profile/components/CustomerProfile.jsx"));
const ShoppingCart = lazy(() => import("./features/cart/components/ShoppingCart.jsx"));
const CheckoutShopping = lazy(() => import("./features/checkout/components/CheckoutShopping.jsx"));
//customer
import UpdatePersonalInfo from "./features/profile/components/UpdatePersonalInfo";
import AddAddress from "./features/profile/components/AddAddress";
import UpdatePassword from "./features/profile/components/UpdatePassword";
import Loader from "./components/Loader.jsx";
import { WithLoader } from "./store/WithLoader";

const LoadingWrapper = ({ children }) => (
  <Suspense fallback={<Loader />}>
    <WithLoader>
      {children}
    </WithLoader>
  </Suspense>
);


const RoutesSystem = createBrowserRouter([

  /* main */
  {
    path: "/",
    element: (
      <LoadingWrapper>
        <EncargaloApp />
      </LoadingWrapper>
    ),
  },

  /* shop */
  {
    path: "/:tag_shop",
    element: (
      <LoadingWrapper>
        <ShopMenu />
      </LoadingWrapper>
    ),
  },

  /* customer */
  {
    path: "/customer_profile/",
    element: <CustomerProfile />,
    children: [
      /* personal data */
      {
        index: true,
        element: <UpdatePersonalInfo />
      },
      {
        path: "personal_data",
        element: <UpdatePersonalInfo />
      }
      /* address */
      ,
      {
        path: "address",
        element: <AddAddress />
      },
      /* update password */
      {
        path: "update_password",
        element: <UpdatePassword />
      }
    ]
  },

  /* shopping cart */
  {
    path: "/shopping_cart",
    element: <ShoppingCart />
  },
  { path: "/shopping_cart/checkout", element: <CheckoutShopping /> }

]);

export default RoutesSystem;
