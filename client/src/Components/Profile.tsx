import React, { useEffect, useState } from "react";
import "../Styling/Profile.scss";
import { useParams, Link } from "react-router-dom";
import { useGlobalContext } from "./GlobalUser";
import axios from "axios";
import { FiMail } from "react-icons/fi";
import uniqid from "uniqid";

interface ProfileData {
  id: string;
  full_name: string;
  username: string;
  email: string;
  blogs: Array<BlogData>;
}

interface BlogData {
  title: string;
  text: string;
  category: string;
  timestamp: Date;
  _id: string;
}

function Profile() {
  const { id } = useParams();
  const { user } = useGlobalContext();

  const [profile, setProfile] = useState<ProfileData>();

  useEffect(() => {
    axios.get(`http://localhost:3000/user/${id}`).then((res) => {
      const data = res.data;
      setProfile(data);
    });
  }, []);

  //   Open Author's Email
  function openMail() {
    window.open(`mailto:${profile?.email}`);
  }

  return (
    <div className="profile-container">
      <div className="profile-left">
        <h1 className="profile-username">{profile?.username}</h1>

        <div className="profile-flex">
          <p style={{ paddingBottom: "10px" }}>Home</p>
          <p style={{ paddingBottom: "10px" }}>Bookmarks</p>
        </div>

        <div className="profile-blogs">
          {profile?.blogs.map((b) => {
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
                <p>By {profile.full_name}</p>
                <div className="profile-blog-flex">
                  <h1 className="profile-blog-title">{b.title}</h1>
                  <p className="profile-blog-category">{b.category}</p>
                </div>
                <p className="profile-blog-text">{truncText}</p>
                <p className="profile-blog-date">{formattedDate}</p>
              </Link>
            );
          })}
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
