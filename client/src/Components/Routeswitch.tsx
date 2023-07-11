import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Nav from "./Nav";

const RouteSwitch = () => {
  return (
    <>
      <HashRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<App />}></Route>
        </Routes>
      </HashRouter>
    </>
  );
};

export default RouteSwitch;
