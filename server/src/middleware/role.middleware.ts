import type { Request, Response, NextFunction } from "express";
import type { Role } from "../../generated/prisma/enums.js";

function roleMiddleware(requiredRole: Role) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (user?.role !== requiredRole) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
}

export default roleMiddleware;