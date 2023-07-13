import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import axios from "axios";
import "../Styling/Blog.scss";
import { useGlobalContext } from "./GlobalUser";
import { IoMdArrowDropdown } from "react-icons/io";

interface PostData {
  id: string;
  title: string;
  text: string;
  category: string;
  author_id: string;
  author_username: string;
  timestamp: string;
}

function Blog() {
  const { id } = useParams();
  const { user } = useGlobalContext();
  const [post, setPost] = useState<PostData>();

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
    console.log(post);
  }, [post]);

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
              <h2 className="blog-comments-heading">Comments</h2>
              <IoMdArrowDropdown size={30} />
            </div>
          </div>
          <div className="blog-right">
            <ul className="blog-desc">
              <li>Category: {post?.category}</li>
              <li>Published: {post?.timestamp}</li>
              <li>Article By: {post?.author_username}</li>
              <li>Author Profile</li>
              <li>Contact Author</li>
              {user ? (
                <>
                  <li>Bookmark Post</li>
                  <li>Delete Post</li>
                  <li>Private Post</li>
                  <li>Edit Post</li>
                </>
              ) : (
                <li>Log in to bookmark.</li>
              )}
            </ul>
          </div>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}
export default Blog;
