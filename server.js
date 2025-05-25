const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const DB_FILE = "db.json";

// Получить все сервера
app.get("/api/servers", (req, res) => {
  const data = fs.readFileSync(DB_FILE);
  const db = JSON.parse(data);
  res.json(db.servers);
});

// Добавить сервер
app.post("/api/servers", (req, res) => {
  const newServer = req.body;

  // Генерируем ID
  newServer.id = Date.now();

  // Если игроков нет, делаем 0
  newServer.players = newServer.players || 0;

  const data = fs.readFileSync(DB_FILE);
  const db = JSON.parse(data);

  db.servers.push(newServer);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  res.status(201).json(newServer);
});

app.listen(PORT, () => {
  console.log(`API запущен на порту ${PORT}`);
});
