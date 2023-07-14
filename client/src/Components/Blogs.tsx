import "../Styling/Blogs.scss";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import uniqid from "uniqid";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { useGlobalContext } from "./GlobalUser";
import { TransitionGroup, CSSTransition } from "react-transition-group";

interface Post {
  _id: string;
  title: string;
  category: string;
  author_id: string;
  text: string;
  author: {
    username: string;
  };
  timestamp: string;
}

function Blogs() {
  const { user } = useGlobalContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [documentCount, setDocumentCount] = useState<number>();
  const [pagesCount, setPagesCount] = useState<number[]>();
  const [page, setPage] = useState<number>(0);

  // Search Filter States
  const [search, setSearch] = useState({
    query: "",
    query_value: "",
    sort_value: "",
    sort_order: "",
  });

  // Update when page changes
  useEffect(() => {
    let currentURL = new URL(window.location.href);
    let searchParams = new URLSearchParams(currentURL.search);
    searchParams.set("p", `${page}`);
    currentURL.search = searchParams.toString();

    window.history.pushState({}, "", window.location.href);
    window.history.replaceState(
      {},
      "",
      `http://localhost:3006/blogs${currentURL.search}`
    );

    axios
      .get(`http://localhost:3000/api/blogs${currentURL.search}`)
      .then((res) => {
        const data = res.data;
        if (data) {
          setPosts([]);
          setPosts(data.blogs);
          setDocumentCount(data.docCount);
        }
      });
  }, [page]);

  // Update page count
  useEffect(() => {
    if (!documentCount) {
      return;
    }

    const pageCount = Math.ceil(documentCount / 9);
    const pagesArr = Array.from({ length: pageCount }, (_, index) => index);
    setPagesCount(pagesArr);
  }, [documentCount]);

  // Fetch URL based on filter
  const queryParams = new URLSearchParams(window.location.search);
  const searchQuery = queryParams.get("query");
  useEffect(() => {
    if (queryParams && searchQuery) {
      const pageQuery = Number(queryParams.get("p"));
      const queryValue = queryParams.get("queryBy");
      const sortOrder = queryParams.get("sortOrder");
      const sortValue = queryParams.get("sortBy");

      let newLink = `http://localhost:3000/api/blogs?p=${pageQuery}`;

      // Attach parameters
      if (searchQuery) {
        newLink += `&query=${searchQuery}&queryBy=${queryValue}`;
        const q = document.getElementById("query") as HTMLInputElement;
        q.value = searchQuery;
      }

      if (sortOrder) {
        newLink += `&sortBy=${sortValue}&sortOrder=${sortOrder}`;
      }

      axios.get(`${newLink}`).then((res) => {
        const data = res.data;
        if (data) {
          setPosts(data.blogs);
          setDocumentCount(data.docCount);
        }
      });
    } else {
      axios
        .get(`http://localhost:3000/api/blogs?p=0&sortBy=date&sortOrder=desc`)
        .then((res) => {
          const data = res.data;
          if (data) {
            setPosts(data.blogs);
            setDocumentCount(data.docCount);
          }
        });
    }
  }, []);

  // Store fitler inputs
  function handleFilters(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }

  // Submit search filters
  function filterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // If no fields
    if (
      !search.query &&
      !search.query_value &&
      !search.sort_order &&
      !search.sort_value
    ) {
      alert("Search cannot be empty");
      return;
    }

    // If one of search values is empty
    if (
      (search.query && !search.query_value) ||
      (!search.query && search.query_value)
    ) {
      alert("Missing search values");
      return;
    }

    // If one of sort values is empty
    if (
      (search.sort_order && !search.sort_value) ||
      (!search.sort_order && search.sort_value)
    ) {
      alert("Missing sort values");
      return;
    }

    let newLink = "http://localhost:3006/blogs?p=0";

    // Attach parameters
    if (search.query) {
      newLink += `&query=${search.query}&queryBy=${search.query_value}`;
    }

    if (search.sort_order) {
      newLink += `&sortBy=${search.sort_value}&sortOrder=${search.sort_order}`;
    }

    // Remove trailing &
    if (newLink.endsWith("&")) {
      newLink = newLink.slice(0, -1);
    }

    window.location.href = newLink;
  }

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="forum-container">
          <header className="forum-header">
            <div>
              <p className="forum-heading">All Blogs</p>
              <p className="forum-docs"> ({documentCount} Blogs available)</p>
            </div>
            {user ? (
              <Link to="/create" className="forum-create">
                Create a Blog
              </Link>
            ) : (
              <p style={{ marginLeft: "20px", textDecoration: "underline" }}>
                Log in to create a blog!
              </p>
            )}
          </header>
          <div className="forum-flex">
            <section className="forum-grid">
              {posts.map((post) => {
                const formattedDate = new Date(post.timestamp).toDateString();
                return (
                  <Link to={`/blog/${post._id}`} key={uniqid()}>
                    <div className="forum-item">
                      <div className="forum-flex">
                        <p className="forum-item-date">{formattedDate} </p>
                        <p className="forum-item-category">{post.category}</p>
                      </div>

                      <h2 className="forum-item-title">{post.title}</h2>

                      <div className="forum-flex">
                        <p>{Math.ceil(post.text.length / 25)}s Read · </p>
                        <p className="forum-item-author">
                          By {post.author.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>

            <form className="filter-form" onSubmit={(e) => filterSubmit(e)}>
              <h2 className="filter-header">Search</h2>
              <input
                placeholder="Search"
                className="filter-search"
                name="query"
                onChange={(e) => handleFilters(e)}
                id="query"
              ></input>

              <div style={{ display: "flex", gap: "3px" }}>
                <label htmlFor="query_value">Title</label>
                <input
                  type="radio"
                  name="query_value"
                  value="title"
                  checked={search.query_value === "title"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="query_value">Author</label>
                <input
                  type="radio"
                  name="query_value"
                  value="author"
                  checked={search.query_value === "author"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="query_value">Tag</label>
                <input
                  type="radio"
                  name="query_value"
                  value="tag"
                  checked={search.query_value === "tag"}
                  onChange={(e) => handleFilters(e)}
                ></input>
              </div>

              <h2 className="filter-header">Sort</h2>

              <div style={{ display: "flex", gap: "3px" }}>
                <label htmlFor="sort_value">Title</label>
                <input
                  type="radio"
                  name="sort_value"
                  value="title"
                  checked={search.sort_value === "title"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_value">Author</label>
                <input
                  type="radio"
                  name="sort_value"
                  value="author"
                  checked={search.sort_value === "author"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_value">Tag</label>
                <input
                  type="radio"
                  name="sort_value"
                  value="tag"
                  checked={search.sort_value === "tag"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_value">Date</label>
                <input
                  type="radio"
                  name="sort_value"
                  value="timestamp"
                  checked={search.sort_value === "timestamp"}
                  onChange={(e) => handleFilters(e)}
                ></input>
              </div>

              <div className="line"></div>

              <div style={{ display: "flex", gap: "3px" }}>
                <label htmlFor="sort_order">Ascending</label>
                <input
                  type="radio"
                  name="sort_order"
                  value="asc"
                  checked={search.sort_order === "asc"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_order">Descending</label>
                <input
                  type="radio"
                  name="sort_order"
                  value="desc"
                  checked={search.sort_order === "desc"}
                  onChange={(e) => handleFilters(e)}
                ></input>
              </div>

              <div className="filter-buttons">
                <button type="submit" className="search-button clear-button">
                  Search
                </button>
                <a href="/blogs" className="clear-button">
                  Clear Filters
                </a>
              </div>
            </form>
          </div>

          <div>
            <ol className="forum-pages">
              {Number(page) === 0 ? null : (
                <BiArrowToLeft
                  size={25}
                  onClick={() => setPage(page - 1)}
                  className="page-arrow"
                />
              )}
              {pagesCount?.map((p) => {
                return (
                  <button
                    className={`page ${p === page ? "activePage" : ""}`}
                    key={uniqid()}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}

              {Number(pagesCount?.length) === Number(page + 1) ? null : (
                <BiArrowToRight
                  size={25}
                  onClick={() => setPage(page + 1)}
                  className="page-arrow"
                />
              )}
            </ol>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default Blogs;
