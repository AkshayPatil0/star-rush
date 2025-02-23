import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { cn } from "../lib/utils/style";
import titleImg from "../assets/backgrounds/title.png";
import Button, { ButtonProps } from "../components/ui/Button";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  return (
    <div className="home h-screen w-screen flex flex-col items-center justify-center gap-20">
      <div className="w-[70vw] h-auto md:h-[30vh] md:w-auto relative z-0">
        <img src={titleImg} className="h-full z-10" />
      </div>
      <div className="flex flex-col gap-8">
        <MenuButton
          color="blue"
          onClick={() => {
            navigate({ to: "/room" });
          }}
        >
          Join Room
        </MenuButton>
        <MenuButton
          color="orange"
          onClick={() => {
            navigate({ to: "/offline" });
          }}
        >
          Play offline
        </MenuButton>
      </div>
    </div>
  );
}

const MenuButton: React.FC<ButtonProps> = ({ className, ...otherProps }) => {
  return (
    <Button
      className={cn("text-xl py-8 md:text-2xl md:py-10", className)}
      {...otherProps}
    />
  );
};
