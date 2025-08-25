//react
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
//stores
import useLoaderStore from "./store/loaderStore";
//lazy
const Loader = lazy(() => import("./components/Loader.jsx"));
const EncargaloApp = lazy(() => import("./EncargaloApp.jsx"));
const ShopMenu = lazy(() => import("./components/ShopMenu.jsx"));
const CustomerProfile = lazy(() => import("./components/CustomerProfile/CustomerProfile.jsx"));
//customer
import UpdatePersonalInfo from "./components/CustomerProfile/UpdatePersonalInfo";
import AddAddress from "./components/CustomerProfile/AddAddress";
import UpdatePassword from "./components/CustomerProfile/UpdatePassword";

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
  {
    path: "/customer_profile/",
    element: <CustomerProfile />,
    children: [
      {
        index: true,
        element: <UpdatePersonalInfo />
      },
      {
        path: "personal_data",
        element: <UpdatePersonalInfo />
      }
      ,
      {
        path: "address",
        element: <AddAddress />
      },
      {
        path: "update_password",
        element: <UpdatePassword />
      }
    ]
  }

]);

export default RoutesSystem;
