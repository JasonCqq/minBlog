import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Nav from "./Nav";
import Blogs from "./Blogs";
import Blog from "./Blog";
import Profile from "./Profile";
import Create from "./Create";
import Edit from "./Edit";
import ScrollToTop from "./ScrollToTop";
import uniqid from "uniqid";
import { DarkModeProvider } from "@rbnd/react-dark-mode";

const RouteSwitch = () => {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop>
          <DarkModeProvider>
            <Nav />
            <Routes>
              <Route path="/" element={<App />}></Route>
              <Route path="/blogs" element={<Blogs />}></Route>
              <Route path="/blog/:id" element={<Blog key={uniqid()} />}></Route>
              <Route
                path="/profile/:id"
                element={<Profile key={uniqid()} />}
              ></Route>
              <Route path="/create" element={<Create />}></Route>
              <Route path="/edit/:id" element={<Edit key={uniqid()} />}></Route>
            </Routes>
          </DarkModeProvider>
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
};

export default RouteSwitch;
