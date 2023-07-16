import "../Styling/Blogs.scss";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import uniqid from "uniqid";
import { BiArrowToLeft, BiArrowToRight } from "react-icons/bi";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
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
      `${process.env.REACT_APP_FRONT_END}/blogs${currentURL.search}`
    );

    axios
      .get(`${process.env.REACT_APP_BACK_END}/api/blogs${currentURL.search}`)
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
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = String(queryParams.get("query"));
    const pageQuery = Number(queryParams.get("p"));
    const queryValue = String(queryParams.get("queryBy"));
    const sortOrder = String(queryParams.get("sortOrder"));
    const sortValue = String(queryParams.get("sortBy"));
    let newLink = `${process.env.REACT_APP_BACK_END}/api/blogs?p=${pageQuery}`;

    // Attach parameters
    if (searchQuery !== null) {
      newLink += `&query=${searchQuery}&queryBy=${queryValue}`;
      const q = document.getElementById("query") as HTMLInputElement;
      q.value = searchQuery;
    }

    if (sortOrder !== null) {
      newLink += `&sortBy=${sortValue}&sortOrder=${sortOrder}`;
    } else if (sortOrder === null) {
      newLink += `&sortBy=timestamp&sortOrder=desc`;
    }

    axios.get(`${newLink}`).then((res) => {
      const data = res.data;
      if (data) {
        setPosts(data.blogs);
        setDocumentCount(data.docCount);
      }
    });
  }, []);

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
      alert("Please input a query or select what you want to search by");
      return;
    }

    // If one of sort values is empty
    if (
      (search.sort_order && !search.sort_value) ||
      (!search.sort_order && search.sort_value)
    ) {
      alert("Please select a query or select what you want to search by");
      return;
    }

    let newLink = `${process.env.REACT_APP_FRONT_END}/blogs?p=0`;

    // Attach parameters
    if (search.query && search.query_value) {
      newLink += `&query=${search.query}&queryBy=${search.query_value}`;
    }

    if (search.sort_order && search.sort_value) {
      newLink += `&sortBy=${search.sort_value}&sortOrder=${search.sort_order}`;
    }

    // Remove trailing &
    if (newLink.endsWith("&")) {
      newLink = newLink.slice(0, -1);
    }

    window.location.href = newLink;
  }

  // Store filter inputs
  function handleFilters(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value,
    }));
  }

  function toggleForm() {
    const form = document.querySelector("form.filter-form");
    form?.classList.toggle("show-filter-form");
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
                const formattedDate = new Date(
                  post.timestamp
                ).toLocaleDateString();
                return (
                  <Link to={`/blog/${post._id}`} key={uniqid()}>
                    <div className="forum-item">
                      <div className="forum-flex">
                        <p className="forum-item-date">{formattedDate} </p>
                        <p className="forum-item-category">{post.category}</p>
                      </div>

                      <h2 className="forum-item-title">{post.title}</h2>

                      <div className="forum-flex">
                        <p>{Math.ceil(post.text.length / 25)}s Read </p>
                        <p className="forum-item-author">
                          By {post.author.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </section>

            <HiMiniMagnifyingGlass
              size={35}
              style={{
                cursor: "pointer",
              }}
              onClick={() => toggleForm()}
            />

            <form className="filter-form" onSubmit={(e) => filterSubmit(e)}>
              <h2 className="filter-header">Search</h2>
              <input
                aria-label="Search bar"
                placeholder="Search"
                className="filter-search"
                name="query"
                onChange={(e) => handleFilters(e)}
                id="query"
              ></input>

              <div style={{ display: "flex", gap: "3px" }}>
                <label htmlFor="query_value">Title</label>
                <input
                  aria-label="Filter by title"
                  type="radio"
                  name="query_value"
                  value="title"
                  checked={search.query_value === "title"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="query_value">Author</label>
                <input
                  aria-label="Filter by author"
                  type="radio"
                  name="query_value"
                  value="author"
                  checked={search.query_value === "author"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="query_value">Tag</label>
                <input
                  aria-label="Filter by Category"
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
                  aria-label="Sort by title"
                  type="radio"
                  name="sort_value"
                  value="title"
                  checked={search.sort_value === "title"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_value">Author</label>
                <input
                  aria-label="Sort by author"
                  type="radio"
                  name="sort_value"
                  value="author"
                  checked={search.sort_value === "author"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_value">Tag</label>
                <input
                  aria-label="Sort by Category"
                  type="radio"
                  name="sort_value"
                  value="tag"
                  checked={search.sort_value === "tag"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_value">Date</label>
                <input
                  aria-label="Sort by Date"
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
                  aria-label="Sort order, ascending"
                  type="radio"
                  name="sort_order"
                  value="asc"
                  checked={search.sort_order === "asc"}
                  onChange={(e) => handleFilters(e)}
                ></input>

                <label htmlFor="sort_order">Descending</label>
                <input
                  aria-label="Sort order, descending"
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
                  Clear
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
