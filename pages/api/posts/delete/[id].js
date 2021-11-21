import db from "../../../../libs/db";
import authorization from "../../../../middlewares/authorization";

export default async function handler(req, res) {
  if (req.method !== "DELETE")
    return res.status(405).json("Method Not Allowed response ");

  const auth = await authorization(req, res);

  const { id } = req.query;

  const data = await db("posts").where({ id }).del();

  res.status(200).json({ message: "Post deleted sucessfuly" });
}
