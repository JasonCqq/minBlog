import React from "react";
import axios from "axios";

// Open Author's Email
export function openMail(email: string) {
  window.open(`mailto:${email}`);
}

export function deletePost(id: string, userId: string) {
  if (!id) {
    return;
  }

  axios.delete(`http://localhost:3000/post/${id}`).then((res) => {
    const data = res.data;
    data.error ? alert(data.error) : alert(data.message);
    window.location.href = `http://localhost:3006/profile/${userId}`;
  });
}
