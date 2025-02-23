import { AnimatedSprite, Sprite, useTick } from "@pixi/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedSprite as IAnimatedSprite, Texture } from "pixi.js";
import {
  CHARACTER_DEAD,
  CHARACTER_IDLE,
  CHARACTER_WALK,
} from "../lib/constants/character";
import ghostImg from "../assets/icons/Icon_Ghost.png";
import gunImage from "../assets/weapons/weaponR1.png";
import {
  CharacterState,
  getGunPositionByCharacter,
} from "../lib/services/character";
import muzzleImage from "../assets/extras/muzzle.png";

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

  const isDead = character.health <= 0;

  useEffect(() => {
    if (charRef.current) {
      if (!charRef.current.playing) {
        charRef.current.play(); // Ensure animation keeps playing
      }
    }
  }, [character.isMoving, isDead]);

  const textures = useMemo(() => {
    if (isDead) return deadTextures;
    if (character.isMoving) return walkTextures;
    return idleTextures;
  }, [character.isMoving, isDead, walkTextures, deadTextures, idleTextures]);

  useTick((delta) => {
    if (!isDead) return;
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
        loop={!isDead}
        tint={isDead ? 0x555555 : 0xffffff}
      />
      {isDead && (
        <Sprite
          image={ghostImg}
          x={character.x}
          y={ghost?.y ?? 0}
          anchor={0.5}
          scale={0.15}
        />
      )}
      {!isDead && <Gun character={character} />}
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

const Gun: React.FC<{ character: CharacterState }> = ({ character }) => {
  const { x, y } = getGunPositionByCharacter(character);
  const rotation =
    character.direction === -1
      ? character.gunRotation + Math.PI
      : character.gunRotation;

  const px = x + 45 * Math.cos(character.gunRotation);
  const py = y + 45 * Math.sin(character.gunRotation);

  return (
    <>
      <Sprite
        image={gunImage}
        x={x}
        y={y}
        anchor={0.5}
        scale={{ x: 0.4 * character.direction, y: 0.4 }}
        rotation={rotation}
      />
      <Sprite
        x={px}
        y={py}
        image={muzzleImage}
        anchor={{ x: 0.5, y: 0.6 }}
        scale={0.5}
        rotation={rotation}
        visible={character.isShooting}
      />
    </>
  );
};

export default Character;
