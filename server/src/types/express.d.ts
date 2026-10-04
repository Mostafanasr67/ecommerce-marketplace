import type { Role } from "../../generated/prisma.js";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: Role;
    }
  }
}

export {};