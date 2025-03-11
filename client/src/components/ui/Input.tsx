import { InputHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/utils/style";
import inputGreyImage from "../../assets/backgrounds/inputs/ButtonText_TextInput.png";
import inputWhiteImage from "../../assets/backgrounds/inputs/ButtonText_Blank_TextField.png";

const ImageMap = {
  white: inputWhiteImage,
  grey: inputGreyImage,
} as const;

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  color?: keyof typeof ImageMap;
  readonly?: boolean;
}

export default function Input({
  className,
  color = "white",
  readOnly = false,
  children,
  ...otherProps
}: PropsWithChildren<InputProps>) {
  return (
    <div className="relative w-full z-0">
      {readOnly ? (
        <div className={cn("rounded-md py-4 px-6  outline-0", className)}>
          {children}
        </div>
      ) : (
        <input
          className={cn("rounded-md py-4 px-6  outline-0", className)}
          {...otherProps}
        />
      )}
      <img
        className="absolute top-0 left-0 h-full w-full -z-10"
        src={ImageMap[color]}
      />
    </div>
  );
}
