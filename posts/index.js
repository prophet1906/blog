const express = require("express");
const bodyParser = require("body-parser");
const {randomBytes} = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const {PORT = 8080} = process.env;

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const {title} = req.body;
  posts[id] = {id, title};
  await axios.post(`http://event-bus-clusterip-srv:8085/events`, {
    type: "PostCreated",
    data: {id, title},
  });
  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log(`Event Received ${req.body.type}`);
  res.send({});
});

app.listen(PORT, () => {
  console.log(`posts microservice listening on ${PORT}`);
});
