import db from "../../../libs/db";
import authorization from "../../../middlewares/authorization";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405);

  const auth = await authorization(req, res);

  const posts = await db("posts");

  return res.status(200).json({
    message: "Posts data",
    data: posts,
  });
}
