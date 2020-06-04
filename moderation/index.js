const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const {PORT = 8083} = process.env;

app.post("/events", async (req, res) => {
  const {type, data} = req.body;
  switch (type) {
    case "CommentCreated":
      // reject all comments containing orange keyword
      const status = data.content.includes("orange") ? "rejected" : "approved";
      await axios.post(`http://event-bus-clusterip-srv:8085/events`, {
        type: "CommentModerated",
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      });
      break;
    default:
      console.log(`Event ignored ${type}`);
  }
  res.send({});
});

app.listen(PORT, () => {
  console.log(`moderation service listening on ${PORT}`);
});
