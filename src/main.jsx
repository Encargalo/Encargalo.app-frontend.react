import "./index.css";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
//components
import Loader from "./components/Loader.jsx";
import RoutesSystem from "./RoutesSytem.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <RouterProvider router={RoutesSystem} />
    </Suspense>
  </StrictMode>
);

