import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import "../Styling/Nav.scss";
import axios from "axios";
import { useGlobalContext } from "./GlobalUser";
import { Link } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import { useDarkMode } from "@rbnd/react-dark-mode";

interface LoginData {
  username: string;
  password: string;
  [key: string]: string; // Index signature
}

function Nav() {
  axios.defaults.withCredentials = true;

  // Dark mode
  const { mode, setMode } = useDarkMode();
  const [isActive, setIsActive] = useState(mode === "dark");
  const darkModeToggle = () => {
    setMode(isActive ? "light" : "dark");
    setIsActive((prevActive) => !prevActive);
  };

  const { user, setUser } = useGlobalContext();
  const [login, setLogin] = useState<boolean>();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Check if cookie exists.
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_END}/user/login`, {
        withCredentials: true,
      })
      .then((res) => {
        const data = res.data;
        if (data.success === true) {
          setUser(data.user);
        } else if (data.success === false) {
          setUser(null);
        }
      });
  }, []);

  const loginForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACK_END}/user/login`, {
        username: loginData.username,
        password: loginData.password,
      })
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setUser(data.user);
          setLogin(false);
        }
      })
      .catch((err) => console.error(err));
  };

  const logOut = () => {
    axios
      .post(`${process.env.REACT_APP_BACK_END}/user/logout`)
      .then((res) => {
        const data = res.data;
        if (data.success === true) {
          setUser(null);
        }
      })
      .catch((err) => console.error(err));
  };

  // Store inputs
  function update(e: ChangeEvent<HTMLInputElement>) {
    const new_data: LoginData = { ...loginData };
    new_data[e.target.name] = e.target.value;
    setLoginData(new_data);
  }

  return (
    <>
      <nav id="main-nav">
        <h1 id="main-logo">minBlog</h1>

        <ul className="main-right">
          <Link to="/" className="main-ref">
            Home
          </Link>
          <Link
            to="/blogs?p=0&sortBy=timestamp&sortOrder=desc"
            className="main-ref"
          >
            Blogs
          </Link>
          {user ? (
            <>
              <Link to={`/profile/${user.id}`} className="main-ref">
                Profile
              </Link>
              <p
                style={{ cursor: "pointer" }}
                className="main-ref"
                onClick={() => logOut()}
              >
                Logout
              </p>
              <p className="main-ref-user main-ref" style={{ color: "white" }}>
                {user.username}
              </p>
            </>
          ) : (
            <p
              style={{ cursor: "pointer" }}
              className="main-ref"
              onClick={() => setLogin(!login)}
            >
              Login
            </p>
          )}
        </ul>
      </nav>

      {login ? (
        <form className="login-form" onSubmit={(e) => loginForm(e)}>
          <input
            type="string"
            placeholder="Username"
            required
            className="login-input"
            name="username"
            value={loginData.username}
            onChange={(e) => update(e)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            required
            className="login-input"
            name="password"
            minLength={8}
            maxLength={20}
            value={loginData.password}
            onChange={(e) => update(e)}
          ></input>
          <div className="form-flex">
            <button type="submit" className="login-button">
              Log In
            </button>
          </div>
        </form>
      ) : null}

      <div className="nav-buttons">
        <button
          className={`darkmode-button ${isActive ? "dark-mode" : "light-mode"}`}
          onClick={() => darkModeToggle()}
        >
          <MdOutlineDarkMode size={25} />
        </button>
      </div>
    </>
  );
}

export default Nav;
