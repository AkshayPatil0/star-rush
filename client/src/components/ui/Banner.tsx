import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils/style";
import bannerOrangeImage from "../../assets/backgrounds/banners/Banner_Orange.png";
import btnWhiteImage from "../../assets/backgrounds/buttons/ButtonText_Small_Blank_Round.png";
import btnGreyImage from "../../assets/backgrounds/buttons/ButtonText_Small_GreyOutline_Round.png";

const ImageMap = {
  orange: bannerOrangeImage,
  white: btnWhiteImage,
  grey: btnGreyImage,
} as const;

export interface BannerProps extends HTMLAttributes<HTMLHeadingElement> {
  color?: keyof typeof ImageMap;
  children: string;
}

export default function Banner({
  color = "white",
  children,
  className,
  ...otherProps
}: BannerProps) {
  return (
    <h1
      className={cn("relative z-0 font-title text-xl", className)}
      {...otherProps}
    >
      <img
        className="absolute top-0 left-0 h-full w-full -z-10"
        src={ImageMap[color]}
      />
      {children}
    </h1>
  );
}
