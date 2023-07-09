import React, { useEffect, useState } from "react";
import "../Styling/App.scss";
import uniqid from "uniqid";

interface Post {
  title: string;
  text: string;
  category: string;
  author_id: {
    username: string;
  };
  timestamp: Date;
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/posts/6")
      .then((res) => res.json())
      .then((dat) => setPosts(dat))
      .catch((err) => console.log(err));
  }, []);

  return (
    <main>
      <header className="main-container">
        <section className="main-welcome">
          <h1 className="heading">Minified Blogs</h1>
          <p className="heading-desc">
            Read, Publish, Share minified blogs <br></br>
            it takes 2 minutes to read or create.
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
              SUBMIT
            </button>
          </form>
        </section>
      </header>

      <section className="main-blogs">
        <p className="main-blogs-heading">Recent Blogs</p>
        <article className="blogs-grid">
          {posts.map((post) => {
            return (
              <div className="blogs-item" key={uniqid()}>
                <h2>{post.title}</h2>
                <p>{post.text}</p>
                <p>{post.author_id.username}</p>
                <p>{post.category}</p>
              </div>
            );
          })}
        </article>

        <div className="line"></div>
      </section>

      <section className="main-description">
        <p className="description-heading">How to get started</p>

        <section className="description-flex">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/watch?v=jhFDyDgMVUI"
            title="Website Tutorial"
          ></iframe>

          <ul className="description-points">
            <li>1. Short and Concise blogs</li>
            <li>2. Increased Accessibility</li>
            <li>3. Focus on Key Information</li>
            <li>4. Time-Efficient Content</li>
          </ul>
        </section>
      </section>

      <footer className="main-message">
        <ul className="main-message-flex">
          <li>About</li>
          <li>FAQ</li>
          <li>Help</li>
          <li>Terms</li>
          <li>Privacy</li>
        </ul>
      </footer>
    </main>
  );
}

export default App;
