const os = require("os");
const express = require("express");
const app = express();

const { getMessages, addMessage } = require("./messages");

const port = process.env.PORT || 8080;

const message = process.env.MESSAGE || "Hello World!";
let isCrashed = false;

app.get("/", (req, res) => {
  res.status(isCrashed ? 500 : 200).json({
    status: isCrashed ? "ON FIRE!" : "ok",
    message: message,
    info: {
      platform: os.type(),
      release: os.release(),
      hostName: os.hostname()
    }
  });
});

// Health and liveness endpoints
app.get("/ready", (req, res) => {
  if (isCrashed) return res.status(500).send("");
  res.send("Ok");
});
app.get("/healthy", (req, res) => {
  if (isCrashed) return res.status(500).send("");
  res.send("Ok");
});

// Endpoint for simulating a disaster scenario
app.get("/crash", (req, res) => {
  if (isCrashed) return res.status(500).send("");
  res.send("Uh oh...");
  isCrashed = true;
});

// Redis based endpoint
app.get("/messages", async (req, res) => {
  if (isCrashed) return res.status(500).send("");

  const messages = await getMessages();
  res.json({
    status: "done",
    messages: messages
  });
});

app.get("/messages/:id", async (req, res) => {
  if (isCrashed) return res.status(500).send("");

  const message = await addMessage(req.params.id);
  res.json({
    status: "done",
    message: message
  });
});

// Start express app
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
