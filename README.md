# path-source

A [readable stream reader](https://streams.spec.whatwg.org/#readable-stream-reader) for reading files in Node or fetching URLs in browser. For example, to read a file in 64-byte chunks in Node:

```js
var path = require("path-source");

function read(source) {
  return source.read(64).then((result) => {
    if (result.done) return;
    process.stdout.write(result.value);
    return read(source);
  });
}

read(path("example.txt"))
  .catch((error) => console.error(error.stack));
```

Similarly, to fetch a resources in 64-byte chunks in a browser (requires [array-source](https://github.com/mbostock/array-source) and [slice-source](https://github.com/mbostock/slice-source)):

```html
<!DOCTYPE html>
<script src="https://unpkg.com/array-source@0"></script>
<script src="https://unpkg.com/slice-source@0"></script>
<script src="https://unpkg.com/path-source@0"></script>
<script>

function read(source) {
  return source.read(64).then((result) => {
    if (result.done) return;
    console.log(result.value);
    return read(source);
  });
}

read(sources.path("example.txt"))
  .catch((error) => console.error(error.stack));

</script>
```

## API Reference

<a name="path" href="#path">#</a> <b>path</b>(<i>path</i>) [<>](https://github.com/mbostock/path-source/blob/master/index.js "Source")

In Node, returns a *source* for the file at the specified *path*; equivalent to [file-source](https://github.com/mbostock/file-source). In browser, returns a *source* for the resource at the specified *path*, using streaming fetch if available, and falling back to XMLHttpRequest.

<a name="source_read" href="#source_read">#</a> <i>source</i>.<b>read</b>([<i>length</i>])

Returns a Promise for the next chunk of data from the underlying stream. The yielded result is an object with the following properties:

* `value` - a [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array), or undefined if the stream ended
* `done` - a boolean which is true if the stream ended

If an optional *length* is specified, the promise will be yielded with a *value* of *length* bytes, or the remaining bytes of the underlying stream if the underlying stream has more than zero but fewer than *length* bytes remaining. When no bytes remain in the stream, the yielded *value* will be undefined, and *done* will be true.

<a name="source_cancel" href="#source_cancel">#</a> <i>source</i>.<b>cancel</b>()

Returns a Promise which is resolved when the underlying stream has been destroyed.
