//react
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
//stores
import useLoaderStore from "./store/loaderStore";
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

// HOC para envolver cada página y activar Loader global
function WithLoader({ children }) {
  const { isLoading } = useLoaderStore();
  return (
    <>
      {isLoading && <Loader />} {/* Loader global */}
      {children}
    </>
  );
}


const RoutesSystem = createBrowserRouter([

  /* main */
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <WithLoader>
          <EncargaloApp />
        </WithLoader>
      </Suspense>
    ),
  },

  /* shop */
  {
    path: "/:tag_shop",
    element: (
      <Suspense fallback={<Loader />}>
        <WithLoader>
          <ShopMenu />
        </WithLoader>
      </Suspense>

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
