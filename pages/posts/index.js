import { useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav";

export default function PostIndex(props) {
  const [posts, setPosts] = useState(props.posts);

  // Walaupun posisi id kedua, tapi event tetap ditarok di belakang
  async function deleteHandler(id, e) {
    e.preventDefault();
    const { token } = props;

    const ask = confirm("Apakah data ini akan dihapus?");

    if (ask) {
      const deletePost = await fetch("/api/posts/delete/" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const res = await deletePost.json();

      const postsFiltered = posts.filter((post) => {
        return post.id !== id && post;
      });

      setPosts(postsFiltered);
    }
  }

  function editHandler(id) {
    Router.push("posts/edit/" + id);
  }

  return (
    <div>
      <h1>Posts</h1>
      <Nav />
      {posts.map((post, i) => (
        <div key={i}>
          <h2> {post.title} </h2>
          <p> {post.content} </p>

          <div>
            <button onClick={editHandler.bind(this, post.id)}>Edit</button>
            <button onClick={deleteHandler.bind(this, post.id)}>Delete</button>
          </div>

          <hr />
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const auth = authPage(ctx);

  if (auth.token) {
    const postReq = await fetch("http://localhost:3000/api/posts/get", {
      headers: {
        Authorization: "Bearer " + auth.token,
      },
    });

    const posts = await postReq.json();

    return { props: { posts: posts.data, token: auth.token } };
  }

  return { ...auth, props: { title: "My Title" } };
}
