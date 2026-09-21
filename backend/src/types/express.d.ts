import type { User } from "../modules/users/user.types.js";

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, "id">;
    }
  }
}

export {};
