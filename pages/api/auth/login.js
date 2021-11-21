import db from "../../../libs/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const jwt_secret = process.env.JWT_SECRET;

  if (req.method !== "POST")
    return res.status(405).json("Method Not Allowed response ").end();

  const { email, password } = req.body;

  const checkUser = await db("users").where({ email }).first();

  // Klo email tidak ada
  if (!checkUser)
    return res.status(401).json({ message: "Unauthorized" }).end();

  const checkPassword = await bcrypt.compare(password, checkUser.password);

  if (!checkPassword)
    return res.status(401).json({ message: "Unauthorized" }).end();

  // Proses sign in
  const token = await jwt.sign(
    {
      id: checkUser.id,
      email: checkUser.email,
    },
    jwt_secret,
    {
      expiresIn: "7d",
    }
  );

  res.status(200).json({
    message: "Login successfully",
    token,
  });
}
