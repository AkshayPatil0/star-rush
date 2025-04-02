import OnlineGame from "./OnlineGame";
import { StageProvider } from "./StageProvider";

const OnlineGameContainer: React.FC = () => {
  return (
    <StageProvider>
      <OnlineGame />
    </StageProvider>
  );
};

export default OnlineGameContainer;
