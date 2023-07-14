import React, { useEffect, useState } from "react";
import "../Styling/Profile.scss";
import { useParams, Link } from "react-router-dom";
import { useGlobalContext } from "./GlobalUser";
import axios from "axios";
import { FiMail } from "react-icons/fi";
import uniqid from "uniqid";
import { deletePost } from "./UtilFunctions";

interface ProfileData {
  id: string;
  full_name: string;
  username: string;
  email: string;
  blogs: Array<BlogData>;
  bookmarks: Array<BlogData>;
}

interface BlogData {
  title: string;
  text: string;
  category: string;
  timestamp: Date;
  author_id: {
    username: string;
  };
  _id: string;
}

function Profile() {
  const { id } = useParams();
  const { user } = useGlobalContext();
  // Profile + Blog Data
  const [profile, setProfile] = useState<ProfileData>();
  const [blogs, setBlogs] = useState<BlogData[]>([]);

  const [tab, setTab] = useState<string>();

  // Get Profile Data
  useEffect(() => {
    axios.get(`http://localhost:3000/user/${id}`).then((res) => {
      const data = res.data;
      setProfile(data);
      setBlogs(data.blogs);
      setTab("home");
    });
  }, []);

  // Open Author's Email
  function openMail() {
    window.open(`mailto:${profile?.email}`);
  }

  useEffect(() => {
    if (!profile) {
      return;
    }

    const home = document.getElementById("home_tab");
    const bookmarks = document.getElementById("bookmarks_tab");
    console.log(profile);

    // Switch data between Home and Bookmarks Tab
    if (tab === "home") {
      setBlogs([...profile?.blogs]);
      home?.classList.add("active");
      bookmarks?.classList.remove("active");
    } else if (tab === "bookmarks") {
      setBlogs([...profile?.bookmarks]);
      bookmarks?.classList.add("active");
      home?.classList.remove("active");
    }
  }, [tab, profile]);

  return (
    <div className="profile-container">
      <div className="profile-left">
        <h1 className="profile-username">{profile?.username}</h1>

        <div className="profile-flex">
          <p id="home_tab" onClick={() => setTab("home")}>
            Home
          </p>
          <p id="bookmarks_tab" onClick={() => setTab("bookmarks")}>
            Bookmarks
          </p>
        </div>

        <div className="profile-blogs">
          {blogs && blogs.length > 0 ? (
            blogs.map((b) => {
              let truncText = b.text;
              if (truncText.length > 100) {
                truncText = truncText.substring(0, 100) + "...";
              }

              const formattedDate = new Date(b.timestamp).toLocaleString();

              return (
                <Link
                  to={`/blog/${b._id}`}
                  className="profile-blog"
                  key={uniqid()}
                >
                  <div className="profile-blog-flex">
                    <p>By {b.author_id.username}</p>
                    <div className="profile-blog-buttons">
                      <Link to={`/edit/${b._id}`} className="edit-button">
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(b._id, user?.id || "")}
                        className="delete-button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="profile-blog-heading">
                    <h1 className="profile-blog-title">{b.title}</h1>
                    <p className="profile-blog-category">{b.category}</p>
                  </div>
                  <p className="profile-blog-text">{truncText}</p>
                  <p className="profile-blog-date">{formattedDate}</p>
                </Link>
              );
            })
          ) : (
            <p>No Blogs Found</p>
          )}
        </div>
      </div>
      <div className="profile-right">
        <p className="profile-full-name">{profile?.full_name}</p>
        <FiMail
          size={30}
          onClick={() => openMail()}
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}

export default Profile;
