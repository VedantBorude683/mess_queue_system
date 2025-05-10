const nameInput = document.getElementById("name");
const list = document.getElementById("queueList");
const count = document.getElementById("queue-count");
const status = document.getElementById("yourStatus");

async function updateQueue() {
  const res = await fetch("/queue");
  const queue = await res.json();
  list.innerHTML = "";
  count.textContent = `Total in queue: ${queue.length}`;

  queue.forEach((student, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${student.name}`;
    if (i === 0) li.style.fontWeight = "bold"; // Highlight the first person in the queue
    list.appendChild(li);
  });

  const name = nameInput.value.trim();
  if (!name) {
    status.textContent = "";
    return;
  }

  const pos = queue.findIndex(s => s.name === name);
  if (pos === 0) {
    status.textContent = "🎉 It's your turn!";
  } else if (pos > 0) {
    status.textContent = `⏳ Your position: ${pos + 1}`;
  } else {
    status.textContent = "You're not in the queue.";
  }
}

async function joinQueue() {
  const name = nameInput.value.trim();
  if (!name) return alert("Enter your name");

  // Join queue
  await fetch("/queue/join", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  updateQueue();
}

async function takeMeal() {
  const name = nameInput.value.trim();
  if (!name) return alert("Enter your name");

  const res = await fetch("/queue/serve", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });

  const result = await res.json();
  if (!res.ok) {
    alert(result.message); // Display error if not the first
  }

  updateQueue();
}

setInterval(updateQueue, 5000); // Auto-refresh every 5 seconds
updateQueue(); // Initial load
