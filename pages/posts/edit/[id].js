import React, { useState } from "react";
import { authPage } from "../../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../../components/Nav";

export async function getServerSideProps(ctx) {
  const auth = authPage(ctx);

  if (auth.token) {
    const { token } = auth;
    const { id } = ctx.query;

    const postReq = await fetch(
      "http://localhost:3000/api/posts/detail/" + id,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );

    const res = await postReq.json();

    return {
      props: {
        token,
        post: res.data,
      },
    };
  } else {
    return auth;
  }
}

export default function PostsEdit(props) {
  const { post } = props;

  const [fields, setFields] = useState({
    title: post.title,
    content: post.content,
  });

  function handlerFields(e) {
    const name = e.target.getAttribute("name");
    const value = e.target.value;

    setFields({
      ...fields,
      [name]: value,
    });
  }

  const [status, setStatus] = useState("normal");

  async function updateHandler(e) {
    e.preventDefault();
    setStatus("loading");

    const { token } = props;

    const update = await fetch("/api/posts/update/" + post.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(fields),
    });

    if (!update.ok) return setStatus("error");

    const res = await update.json();

    setStatus("success");

    Router.push("/posts");
  }

  return (
    <div>
      <h1>Update a Post</h1>
      <Nav />
      <p>Post ID: {post.id}</p>

      <form onSubmit={updateHandler.bind(this)}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handlerFields.bind(this)}
          defaultValue={post.title}
        />
        <br />
        <textarea
          type="text"
          placeholder="Content"
          name="content"
          onChange={handlerFields.bind(this)}
          defaultValue={post.content}
        ></textarea>
        <br />

        <button type="submit">Update Post</button>

        <div>Status: {status}</div>
      </form>
    </div>
  );
}
