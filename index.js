import slice from "slice-source";
import fetchPath from "./fetch";
import requestPath from "./request";

export default function path(path) {
  return slice((typeof fetch === "function" ? fetchPath : requestPath)(path));
}
