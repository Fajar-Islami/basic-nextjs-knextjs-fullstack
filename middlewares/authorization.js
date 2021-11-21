import jwt from "jsonwebtoken";

export default function authorization(req, res) {
  const jwt_secret = process.env.JWT_SECRET;

  // Verifikasi auth
  //   jadi async
  return new Promise((resolve, reject) => {
    const { authorization } = req.headers;

    if (!authorization)
      return res.status(401).json({ message: "Unauthorized" });

    const [authType, authToken] = authorization.split(" ");

    if (authType !== "Bearer")
      return res.status(401).json({ message: "Unauthorized" });

    return jwt.verify(authToken, jwt_secret, function (err, decoded) {
      if (err) return res.status(401).json({ message: "Unauthorized" });

      return resolve(decoded);
    });
  });
}
