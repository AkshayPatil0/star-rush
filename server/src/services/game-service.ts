import { ServerGameState } from "../shared/dtos/game-state";
import { isColliding } from "../shared/services/entity";
import { getNewStarState } from "../shared/services/star";
import { moveProjectiles } from "../shared/services/projectile";

export const getInitialGameState = (): ServerGameState => {
  return {
    stars: [],
    players: {},
    started: false,
  };
};

const updateStarCollection = ({
  players,
  stars,
  ...other
}: ServerGameState): ServerGameState => {
  const updatedPlayers = players;
  const updatedStars = stars.map((star) => {
    const playerId = Object.keys(players).find(
      (playerId) => players[playerId] && isColliding(star, players[playerId])
    );
    if (!playerId) return star;
    updatedPlayers[playerId].stars++;
    return getNewStarState();
  });

  return {
    stars: updatedStars,
    players: updatedPlayers,
    ...other,
  };
};

export const updateHealthAndKills = ({ players }: ServerGameState) => {
  const updatedPlayers = players;
  // Track healths

  // Track hits
  const trackHits = (id1: string, id2: string) => {
    if (!updatedPlayers[id1]) return;
    if (!updatedPlayers[id2]) return;
    if (updatedPlayers[id1].health > 0) {
      players[id2].projectiles = players[id2].projectiles.filter(
        (projectile) => {
          if (isColliding(players[id1], projectile)) {
            updatedPlayers[id1].health -= 10;
            if (updatedPlayers[id1].health <= 0) updatedPlayers[id2].kills += 1;
            return false;
          }
          return true;
        }
      );
    }
  };

  Object.keys(players).forEach((id1) => {
    Object.keys(players).forEach((id2) => {
      if (id1 === id2) return;
      // Track player1 hits by player2 projectiles
      trackHits(id1, id2);
      // Track player2 hits by player1 projectiles
      trackHits(id2, id1);
      // Move projectiles
      updatedPlayers[id1].projectiles = moveProjectiles(
        players[id1].projectiles,
        1
      );
    });
  });

  return {
    players,
  };
};

export const getNextGameState = (gameState: ServerGameState) => {
  const updatedState = updateStarCollection(gameState);
  updatedState.players = updateHealthAndKills(updatedState).players;
  return updatedState;
};
