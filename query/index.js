const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

const handleEvent = (type, data) => {
  switch (type) {
    case "PostCreated":
      {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
      }
      break;
    case "CommentCreated":
      {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        post.comments.push({id, content, status});
      }
      break;
    case "CommentUpdated":
      {
        const {id, content, postId, status} = data;
        const post = posts[postId];
        const comment = post.comments.find((comment) => {
          return comment.id === id;
        });
        comment.status = status;
        comment.content = content;
      }
      break;
    default:
      console.log(`Event ignored`);
  }
};

app.post("/events", (req, res) => {
  console.log(`Event Received ${req.body.type}`);
  const {type, data} = req.body;
  handleEvent(type, data);
  res.send({});
});

const {PORT = 8082} = process.env;

app.listen(PORT, async () => {
  console.log(`query service listening on ${PORT}`);
  console.log(`reconstructing state from events`);
  const res = await axios.get(`http://event-bus-clusterip-srv:8085/events`);

  for (let event of res.data) {
    console.log(`Processing event: ${event.type}`);
    handleEvent(event.type, event.data);
  }
});
