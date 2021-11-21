import React, { useState, useEffect } from "react";
import Cookie from "js-cookie";
import Router from "next/router";
import { unauthPage } from "../../middlewares/authorizationPage";
import Link from "next/link";

export async function getServerSideProps(context) {
  const checkLogin = unauthPage(context);

  if (checkLogin) {
    return checkLogin;
  } else {
    return {
      props: {}, // will be passed to the page component as props
    };
  }
}

export default function Login(props) {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  function fieldHandler(e) {
    const name = e.target.getAttribute("name");

    setFields({
      ...fields,
      [name]: e.target.value,
    });
  }

  const [status, setStatus] = useState("normal");

  async function LoginHandler(e) {
    e.preventDefault();
    setStatus("loading");

    const loginReq = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(fields),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!loginReq.ok) return setStatus("error" + loginReq.status);

    const loginRes = await loginReq.json();

    setStatus("success");

    Cookie.set("token", loginRes.token);

    Router.push("/posts");
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={LoginHandler.bind(this)}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={fieldHandler.bind(this)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={fieldHandler.bind(this)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <div>Status: {status} </div>
      <Link href="/auth/register">
        <a> Register </a>
      </Link>
    </div>
  );
}
