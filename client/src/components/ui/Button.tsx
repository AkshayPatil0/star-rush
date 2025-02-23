import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils/style";
import btnOrangeImage from "../../assets/backgrounds/buttons/ButtonText_Small_Orange_Round.png";
import btnWhiteImage from "../../assets/backgrounds/buttons/ButtonText_Small_Blank_Round.png";
import btnGreyImage from "../../assets/backgrounds/buttons/ButtonText_Small_GreyOutline_Round.png";
import btnBlueImage from "../../assets/backgrounds/buttons/ButtonText_Small_Blue_Round.png";

const ImageMap = {
  orange: btnOrangeImage,
  white: btnWhiteImage,
  grey: btnGreyImage,
  blue: btnBlueImage,
} as const;

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  color?: keyof typeof ImageMap;
}

export default function Button({
  color = "white",
  children,
  className,
  ...otherProps
}: ButtonProps) {
  return (
    <button
      className={cn(
        "relative z-0 py-4 px-10 md:py-6 md:px-12 font-title text-xl",
        className
      )}
      {...otherProps}
    >
      <img
        className="absolute top-0 left-0 h-full w-full -z-10"
        src={ImageMap[color]}
      />
      {children}
    </button>
  );
}
