"use strict";

const express = require("express");
const app = express();
const os = require("os")

const PORT = process.env.PORT || "8080";
const NAME = process.env.NAME || "no name";

app.get("/", async(req, res) => {
  res.send(
    "<center><h1>Hello from NodeJS, " + NAME + "!</h1>" + 
    "<p>Running on Container: " + os.hostname() + "</center>"
  );
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
