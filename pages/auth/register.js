import { useState } from "react";
import { unauthPage } from "../../middlewares/authorizationPage";

export async function getServerSideProps(ctx) {
  const checkLogin = unauthPage(ctx);

  if (checkLogin) {
    return checkLogin;
  } else {
    return {
      props: {}, // will be passed to the page component as props
    };
  }
}

export default function Register(props) {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("normal");

  async function registerHandler(e) {
    e.preventDefault();

    setStatus("loading");

    const registerReq = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(fields), // diubah dulu dari object ke json
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!registerReq.ok) return setStatus("error" + registerReq.status);

    const registerRes = await registerReq.json();
    setStatus("success");
  }

  function fieldHandler(e) {
    const name = e.target.getAttribute("name");
    setFields({
      ...fields,
      [name]: e.target.value,
    });
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={registerHandler.bind(this)}>
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
        <button type="submit">Register</button>

        <div>Output: {status}</div>
      </form>
    </div>
  );
}
