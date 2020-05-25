const express = require("express");
const bodyParser = require("body-parser");
const {randomBytes} = require("crypto");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const {PORT = 8081} = process.env;

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");
  const {content} = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({id: commentId, content});
  commentsByPostId[req.params.id] = comments;
  res.send(commentsByPostId);
});

app.listen(PORT, () => {
  console.log(`comments microservice listening on 8081`);
});
