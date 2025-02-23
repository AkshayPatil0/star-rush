import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils/style";
import boxOrangeImage from "../../assets/backgrounds/box/Box_Orange_Rounded.png";

const ImageMap = {
  orange: boxOrangeImage,
} as const;

interface BoxProps {
  color: keyof typeof ImageMap;
}

export default function Box({
  color,
  children,
  className,
  ...otherProps
}: HTMLAttributes<HTMLDivElement> & BoxProps) {
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
