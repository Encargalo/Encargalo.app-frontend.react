import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EncargaloApp from "./EncargaloApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <EncargaloApp />
  </StrictMode>
);
