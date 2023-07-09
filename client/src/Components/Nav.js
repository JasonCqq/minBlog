import React from "react";
import "../Styling/Nav.scss";

function Nav() {
  return (
    <nav id="main-nav">
      <h1 id="main-logo">minBlog</h1>

      <ul className="main-right">
        <li>Home</li>
        <li>Blogs</li>
        <li>Login</li>
      </ul>
    </nav>
  );
}

export default Nav;
