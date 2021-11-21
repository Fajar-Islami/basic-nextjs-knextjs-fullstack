import db from "../../../libs/db";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json("Method Not Allowed response ");

  const { email, password } = req.body;

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const register = await db("users").insert({
    email,
    password: passwordHash,
  });

  const data = await db("users").where({ id: register }).first();

  res.status(200).json({
    message: "User registered successfully",
    data,
  });
}
