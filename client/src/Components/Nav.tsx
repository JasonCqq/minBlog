import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import "../Styling/Nav.scss";
import axios from "axios";
import { useGlobalContext } from "./GlobalUser";

interface LoginData {
  username: string;
  password: string;
  [key: string]: string; // Index signature
}

function Nav() {
  const { user, setUser } = useGlobalContext();
  const [login, setLogin] = useState<boolean>();
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const loginForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loginData.password.length < 8) {
      return;
    }

    axios
      .post("http://localhost:3000/user/login", {
        username: loginData.username,
        password: loginData.password,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        if (data.success) {
          setUser(data.user);
          console.log(data);
        }
      })
      .catch((err) => console.error(err));
  };

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
          <a href="#" className="main-ref">
            Home
          </a>
          <a href="#" className="main-ref" onClick={() => console.log(user)}>
            Blogs
          </a>
          <a href="#" className="main-ref" onClick={() => setLogin(!login)}>
            Login
          </a>
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
            <p className="login-forgot-message">Forgot password</p>
          </div>
        </form>
      ) : null}
    </>
  );
}

export default Nav;
