import { Stage } from "@pixi/react";
import Game from "./Game";
import { usePreventScrollOnDrag } from "./hooks/usePreventScrollOnDrag";
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from "./lib/constants/game";
import GameControls from "./components/GameControls";

function App() {
  usePreventScrollOnDrag();

  return (
    <div>
      <Stage width={VIEWPORT_WIDTH} height={VIEWPORT_HEIGHT}>
        <Game />
      </Stage>
      <GameControls />
    </div>
  );
}

export default App;
