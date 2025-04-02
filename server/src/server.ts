import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "./shared/dtos/events";
import { config } from "dotenv";
import {
  disconnected,
  exitGame,
  joinRoom,
  playerUpdate,
  startGame,
} from "./services/events-service";
import { getAllRooms, setRoomState } from "./services/room-service";
import { getNextGameState } from "./services/game-service";
config();

const app = express();

app.get("/health", (req, res) => {
  res.send("ok");
});

// app.use("/assets", express.static("public/assets"));

// app.get("/play", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../public/game.html"));
// });

// app.get("/", async (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../public/index.html"));
// });

// app.get("/app-state", async (req, res) => {
//   res.json({
//     // players,
//     players: Object.fromEntries(
//       Array.from(players.entries()).map(([key, value]) => [
//         key,
//         Object.fromEntries(value.entries()),
//       ])
//     ),
//     star,
//   });
// });

const httpServer = createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    origin: "*",
  },
});

// io.use((socket, next) => {
//   const { roomId } = socket.handshake.query;
//   if (roomId) {
//     joinRoom(socket, io)(roomId as string);
//   }
//   next();
// });

io.on("connection", (socket) => {
  const roomId = socket.handshake.query.roomId as string;
  console.log(`New connection ${socket.id} | room: ${roomId}`);
  // socket.onAny(console.log);
  socket.on("join_room", joinRoom(socket, io));
  socket.on("start_game", startGame(socket, io));
  socket.on("player_update", playerUpdate(socket, io));
  socket.on("exit_game", exitGame(socket, io));
  socket.on("disconnect", disconnected(socket, io));
});

const FPS = 30;
const INTERVAL = 1000 / FPS; // 1000ms / 30 = ~33ms per update

setInterval(() => {
  const rooms = getAllRooms();

  rooms.forEach(([roomId, roomState]) => {
    if (roomState.started) {
      const newRoomState = getNextGameState(roomState);
      setRoomState(roomId, newRoomState);
      io.to(roomId).emit("game_update", newRoomState);
    }
  });
}, INTERVAL);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`listening on post ${PORT}`));
