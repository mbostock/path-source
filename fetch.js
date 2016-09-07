import array from "array-source";

export default function(url) {
  return fetch(url).then(function(response) {
    var body = response.body;
    return body.getReader ? body.getReader() : body.arrayBuffer().then(array);
  });
}
