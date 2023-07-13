import React, { useEffect, useState } from "react";
import "../Styling/Profile.scss";
import { useParams } from "react-router-dom";
import { useGlobalContext } from "./GlobalUser";
import axios from "axios";

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

  return (
    <div className="profile-container" onClick={() => console.log(profile)}>
      Profile Tab.
    </div>
  );
}

export default Profile;
