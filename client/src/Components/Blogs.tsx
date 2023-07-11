import "../Styling/Blogs.scss";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import uniqid from "uniqid";

interface Post {
  title: string;
  category: string;
  author_id: {
    username: string;
  };
  timestamp: string;
}

function Blogs() {
  const [posts, setPosts] = useState<Post[]>([]);

  //Get 9 blogs.
  useEffect(() => {
    fetch("http://localhost:3000/api/posts/9")
      .then((res) => res.json())
      .then((dat) => setPosts(dat))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="forum-container">
      <header className="forum-header">
        <p className="forum-heading">All Blogs</p>
        <Link to="/" className="forum-create">
          Create a Blog
        </Link>
      </header>

      <section className="forum-grid">
        {posts.map((post) => {
          const formattedDate = new Date(post.timestamp).toDateString();
          return (
            <div className="forum-item" key={uniqid()}>
              <div className="forum-flex">
                <p className="forum-item-date">{formattedDate} </p>
                <p className="forum-item-category">{post.category}</p>
              </div>

              <h2 className="forum-item-title">{post.title}</h2>

              <div className="forum-flex">
                <p>2 min read · </p>
                <p className="forum-item-author">
                  By {post.author_id.username}
                </p>
              </div>
            </div>
          );
        })}

        <button>Randomize</button>
        <form>
          <h2>Filter</h2>
          <input placeholder="Search"></input>

          <label htmlFor="search-title">Title</label>
          <input type="radio" name="search-title"></input>

          <label htmlFor="search-author">Author</label>
          <input type="radio" name="search-author"></input>

          <label htmlFor="search-tag">Tag</label>
          <input type="radio" name="search-tag"></input>

          <h2>Sort</h2>

          <label htmlFor="sort-title">Title</label>
          <input type="radio" name="sort-title"></input>

          <label htmlFor="sort-author">Author</label>
          <input type="radio" name="sort-author"></input>

          <label htmlFor="sort-tag">Tag</label>
          <input type="radio" name="sort-tag"></input>

          <label htmlFor="sort-date">Date</label>
          <input type="radio" name="sort-date"></input>

          <div className="line"></div>

          <label htmlFor="sort-asc">Descending</label>
          <input type="radio" name="sort-asc"></input>

          <label htmlFor="sort-des">Ascending</label>
          <input type="radio" name="sort-des"></input>

          <button>Clear filter</button>
        </form>
      </section>
    </div>
  );
}

export default Blogs;
