"use strict";

const express = require("express");
const app = express();
const os = require("os")

const PORT = process.env.PORT || "8080";
const NAME = process.env.NAME || "no name";

app.get("/", async(req, res) => {
    res.send("Hello from NodeJS, " + NAME + "!\nRunning on Container: " + os.hostname());
});

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});