import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    getProfile(token).then(setProfile);
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {profile.username}</h2>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default Profile;
