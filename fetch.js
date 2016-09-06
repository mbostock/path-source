import array from "array-source";

export default function(url) {
  return new FetchSource(url);
}

function FetchSource(url) {
  var that = this;
  this._source = null;
  this._open = fetch(url).then(function(response) {
    return response.body.getReader
        ? that._source = response.body.getReader()
        : response.body.arrayBuffer().then(function(buffer) { return that._source = array(buffer); });
  });
}

FetchSource.prototype.read = function() {
  return this._source
      ? this._source.read()
      : this._open.then(function(source) { return source.read(); });
};

FetchSource.prototype.cancel = function() {
  return this._source
      ? this._source.cancel()
      : this._open.then(function(source) { return source.cancel(); });
};
