const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  console.log(`Propagating event ${req.body.type}`);
  // posts service
  axios.post("http://posts-clusterip-srv:8080/events", event);
  // comments service
  axios.post("http://comments-clusterip-srv:8081/events", event);
  // query service
  axios.post("http://query-clusterip-srv:8082/events", event);
  // moderation service
  axios.post("http://moderation-clusterip-srv:8083/events", event);

  res.send({status: "OK"});
});

app.get("/events", (req, res) => {
  res.send(events);
});

const {PORT = 8085} = process.env;

app.listen(PORT, () => {
  console.log(`Event Bus listening on ${PORT}`);
});
