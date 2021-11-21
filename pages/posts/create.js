import React, { useState } from "react";
import { authPage } from "../../middlewares/authorizationPage";
import Router from "next/router";
import Nav from "../../components/Nav";

export async function getServerSideProps(ctx) {
  const auth = authPage(ctx);

  if (auth.token) {
    return {
      props: {
        token: auth.token,
      },
    };
  }

  return auth;
}

export default function PostsCreate(props) {
  const [fields, setFields] = useState({
    title: "",
    content: "",
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

  async function createHandler(e) {
    e.preventDefault();
    setStatus("loading");

    const { token } = props;

    const create = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(fields),
    });

    if (!create.ok) return setStatus("error");

    const res = await create.json();

    setStatus("success");

    Router.push("/posts");
  }

  return (
    <div>
      <h1>Create a Post</h1>
      <Nav />
      <br />

      <form onSubmit={createHandler.bind(this)}>
        <input
          type="text"
          placeholder="Title"
          name="title"
          onChange={handlerFields.bind(this)}
        />
        <br />
        <textarea
          type="text"
          placeholder="Content"
          name="content"
          onChange={handlerFields.bind(this)}
        ></textarea>
        <br />

        <button type="submit">Create Post</button>

        <div>Status: {status}</div>
      </form>
    </div>
  );
}
