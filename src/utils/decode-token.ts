import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { omit } from "lodash";
import { IUser } from "../models/interface";

export const DecodeToken = () => {
  const token = Cookies.get("token");
  if (token) {
    const decoded: IUser = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      console.log("removed");
      Cookies.remove("token");
      return null;
    }

    // const emitted = omit(decoded, [
    //   "_id",
    //   "session",
    //   "iat",
    //   "exp",
    //   "updatedAt",
    //   "createdAt",
    //   "session",
    //   "__v",
    // ]);

    return decoded;
  } else {
    return null;
  }
};
