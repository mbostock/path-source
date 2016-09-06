export default function(url) {
  return new RequestSource(url);
}

function RequestSource(url) {
  var that = this,
      request = this._request = new XMLHttpRequest,
      readResolve,
      readReject;

  this._read = new Promise(function(resolve, reject) {
    readResolve = resolve;
    readReject = reject;
  });

  request.responseType = "arraybuffer";
  request.onload = loaded;
  request.onerror = errored;
  request.ontimeout = errored;
  request.open("GET", url, true);
  request.send();

  function loaded() {
    that._read = Promise.resolve({done: true, value: undefined});
    readResolve({done: false, value: new Uint8Array(request.response)});
  }

  function errored(error) {
    that._read = Promise.reject(error);
    readReject(error);
  }
}

RequestSource.prototype.read = function() {
  return this._read;
};

RequestSource.prototype.cancel = function() {
  var request = this._request;
  switch (request.readyState) {
    case 0: case 4: return Promise.resolve();
    default: return new Promise(function(resolve, reject) {
      request.onerror = function(error) { reject(error); };
      request.onabort = function() { resolve(); };
      request.abort();
    });
  }
};
