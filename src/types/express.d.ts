import { IUser } from "../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: IUser; // your User type
    }
  }
}
