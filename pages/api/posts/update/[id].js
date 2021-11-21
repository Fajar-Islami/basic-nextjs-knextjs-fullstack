import db from "../../../../libs/db";
import authorization from "../../../../middlewares/authorization";

export default async function handler(req, res) {
  if (req.method !== "PATCH")
    return res.status(405).json("Method Not Allowed response ");

  const auth = await authorization(req, res);

  const { id } = req.query;
  const { title, content } = req.body;

  const update = await db("posts").where({ id }).update({
    title,
    content,
  });

  const data = await db("posts").where({ id }).first();

  res.status(200).json({ message: "Data updated", data });
}
