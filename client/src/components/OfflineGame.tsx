import { Stage, useTick } from "@pixi/react";
import Game from "./Game";
import GameControls from "../components/controls/GameControls";
import { useEffect, useState } from "react";
import starImage from "../assets/icons/Icon_Star.png";
import ghostImage from "../assets/icons/Icon_Ghost.png";
import helixImage from "../assets/icons/Icon_Helix.png";
import {
  gameLoop,
  getInitialGameState,
  offlineScoreCounter,
  POINTS_FOR_KILL,
  POINTS_FOR_STAR,
  POINTS_FOR_SURVIVAL,
} from "../lib/services/offline-game-engine";
import { useLocalStorageState } from "../hooks/useLocalStorageState";
import { useNavigate } from "@tanstack/react-router";
import { resetGameState, updateGameState, useGameState } from "../store/game";
import Box from "./ui/Box";
import Button from "./ui/Button";
import Banner from "./ui/Banner";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "../lib/constants/game";

const scoreCounter = offlineScoreCounter();

export default function OfflineGame() {
  const [isStarted, setIsStarted] = useState(false);
  const [open, setOpen] = useState(true);
  const [highScore, setHighScore] = useLocalStorageState<number>("high_score");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { character } = useGameState();

  const navigate = useNavigate();

  useTick((delta) => {
    if (!isStarted) return;
    gameLoop(Math.min(delta, 5));
  });

  const onExit = () =>
    navigate({
      to: "/",
    });

  const onStart = () => {
    setIsStarted(true);
    setOpen(false);
    setScore(0);
    setGameOver(false);
    updateGameState(getInitialGameState());
    scoreCounter.reset();
  };

  useEffect(() => {
    if (gameOver) return;
    if (!character) return;
    if (character.health <= 0) {
      setGameOver(true);
      const score = scoreCounter.getCount(character);
      if (score > (highScore ?? 0)) setHighScore(score);
      setScore(score);

      setTimeout(() => {
        setOpen(true);
        setTimeout(() => {
          resetGameState();
        }, 100);
      }, 1000);
      return;
    }
  }, [character, gameOver, highScore, setHighScore]);

  return (
    <div>
      <dialog
        open={open}
        className="h-screen w-screen bg-clip-padding backdrop-filter backdrop-blur-md bg-transparent"
      >
        <Box
          color="orange"
          className="py-10 px-14 md:py-16 md:px-24 flex flex-col items-center absolute top-1/2 left-1/2 -translate-1/2  bg-transparent"
        >
          <Banner
            color="orange"
            className="text-3xl pt-6 pb-8 px-10 md:pt-8 md:pb-12 md:px-16 md:text-4xl text-center absolute -top-8 md:-top-12"
          >
            Offline
          </Banner>
          <main className="flex flex-col items-center">
            <div className="space-y-2 pt-8 py-4 md:py-8">
              <HelpCard
                image={starImage}
                text={`${POINTS_FOR_STAR} Points on Collecting a Star`}
              />
              <HelpCard
                image={ghostImage}
                text={`${POINTS_FOR_KILL} Points on Killing a Enemy`}
              />
              <HelpCard
                image={helixImage}
                text={`${POINTS_FOR_SURVIVAL} Points on Surviving for 1 sec`}
              />
            </div>
            <div className="flex items-center pt-2 justify-center gap-4 md:gap-8">
              <ScoreCard label="High Score" score={highScore} />
              {gameOver && <ScoreCard label="Your Score" score={score} />}
            </div>
          </main>
          <footer className="flex justify-center pt-8 gap-4">
            <Button color="grey" className="text-gray-900" onClick={onExit}>
              Exit
            </Button>
            <Button color="orange" className="" onClick={onStart}>
              {gameOver ? "Replay" : "Play"}
            </Button>
          </footer>
        </Box>
      </dialog>
      <Stage width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT}>
        <Game isStarted={isStarted} />
      </Stage>
      <GameControls />
    </div>
  );
}

function HelpCard({ text, image }: { text: string; image: string }) {
  return (
    <article className="flex items-center gap-4 border-gray-900">
      <img className="w-8 h-8" src={image} />
      <p className="text-center text-xl md:text-2xl">{text}</p>
    </article>
  );
}

function ScoreCard({ score, label }: { label: string; score: number | null }) {
  return (
    <article className="text-center">
      <p className="text-5xl md:text-6xl">{score}</p>
      <p className="text-2xl md:text-3xl">{label}</p>
    </article>
  );
}
