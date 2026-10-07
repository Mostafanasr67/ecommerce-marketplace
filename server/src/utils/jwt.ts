import jwt from "jsonwebtoken";
import "dotenv/config";

interface JwtPayload {
  userId: string;
}
function createToken(userId: string) {
    return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

function verifyToken(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof payload !== "object" || !payload.userId || typeof payload.userId !== "string") {
        throw new Error("Invalid token");
    }

    return payload as JwtPayload;
}

export { createToken, verifyToken };

