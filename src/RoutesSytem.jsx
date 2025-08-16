//react router dom
import { createBrowserRouter } from "react-router-dom";
//page
import EncargaloApp from "./EncargaloApp";
import ShopMenu from "./components/ShopMenu";

const indexActive = true;

const RoutesSystem = createBrowserRouter([
  {
    path: "/",
    element: <EncargaloApp />,
  },
  {
    path: "/:tag_shop",
    element: <ShopMenu />,
  },
]);

export default RoutesSystem;
