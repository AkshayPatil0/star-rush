import { AnimatedSprite, Sprite, useTick } from "@pixi/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedSprite as IAnimatedSprite, Texture } from "pixi.js";
import { CharacterState } from "../store/character";
import { updateGameState } from "../store/game";
import Gun from "./Gun";
import {
  CHARACTER_DEAD,
  CHARACTER_IDLE,
  CHARACTER_WALK,
} from "../lib/services/character";
import ghostImg from "../assets/icons/Icon_Ghost.png";

const useTextures = (images: string[]) => {
  return useMemo(() => images.map((img) => Texture.from(img)), [images]);
};

const Character: React.FC<{ character: CharacterState }> = ({ character }) => {
  const walkTextures = useTextures(CHARACTER_WALK[character.id]);
  const idleTextures = useTextures(CHARACTER_IDLE[character.id]);
  const deadTextures = useTextures(CHARACTER_DEAD[character.id]);

  const [ghost, setGhost] = useState<{
    y: number;
    dir: number;
  } | null>(null);
  const charRef = useRef<IAnimatedSprite | null>(null);

  useEffect(() => {
    updateGameState(({ stars }) => ({
      stars: stars.filter((star) => {
        const dx = star.x - character.x;
        const dy = star.y - character.y;
        if (Math.sqrt(dx * dx + dy * dy) < 30) {
          updateGameState(({ score }) => ({ score: score + 1 }));
          return false;
        }
        return true;
      }),
    }));
  }, [character]);

  useEffect(() => {
    if (charRef.current) {
      if (!charRef.current.playing) {
        charRef.current.play(); // Ensure animation keeps playing
      }
    }
  }, [character.isMoving, character.isDead]);

  const textures = useMemo(() => {
    if (character.isDead) return deadTextures;
    if (character.isMoving) return walkTextures;
    return idleTextures;
  }, [
    character.isMoving,
    character.isDead,
    walkTextures,
    deadTextures,
    idleTextures,
  ]);

  useTick((delta) => {
    if (!character.isDead) return;
    setGhost((prev) => {
      const start = { y: character.y - 30, dir: 1 };
      if (!prev) return start;
      const newY = prev.y + 0.2 * prev.dir * delta;
      if (Math.abs(start.y - newY) > 5) {
        return { y: prev.y, dir: prev.dir * -1 };
      }
      return { y: newY, dir: prev.dir };
    });
  });

  return (
    <>
      <AnimatedSprite
        ref={charRef}
        isPlaying
        textures={textures}
        animationSpeed={0.2}
        x={character.x}
        y={character.y}
        anchor={{ x: 0.5, y: 0.75 }}
        scale={{ x: character.direction * 0.1, y: 0.1 }}
        loop={!character.isDead}
        tint={character.isDead ? 0x555555 : 0xffffff}
      />
      {character.isDead && (
        <Sprite
          image={ghostImg}
          x={character.x}
          y={ghost?.y ?? 0}
          anchor={0.5}
          scale={0.15}
        />
      )}
      <Gun />
      {/* <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(2, "yellow");
          g.drawRect(character.x - 20, character.y - 20, 40, 40);
        }}
      /> */}
    </>
  );
};

export default Character;
