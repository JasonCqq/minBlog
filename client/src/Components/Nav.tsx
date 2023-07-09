import React from "react";
import "../Styling/Nav.scss";

function Nav() {
  return (
    <nav id="main-nav">
      <h1 id="main-logo">minBlog</h1>

      <ul className="main-right">
        <a href="#" className="main-ref">
          Home
        </a>
        <a href="#" className="main-ref">
          Blogs
        </a>
        <a href="#" className="main-ref">
          Login
        </a>
      </ul>
    </nav>
  );
}

export default Nav;
