import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RoutesSystem from "./RoutesSytem.jsx";
import { RouterProvider } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={RoutesSystem} />
  </StrictMode>
);
