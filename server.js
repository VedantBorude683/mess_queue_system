const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve the index.html file at root (/)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"index.html"));
});

let queue = [];

app.get("/queue", (req, res) => {
  res.json(queue);
});

// Add a student to the queue
app.post("/queue/join", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  // Ensure the student is not already in the queue
  if (!queue.find(s => s.name === name)) {
    queue.push({ name });
    return res.json({ message: "Added to queue", queue });
  } else {
    return res.json({ message: "Already in queue", queue });
  }
});

// Serve the first person in the queue (remove them)
app.post("/queue/serve", (req, res) => {
  const { name } = req.body;

  if (queue.length && queue[0].name === name) {
    queue.shift(); // Remove the first student from the queue
    return res.json({ message: "You have been served", queue });
  } else {
    return res.status(403).json({ message: "You're not first in queue" });
  }
});

// Listen on dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
