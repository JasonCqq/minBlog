import React, { ChangeEvent, FormEvent, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../Styling/Create.scss";
import axios from "axios";
import { useGlobalContext } from "./GlobalUser";

interface PostData {
  title: string;
  text: string;
  category: string;
  [key: string]: string; // Index signature
}

function Create() {
  const { user } = useGlobalContext();

  const [post, setPost] = useState<PostData>({
    title: "",
    text: "",
    category: "",
  });

  const [charCount, setCharCount] = useState<number>();

  // Store input values
  function store(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const new_data: PostData = { ...post };
    new_data[e.target.name] = e.target.value;
    setPost(new_data);
    setCharCount(new_data.text.length);
  }

  // Submit form
  function formSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (post.title.length < 3 || post.title.length > 50) {
      return;
    }
    if (post.text.length < 50 || post.text.length > 1500) {
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BACK_END}/post/create`, {
        title: post.title,
        text: post.text,
        category: post.category,
        author_id: user?.id,
        published: post.published,
      })
      .then((res) => {
        const data = res.data;
        if (data.success === true) {
          window.location.href = `${process.env.REACT_APP_FRONT_END}/blog/${data.id}`;
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
          <h1 className="create-heading">Create a Blog</h1>

          <form className="create-form" onSubmit={(e) => formSubmit(e)}>
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
              className="create-input"
              id="text_input"
              value={post.text}
              onChange={(e) => store(e)}
              name="text"
              required
            ></textarea>

            <div>
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

            {charCount && charCount > 1500 ? (
              <p style={{ color: "red" }}>{charCount} characters in text</p>
            ) : (
              <p>{charCount} characters in text</p>
            )}
            <button type="submit" className="create-button">
              Publish
            </button>
          </form>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default Create;
