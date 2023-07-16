import React, { FormEvent, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import axios from "axios";
import "../Styling/Blog.scss";
import { useGlobalContext } from "./GlobalUser";
import { IoMdArrowDropdown } from "react-icons/io";
import uniqid from "uniqid";
import { openMail, deletePost } from "./UtilFunctions";

interface PostData {
  id: string;
  title: string;
  text: string;
  category: string;
  author_id: {
    email: string;
    username: string;
    _id: string;
  };
  timestamp: string;
}

interface CommentsData {
  blog_id: string;
  user: {
    username: string;
    _id: string;
  };
  text: string;
  timestamp: Date;
}

function Blog() {
  const { id } = useParams();
  const { user } = useGlobalContext();

  const [post, setPost] = useState<PostData>();
  const [comments, setComments] = useState<CommentsData[]>([]);
  const [bookmarked, setBookmarked] = useState<boolean>();

  const [drop, setDrop] = useState<boolean>(false);

  const [bionicReadMode, setBionicReadMode] = useState<boolean>(false);

  // Get blog information off id
  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`${process.env.REACT_APP_BACK_END}/post/${id}`)
      .then((res) => {
        const data = res.data;
        setPost(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  // Check if post already bookmarked.
  useEffect(() => {
    if (!user) {
      return;
    }

    const bookmarks = user.bookmarks ?? [];
    const bookmarksSet = new Set(bookmarks);
    bookmarksSet.has(String(id)) ? setBookmarked(true) : setBookmarked(false);
  }, [user, id]);

  // Fetch comments on click
  useEffect(() => {
    if (drop === true && comments.length === 0) {
      axios
        .get(`${process.env.REACT_APP_BACK_END}/api/comments/${id}`)
        .then((res) => {
          const data = res.data;
          setComments(data.comments);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [drop, id, comments]);

  function newDate(date: string) {
    const formattedDate = new Date(date).toDateString();
    return formattedDate;
  }

  // Submit Comments
  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const t = document.getElementById("comment_text") as HTMLTextAreaElement;
    if (t.value.length < 3 || t.value.length > 100) {
      return;
    }

    axios.post(`${process.env.REACT_APP_BACK_END}/post/comment`, {
      text: t.value,
      user: user?.id,
      blog_id: id,
    });

    setCommentSubmission(true);
  }

  function bookmarkPost() {
    if (!post) {
      return;
    }

    if (bookmarked) {
      axios.delete(`${process.env.REACT_APP_BACK_END}/user/bookmark/${id}`, {
        withCredentials: true,
      });
      setBookmarked(false);
    } else if (!bookmarked) {
      axios.put(`${process.env.REACT_APP_BACK_END}/user/bookmark/${id}`, {
        withCredentials: true,
      });
      setBookmarked(true);
    }
  }

  // Bionic Reading Toggle
  useEffect(() => {
    applyBionicReading();
  }, [bionicReadMode]);

  function applyBionicReading() {
    const text = document.getElementById("blog-content");
    if (!text) {
      return;
    }
    if (bionicReadMode === true) {
      const new_text = text.innerText;
      const highlightedText = highlightText(new_text);
      text.innerHTML = highlightedText;
    } else {
      text.innerHTML = post?.text || "";
    }
  }
  function highlightText(text: string) {
    const words = text.split(" ");
    const highlightedWords = words.map(function (word) {
      if (word.length > 2) {
        return (
          "<b>" +
          word.charAt(0) +
          word.slice(1, Math.floor(word.length / 2)) +
          "</b>" +
          word.slice(Math.floor(word.length / 2), word.length)
        );
      } else {
        return "<b>" + word.charAt(0) + "</b>" + word.charAt(1);
      }
    });

    return highlightedWords.join(" ");
  }

  // Toggle Hamburger Menu
  function toggleMenu() {
    const menu = document.querySelector("ul.menu");
    const ham_menu = document.querySelector("div.hamburger-menu");
    menu?.classList.toggle("show-menu");
    ham_menu?.classList.toggle("cross-menu");
  }

  // Remove special coded characters
  function decode(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  // Verify if user has commented
  const [commentSubmission, setCommentSubmission] = useState<boolean>(false);

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="blog-container">
          <div className="blog-left">
            <div className="blog-text">
              <h1 className="blog-title">{decode(post?.title || "")}</h1>
              <p id="blog-content">{decode(post?.text || "")}</p>
            </div>

            <div className="blog-comments">
              <header
                className="blog-comments-heading"
                onClick={() => setDrop(true)}
              >
                <h2>Comments</h2>
                <IoMdArrowDropdown size={30} />
              </header>

              {comments && drop ? (
                comments.length === 0 ? (
                  <p>No comments on this blog yet...</p>
                ) : (
                  comments.map((comm) => {
                    const formatDate = new Date(comm.timestamp).toDateString();

                    return (
                      <div key={uniqid()} className="blog-comm">
                        <div className="blog-comm-flex">
                          <Link
                            to={`/profile/${comm.user._id}`}
                            className="blog-comm-user"
                          >
                            {comm.user.username}
                          </Link>
                          <p className="blog-comm-date">{String(formatDate)}</p>
                        </div>

                        <p className="blog-comm-text">{comm.text}</p>
                      </div>
                    );
                  })
                )
              ) : null}
            </div>
          </div>
          <div className="blog-right">
            <div className="hamburger-menu" onClick={() => toggleMenu()}>
              {" "}
              <div className="burger-line"></div>
              <div className="burger-line"></div>
              <div className="burger-line"></div>
            </div>

            <ul className="menu">
              <li>Category: {post?.category}</li>
              <li>Published: {newDate(post?.timestamp || "")}</li>
              <li>Article By: {post?.author_id.username}</li>
              <Link to={`/profile/${post?.author_id._id}`}>
                View Author Profile
              </Link>
              <li
                style={{ cursor: "pointer" }}
                onClick={() => openMail(post?.author_id.email || "")}
              >
                Contact Author
              </li>
              {user ? (
                <>
                  {user.id === post?.author_id._id ? (
                    <>
                      {" "}
                      <li
                        style={{ cursor: "pointer" }}
                        onClick={() => deletePost(post.id, user.id || "")}
                      >
                        Delete Post
                      </li>
                      <li>
                        <Link to={`/edit/${post.id}`}>Edit Post</Link>
                      </li>
                    </>
                  ) : null}

                  {bookmarked ? (
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => bookmarkPost()}
                    >
                      Unbookmark Post
                    </li>
                  ) : (
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => bookmarkPost()}
                    >
                      Bookmark Post
                    </li>
                  )}
                  {commentSubmission ? null : (
                    <form
                      className="comment-form"
                      onSubmit={(e) => formSubmit(e)}
                    >
                      <h2>Comment</h2>

                      <textarea
                        className="comment-area"
                        placeholder="Comment.. (3-100 characters)"
                        name="text"
                        id="comment_text"
                      ></textarea>
                      <button className="comment-button" type="submit">
                        Submit
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <li>Log in to comment/bookmark.</li>
              )}

              <div
                className="bionic-reading"
                onClick={() => setBionicReadMode(!bionicReadMode)}
              >
                Turn on Fast Read
              </div>
            </ul>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}
export default Blog;
