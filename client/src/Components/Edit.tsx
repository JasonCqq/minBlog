import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../Styling/Create.scss";
import axios from "axios";
import { useGlobalContext } from "./GlobalUser";
import { useParams } from "react-router-dom";

interface PostData {
  title: string;
  text: string;
  category: string;
  [key: string]: string; // Index signature
}

function Edit() {
  const { user } = useGlobalContext();
  const { id } = useParams();

  const [post, setPost] = useState<PostData>({
    title: "",
    text: "",
    category: "",
  });

  // Check if user is logged in and if user has access to edit
  useEffect(() => {
    if (!user) {
      return;
    }
    axios.get(`http://localhost:3000/post/${id}`).then((res) => {
      const data = res.data;
      if (String(data.author_id._id) === String(user?.id)) {
        setPost({
          title: data.title,
          text: data.text,
          category: data.category,
        });
      } else if (String(data.author_id._id) !== String(user?.id)) {
        alert("Forbidden");
      }
    });
  }, [user]);

  useEffect(() => {
    setCharCount(post.text.length);
  }, [post]);

  const [charCount, setCharCount] = useState<number>();

  // Store input values
  function store(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const new_data: PostData = { ...post };
    new_data[e.target.name] = e.target.value;
    setPost(new_data);
    setCharCount(new_data.text.length);
  }

  // Submit form
  function editFormSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (post.title.length < 3 || post.title.length > 50) {
      alert("Title must be 3-50 characters");
      return;
    }
    if (post.text.length < 50 || post.text.length > 1500) {
      alert("Text must be 50-1500 characters");
      return;
    }

    axios
      .put(`http://localhost:3000/post/${id}`, {
        title: post.title,
        text: post.text,
        category: post.category,
      })
      .then((res) => {
        const data = res.data;
        if (data.success === true) {
          window.location.href = `http://localhost:3006/blog/${id}`;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <TransitionGroup>
      <CSSTransition classNames="example" appear={true} timeout={1000}>
        <div className="create-container">
          <h1 className="create-heading">Edit Blog</h1>

          <form className="create-form" onSubmit={(e) => editFormSubmit(e)}>
            <input
              type="text"
              placeholder="Title.. (3-50 characters)"
              className="create-input"
              name="title"
              value={post.title}
              onChange={(e) => store(e)}
              required
            ></input>

            <textarea
              placeholder="Text.. (50-1500 characters)"
              className="text-input create-input"
              id="edit_text_input"
              value={post.text}
              onChange={(e) => store(e)}
              name="text"
              required
            ></textarea>

            <div>
              <label htmlFor="category">Category: </label>
              <input
                type="text"
                placeholder="Category..."
                className="category-input"
                value={post.category}
                onChange={(e) => store(e)}
                required
                name="category"
              ></input>
            </div>

            <p>{charCount} characters in text</p>
            <button type="submit" className="create-button">
              Finish
            </button>
          </form>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default Edit;
