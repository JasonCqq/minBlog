import React from "react";
import ReactDOM from "react-dom/client";
import "./Styling/index.scss";
import RouteSwitch from "./Components/Routeswitch";
import reportWebVitals from "./reportWebVitals";
import Context from "./Components/GlobalUser";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Context>
      <RouteSwitch />
    </Context>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
