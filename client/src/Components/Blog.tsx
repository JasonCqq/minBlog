import React, { FormEvent, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import axios from "axios";
import "../Styling/Blog.scss";
import { useGlobalContext } from "./GlobalUser";
import { IoMdArrowDropdown } from "react-icons/io";
import uniqid from "uniqid";

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

  // Get blog off id
  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`http://localhost:3000/post/${id}`)
      .then((res) => {
        const data = res.data;
        setPost(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }

    const bookmarks = user.bookmarks ?? [];
    const bookmarksSet = new Set(bookmarks);
    bookmarksSet.has(String(id)) ? setBookmarked(true) : setBookmarked(false);
  }, []);

  // Fetch comments on drop
  useEffect(() => {
    if (drop === true && comments.length === 0) {
      axios
        .get(`http://localhost:3000/api/comments/${id}`)
        .then((res) => {
          const data = res.data;
          setComments(data.comments);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [drop]);

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

    axios.post("http://localhost:3000/post/comment", {
      text: t.value,
      user: user?.id,
      blog_id: id,
    });
  }

  // Open Author's Email
  function openMail() {
    if (!post) {
      return;
    }
    window.open(`mailto:${post.author_id.email}`);
  }

  function bookmarkPost() {
    if (!post) {
      return;
    }

    if (bookmarked) {
      axios.delete(`http://localhost:3000/user/bookmark/${id}`, {
        withCredentials: true,
      });
      setBookmarked(false);
    } else if (!bookmarked) {
      axios.put(`http://localhost:3000/user/bookmark/${id}`, {
        withCredentials: true,
      });
      setBookmarked(true);
    }
  }

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="blog-container">
          <div className="blog-left">
            <div className="blog-text">
              <h1 className="blog-title">{post?.title}</h1>
              <p className="blog-content">{post?.text}</p>
            </div>

            <div className="blog-comments">
              <header
                className="blog-comments-heading"
                onClick={() => setDrop(true)}
              >
                <h2>Comments</h2>
                <IoMdArrowDropdown size={30} />
              </header>

              {comments && drop
                ? comments.map((comm) => {
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
                : null}
            </div>
          </div>
          <div className="blog-right">
            <ul className="blog-desc">
              <li onClick={() => console.log(comments)}>
                Category: {post?.category}
              </li>
              <li>Published: {newDate(post?.timestamp || "")}</li>
              <li>Article By: {post?.author_id.username}</li>
              <Link to={`/profile/${post?.author_id._id}`}>
                View Author Profile
              </Link>
              <li style={{ cursor: "pointer" }} onClick={() => openMail()}>
                Contact Author
              </li>
              {user ? (
                <>
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

                  {/* <li>Delete Post</li>
                  <li>Private Post</li>
                  <li>Edit Post</li> */}

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
                </>
              ) : (
                <li>Log in to comment/bookmark.</li>
              )}
            </ul>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}
export default Blog;
