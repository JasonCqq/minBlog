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
  const [documentCount, setDocumentCount] = useState<number>();
  const [pagesCount, setPagesCount] = useState<number[]>();

  //Get 9 blogs.
  useEffect(() => {
    axios.get("http://localhost:3000/api/posts/9").then((res) => {
      const data = res.data;
      if (data) {
        setPosts(data.posts);
        setDocumentCount(data.docCount);
      }
    });
  }, []);

  useEffect(() => {
    if (!documentCount) {
      return;
    }

    let pages = documentCount / 9;
    let pagesArr = [];

    if (documentCount % 9 === 0) {
      for (let i = 1; i <= pages; i++) {
        pagesArr.push(i);
      }
      setPagesCount(pagesArr);
    } else if (documentCount % 9 !== 0) {
      for (let i = 1; i <= pages + 1; i++) {
        pagesArr.push(i);
      }
      setPagesCount(pagesArr);
    }
  }, [documentCount]);

  return (
    <div className="forum-container">
      <header className="forum-header">
        <p className="forum-heading">All Blogs</p>
        <Link to="/" className="forum-create">
          Create a Blog
        </Link>
      </header>
      <div className="forum-flex">
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
        </section>

        <form className="filter-form">
          <h2 className="filter-header">Search</h2>
          <input placeholder="Search" className="filter-search"></input>

          <div style={{ display: "flex", gap: "3px" }}>
            <label htmlFor="search-title">Title</label>
            <input type="radio" name="search-title"></input>

            <label htmlFor="search-author">Author</label>
            <input type="radio" name="search-author"></input>

            <label htmlFor="search-tag">Tag</label>
            <input type="radio" name="search-tag"></input>
          </div>

          <h2 className="filter-header">Sort</h2>

          <div style={{ display: "flex", gap: "3px" }}>
            <label htmlFor="sort-title">Title</label>
            <input type="radio" name="sort-title"></input>

            <label htmlFor="sort-author">Author</label>
            <input type="radio" name="sort-author"></input>

            <label htmlFor="sort-tag">Tag</label>
            <input type="radio" name="sort-tag"></input>

            <label htmlFor="sort-date">Date</label>
            <input type="radio" name="sort-date"></input>
          </div>

          <div className="line"></div>

          <div style={{ display: "flex", gap: "3px" }}>
            <label htmlFor="sort-des">Ascending</label>
            <input type="radio" name="sort-des"></input>

            <label htmlFor="sort-asc">Descending</label>
            <input type="radio" name="sort-asc"></input>
          </div>

          <div>
            <button className="search-button clear-button">Search</button>
            <button className="clear-button">Clear Filters</button>
          </div>
        </form>
      </div>

      <div>
        <ol>
          {pagesCount?.map((page) => {
            return <li key={uniqid()}>{page}</li>;
          })}
        </ol>

        <p> {documentCount} Blogs available</p>
      </div>
    </div>
  );
}

export default Blogs;
