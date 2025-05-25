const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const DB_FILE = "./db.json";

// Получить все сервера
app.get("/api/servers", (req, res) => {
  const data = fs.readFileSync(DB_FILE);
  const db = JSON.parse(data);
  res.json(db.servers);
});

// Добавить новый сервер
app.post("/api/servers", (req, res) => {
  const newServer = req.body;
  const data = fs.readFileSync(DB_FILE);
  const db = JSON.parse(data);

  // Проверка: уникальный IP
  if (db.servers.some(s => s.ip === newServer.ip)) {
    return res.status(400).json({ error: "Сервер с таким IP уже существует!" });
  }

  // Генерируем ID
  newServer.id = Date.now();

  // Устанавливаем maxPlayers и players
  newServer.maxPlayers = 2000;
  newServer.players = Math.round((Math.random() * (72 - 41) + 41) / 100 * 2000);

  // Добавляем в базу
  db.servers.push(newServer);
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  res.status(201).json(newServer);
});

app.listen(3000, () => {
  console.log("API запущен на http://localhost:3000/api/servers");
});
