import db from "../../../../libs/db";
import authorization from "../../../../middlewares/authorization";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "errror" });

  const { id } = req.query;
  const auth = await authorization(req, res);

  const post = await db("posts").where({ id }).first();

  if (!post) return res.status(404).json({ message: "Data Not found" });

  return res.status(200).json({
    message: "Post data",
    data: post,
  });
}
