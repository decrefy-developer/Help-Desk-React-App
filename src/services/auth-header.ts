import { fetchBaseQuery } from "@reduxjs/toolkit/dist/query";
import Cookies from "js-cookie";
import { serverUrl } from "./Config";

export const baseQuery = fetchBaseQuery({
  baseUrl: serverUrl,
  prepareHeaders: (header, __) => {
    const token = Cookies.get("token");
    if (token) {
      header.set("authorization", `Bearer ${token}`);
    }
    return header;
  },
});
