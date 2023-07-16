import axios from "axios";

// Open Author's Email
export function openMail(email: string) {
  window.open(`mailto:${email}`);
}

// Delete Post, pass in post id and user id
export function deletePost(id: string, userId: string) {
  if (!id) {
    return;
  }

  axios.delete(`${process.env.REACT_APP_BACK_END}/post/${id}`).then((res) => {
    const data = res.data;
    data.error ? alert(data.error) : alert(data.message);
    window.location.href = `${process.env.REACT_APP_FRONT_END}/profile/${userId}`;
  });
}
