// CloudFront Function (viewer request) — pretty URLs on a plain S3 origin.
//
// Astro is configured with `build.format: 'file'`, so pages land in the bucket
// as `index.html`, `code-of-conduct.html`, `404.html`. An S3 REST origin has no
// notion of directory indexes, so without this a visit to /code-of-conduct
// returns 404.
//
// Rules:
//   /                  -> /index.html          (handled by default_root_object)
//   /code-of-conduct   -> /code-of-conduct.html
//   /code-of-conduct/  -> /code-of-conduct.html   (trailing slash tolerated)
//   /_astro/app.css    -> untouched (has an extension)
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  // Anything with a file extension goes straight through.
  if (uri.match(/\.[a-zA-Z0-9]+$/)) {
    return request;
  }

  if (uri.endsWith('/')) {
    uri = uri.slice(0, -1);
  }

  request.uri = uri === '' ? '/index.html' : uri + '.html';

  return request;
}
