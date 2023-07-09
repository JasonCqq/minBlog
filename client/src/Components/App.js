import React from "react";
import "../Styling/App.scss";

function App() {
  return (
    <main>
      <header className="main-container">
        <section className="main-welcome">
          <h1 className="heading">Minified Blogs</h1>
          <p className="heading-desc">
            Read, Publish, Share minified blogs <br></br>
            that takes 2 minutes to read or create.
          </p>
        </section>

        <section>
          <form className="main-form">
            <p className="form-label">Sign Up</p>
            <input placeholder="Email address" required></input>
            <input placeholder="Full Name" required></input>
            <input placeholder="Username" required></input>
            <input placeholder="Password" required></input>
            <input placeholder="Confirm password" required></input>

            <button type="submit" className="main-form-button">
              Sign Up
            </button>
          </form>
        </section>
      </header>

      <section className="main-blogs">
        <p>Recent Blogs</p>
      </section>

      <section className="main-description">
        <p>How to get started</p>
      </section>

      <section className="main-message">
        <p>Ready to join us now?</p>
        <p>Create an account today.</p>
      </section>
    </main>
  );
}

export default App;
