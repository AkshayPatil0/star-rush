import { Server, Socket } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../shared/dtos/events";
import { getOrCreateRoom, removePlayer, updatePlayer } from "./room-service";

type IServer = Server<ClientToServerEvents, ServerToClientEvents>;
type ISocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export const joinRoom =
  (socket: ISocket, io: IServer): ClientToServerEvents["join_room"] =>
  (roomId, player) => {
    console.log("join_room", socket.id, roomId, player);
    socket.join(roomId);
    updatePlayer(roomId, socket.id, player);
    socket.emit("game_started");
    io.to(roomId).emit("game_update", getOrCreateRoom(roomId));
  };

export const startGame =
  (socket: ISocket, io: IServer): ClientToServerEvents["start_game"] =>
  (roomId) => {
    console.log("start_game", socket.id, roomId);
    io.to(roomId).emit("game_started");
  };

export const playerUpdate =
  (socket: ISocket, io: IServer): ClientToServerEvents["player_update"] =>
  async (state, roomId) => {
    updatePlayer(roomId, socket.id, state);
    io.to(roomId).emit("game_update", getOrCreateRoom(roomId));
  };

export const exitGame = (socket: ISocket, io: IServer) => () => {
  console.log("Player exited", socket.id);
  const roomId = socket.handshake.query.roomId as string;
  removePlayer(roomId, socket.id);
  socket.leave(roomId);
};

export const disconnected =
  (socket: ISocket, io: IServer) => (reason: string) => {
    console.log("disconnected due to", reason, socket.id);
    const roomId = socket.handshake.query.roomId as string;
    removePlayer(roomId, socket.id);
    socket.leave(roomId);
  };
