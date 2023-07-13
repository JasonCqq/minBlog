import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Nav from "./Nav";
import Blogs from "./Blogs";
import Profile from "./Profile";
import Create from "./Create";

const RouteSwitch = () => {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<App />}></Route>
          <Route path="/blogs" element={<Blogs />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create" element={<Create />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouteSwitch;
