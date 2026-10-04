import jwt from "jsonwebtoken";
interface JwtPayload {
  userId: string;
}
function createToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

function verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
}

export { createToken, verifyToken };