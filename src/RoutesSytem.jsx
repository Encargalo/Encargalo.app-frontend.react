//react
import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
//components
import Loader from "./components/Loader";
//stores
import useLoaderStore from "./store/loaderStore";
//page
const EncargaloApp = lazy(() => import('./EncargaloApp'))
const ShopMenu = lazy(() => import('./components/ShopMenu'))
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
]);

export default RoutesSystem;
