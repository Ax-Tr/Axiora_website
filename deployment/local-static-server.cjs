/* eslint-disable @typescript-eslint/no-require-imports */
const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT || 3000);
const root = path.resolve(__dirname, "..", "out");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".json": "application/json",
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/" || urlPath === "") urlPath = "/index.html";

  let file = path.join(root, urlPath);
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(file, (statError, stat) => {
    if (!statError && stat.isDirectory()) file = path.join(file, "index.html");

    fs.readFile(file, (readError, data) => {
      if (readError) {
        fs.readFile(path.join(root, "404.html"), (notFoundError, notFound) => {
          res.writeHead(404, { "content-type": types[".html"] });
          res.end(notFoundError ? "Not found" : notFound);
        });
        return;
      }

      res.writeHead(200, {
        "content-type": types[path.extname(file).toLowerCase()] || "application/octet-stream",
      });
      res.end(data);
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Axiora static site running at http://localhost:${port}`);
});
