import "../Styling/Blogs.scss";
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import uniqid from "uniqid";
import { GrFormNextLink } from "react-icons/gr";
import { BiArrowBack } from "react-icons/bi";

interface Post {
  title: string;
  category: string;
  author_id: {
    username: string;
  };
  timestamp: string;
}

function Blogs() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageQuery = queryParams.get("p");

  const [posts, setPosts] = useState<Post[]>([]);
  const [documentCount, setDocumentCount] = useState<number>();
  const [pagesCount, setPagesCount] = useState<number[]>();
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    setPage(Number(pageQuery));
  }, []);

  //Get 9 blogs.
  useEffect(() => {
    axios.get(`http://localhost:3000/api/blogs/?p=${page}`).then((res) => {
      const data = res.data;
      if (data) {
        setPosts(data.blogs);
        setDocumentCount(data.docCount);
      }
    });
  }, [page]);

  useEffect(() => {
    if (!documentCount) {
      return;
    }

    const pageCount = Math.ceil(documentCount / 9);
    const pagesArr = Array.from({ length: pageCount }, (_, index) => index);
    setPagesCount(pagesArr);
  }, [documentCount]);

  return (
    <div className="forum-container">
      <header className="forum-header">
        <div>
          <p className="forum-heading">All Blogs</p>
          <p className="forum-docs"> ({documentCount} Blogs available)</p>
        </div>
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
            <label htmlFor="search">Title</label>
            <input type="radio" name="search"></input>

            <label htmlFor="search">Author</label>
            <input type="radio" name="search"></input>

            <label htmlFor="search">Tag</label>
            <input type="radio" name="search"></input>
          </div>

          <h2 className="filter-header">Sort</h2>

          <div style={{ display: "flex", gap: "3px" }}>
            <label htmlFor="sort">Title</label>
            <input type="radio" name="sort"></input>

            <label htmlFor="sort">Author</label>
            <input type="radio" name="sort"></input>

            <label htmlFor="sort">Tag</label>
            <input type="radio" name="sort"></input>

            <label htmlFor="sort">Date</label>
            <input type="radio" name="sort"></input>
          </div>

          <div className="line"></div>

          <div style={{ display: "flex", gap: "3px" }}>
            <label htmlFor="sort-order">Ascending</label>
            <input type="radio" name="sort-order"></input>

            <label htmlFor="sort-order">Descending</label>
            <input type="radio" name="sort-order"></input>
          </div>

          <div>
            <button className="search-button clear-button">Search</button>
            <button className="clear-button">Clear Filters</button>
          </div>
        </form>
      </div>

      <div>
        <ol className="forum-pages">
          {Number(page) === 0 ? null : (
            <BiArrowBack
              size={20}
              onClick={() => setPage(page - 1)}
              className="page-arrow"
            />
          )}
          {pagesCount?.map((p) => {
            return (
              <Link
                to={`/blogs?p=${p}`}
                className={`page ${p === page ? "activePage" : ""}`}
                key={uniqid()}
                onClick={() => setPage(p)}
              >
                {p}
              </Link>
            );
          })}

          {Number(pagesCount?.length) === Number(page + 1) ? null : (
            <GrFormNextLink
              size={25}
              onClick={() => setPage(page + 1)}
              className="page-arrow"
            />
          )}
        </ol>
      </div>
    </div>
  );
}

export default Blogs;
