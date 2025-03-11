import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils/style";
import boxOrangeImage from "../../assets/backgrounds/box/Box_Orange_Rounded.png";
import boxBlueImage from "../../assets/backgrounds/box/Box_Blue_Rounded.png";
import boxWhiteImage from "../../assets/backgrounds/box/Box_Blank_Rounded.png";

const ImageMap = {
  orange: boxOrangeImage,
  blue: boxBlueImage,
  white: boxWhiteImage,
} as const;

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  color: keyof typeof ImageMap;
}

export default function Box({
  color,
  children,
  className,
  ...otherProps
}: BoxProps) {
  return (
    <div className={cn("relative z-0", className)} {...otherProps}>
      <img
        className="absolute top-0 left-0 h-full w-full -z-10"
        src={ImageMap[color]}
      />
      {children}
    </div>
  );
}
