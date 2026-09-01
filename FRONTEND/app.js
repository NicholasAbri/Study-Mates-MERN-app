const express = require("express");

const server = express();

const port = 4000;

server.use(port, "localhost", () => {
  console.log(`Server is running on port ${port}`);
});
