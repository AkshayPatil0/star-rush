import { Stage, useTick } from "@pixi/react";
import Game from "./Game";
import GameControls from "./controls/GameControls";
import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { updateGameState, useGameState } from "../store/game";
import Button from "./ui/Button";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../lib/constants/game";
import Input from "./ui/Input";
import { CharacterState, CharacterType } from "../shared/dtos/character";
import Character from "./Character";
import {
  gameLoop,
  getInitialCharacterState,
  getInitialGameState,
  joinRoom,
} from "../lib/services/online-game-engine";
import leftArrowImg from "../assets/icons/Icon_ArrowLeft.png";
import rightArrowImg from "../assets/icons/Icon_ArrowRight.png";
import { Route } from "../routes/room";
import { useCharacterType, useUsername } from "../hooks/persist";
import { CHARACTER_THUMBNAIL } from "../lib/constants/character-textures";
import { Dialog, DialogHeader } from "./ui/Dialog";

export default function OnlineGame() {
  const { character } = useGameState();

  const { roomId, stage } = Route.useSearch();

  useTick((delta) => {
    if (stage !== "play") return;
    gameLoop(Math.min(delta, 5));
  });

  // const onStart = () => {
  //   setIsStarted(true);
  //   setOpen(false);
  //   setGameOver(false);
  //   // updateGameState(getInitialGameState());
  // };

  useEffect(() => {
    updateGameState(getInitialGameState());
  }, []);

  return (
    <div>
      <JoinRoomDialog />
      <CharacterSelectDialog />
      <LobbyDialog />
      <Stage width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT}>
        <Game isStarted={stage === "play"} />
      </Stage>
      <GameControls />
    </div>
  );
}

const JoinRoomDialog: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const { stage } = Route.useSearch();
  const navigate = useNavigate();
  const onExit = () => {
    navigate({
      to: "/",
      search: {
        stage: "room",
      },
    });
  };

  const onJoin = () => {
    navigate({
      to: `/room`,
      search: {
        roomId,
        stage: "character",
      },
    });
  };

  return (
    <Dialog open={stage === "room"}>
      <DialogHeader>Join Room</DialogHeader>
      <main className="w-full">
        <div className="grid grid-cols-[auto_1fr] gap-4 items-center py-12 w-full">
          <label htmlFor="room-id" className="text-3xl">
            Room ID
          </label>
          <Input
            className="w-full text-xl"
            id="room-id"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
        </div>
      </main>
      <footer className="flex justify-center pt-8 gap-4">
        <Button color="grey" className="text-gray-900" onClick={onExit}>
          Exit
        </Button>
        <Button color="orange" className="" onClick={onJoin}>
          Join
        </Button>
      </footer>
    </Dialog>
  );
};

const CharacterSelectDialog: React.FC = () => {
  const { roomId, stage } = Route.useSearch();
  const [characterType, setCharacterType] = useCharacterType();
  const [username, setUsername] = useUsername();

  const navigate = useNavigate();
  const onBack = () => {
    navigate({
      to: "/room",
      search: {
        stage: "room",
      },
    });
  };

  const onJoinLobby = () => {
    if (!roomId) {
      onBack();
      return;
    }
    if (!username || !characterType) return;
    const player = joinRoom(roomId, getInitialCharacterState());
    updateGameState({ character: player });
    navigate({
      to: `/room`,
      search: (prev) => ({
        ...prev,
        stage: "lobby",
      }),
    });
  };

  return (
    <Dialog open={stage === "character"}>
      <DialogHeader>Your Avatar</DialogHeader>
      <main className="pt-4 flex flex-col items-center">
        <CharacterSelect
          characterType={characterType || 1}
          onTypeChange={setCharacterType}
        />
        <div className="flex gap-4 items-center">
          <label htmlFor="name" className="text-3xl">
            Name:
          </label>
          <Input
            className="w-full text-xl"
            id="name"
            placeholder="Username"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      </main>
      <footer className="flex justify-center pt-8 gap-4">
        <Button color="grey" className="text-gray-900" onClick={onBack}>
          Back
        </Button>
        <Button color="orange" className="" onClick={onJoinLobby}>
          Lobby
        </Button>
      </footer>
    </Dialog>
  );
};

const LobbyDialog: React.FC = () => {
  const { stage } = Route.useSearch();
  const { character, enemies } = useGameState();
  const navigate = useNavigate();
  const onBack = () => {
    navigate({
      to: "/room",
      search: (prev) => ({
        ...prev,
        stage: "character",
      }),
    });
  };

  const onStart = () => {
    navigate({
      to: `/room`,
      search: (prev) => ({
        ...prev,
        stage: "play",
      }),
    });
  };

  return (
    <Dialog open={stage === "lobby"}>
      <DialogHeader>Lobby</DialogHeader>
      <main className="grid grid-cols-2 gap-4 w-full pt-8">
        {character && <PlayerCard player={character} />}
        {enemies.map((enemy) => (
          <PlayerCard key={enemy.id} player={enemy} />
        ))}
      </main>
      <footer className="flex justify-center pt-8 gap-4">
        <Button color="grey" className="text-gray-900" onClick={onBack}>
          Back
        </Button>
        <Button color="orange" className="" onClick={onStart}>
          Start
        </Button>
      </footer>
    </Dialog>
  );
};

function CharacterSelect({
  characterType,
  onTypeChange,
}: {
  characterType: CharacterType;
  onTypeChange: (type: CharacterType) => void;
}) {
  const onChange = (direction: number) => () => {
    const next = Math.abs((characterType - 1 + direction) % 4) + 1;
    onTypeChange(next as CharacterType);
  };

  return (
    <div className="px-4 relative">
      <Stage width={150} height={150} options={{ backgroundAlpha: 0 }}>
        <Character
          character={{
            ...getInitialCharacterState(),
            type: characterType,
            x: 75,
            y: 80,
          }}
        />
      </Stage>
      <button
        className="absolute top-1/2 left-0 transform -translate-y-1/2"
        onClick={onChange(-1)}
      >
        <img className="size-8" src={leftArrowImg} alt="helix" />
      </button>
      <button
        className="absolute top-1/2 right-0 transform -translate-y-1/2"
        onClick={onChange(1)}
      >
        <img className="size-8" src={rightArrowImg} alt="helix" />
      </button>
    </div>
  );
}

function PlayerCard({ player }: { player: CharacterState }) {
  return (
    <div className="flex items-center  px-2 bg-white rounded-2xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] border-2">
      <img
        src={CHARACTER_THUMBNAIL[player.type]}
        alt={`Character ${player.type}`}
        className="size-16"
      />
      <span className="text-xl">{player.name}</span>
    </div>
  );
}
