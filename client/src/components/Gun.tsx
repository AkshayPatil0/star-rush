import { Graphics, Sprite } from "@pixi/react";
import { useCharacter } from "../store/character";
import gunImage from "../assets/weapons/weaponR1.png";
import { getGunCoordsByCharacter } from "../lib/services/character";
import muzzleImage from "../assets/extras/muzzle.png";

const Gun = () => {
  const character = useCharacter();

  const { x, y } = getGunCoordsByCharacter(character);
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
      <Graphics
        draw={(g) => {
          g.clear();
          g.lineStyle(2, "red");
          g.drawCircle(x, y, 60);
        }}
      />
    </>
  );
};

export default Gun;
