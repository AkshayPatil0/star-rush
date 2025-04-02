import { Sprite, Text } from "@pixi/react";
import { TextStyle, TextStyleFill } from "pixi.js";
import React from "react";
import starImage from "../assets/icons/Icon_Star.png";
import bulletImage from "../assets/icons/bullet.png";
import ghostImage from "../assets/icons/Icon_Ghost.png";
import heartImage from "../assets/icons/Icon_Heart.png";
import { useGameState } from "../store/game";

const Stats = () => {
  const { character } = useGameState();

  if (!character) return null;
  const { ammo, health, stars, kills } = character;
  return (
    <>
      <StatItem image={starImage} value={stars?.toString()} x={20} y={20} />
      <StatItem
        image={heartImage}
        value={health.toString()}
        x={20}
        y={65}
        getFill={(ammo) =>
          +ammo <= 0 ? "red" : +ammo <= 20 ? "yellow" : "green"
        }
      />
      <StatItem
        image={bulletImage}
        value={ammo?.toString()}
        x={20}
        y={110}
        getFill={(ammo) =>
          +ammo <= 0 ? "red" : +ammo <= 20 ? "yellow" : "green"
        }
      />
      <StatItem image={ghostImage} value={kills?.toString()} x={20} y={155} />
    </>
  );
};

const StatItem: React.FC<{
  x: number;
  y: number;
  value: string;
  image: string;
  getFill?: (value: string) => TextStyleFill;
}> = ({ x, y, image, value, getFill }) => {
  return (
    <>
      <Sprite x={x} y={y} height={30} width={30} image={image} />
      <Text
        text={value}
        x={x + 40}
        y={y + 3}
        style={
          new TextStyle({
            ...(getFill ? { fill: getFill(value) } : {}),
            fontSize: 24,
            fontFamily: "FriendlySans",
          })
        }
      />
    </>
  );
};

export default Stats;
