import { HTMLAttributes, PropsWithChildren } from "react";
import Banner, { BannerProps } from "./Banner";
import { cn } from "../../lib/utils/style";
import Box, { BoxProps } from "./Box";

interface DialogProps extends HTMLAttributes<HTMLDialogElement> {
  open: boolean;
  boxProps?: BoxProps;
}

export const Dialog: React.FC<DialogProps> = ({
  className,
  open,
  boxProps = {} as Partial<BoxProps>,
  children,
  ...otherProps
}) => {
  const { className: boxClassName, ...otherBoxProps } = boxProps;
  return (
    <dialog
      open={open}
      className={cn(
        "h-screen w-screen bg-clip-padding backdrop-filter backdrop-blur-md bg-transparent",
        className
      )}
      {...otherProps}
    >
      <Box
        color="orange"
        className={cn(
          "py-10 px-14 md:py-16 md:px-24 flex flex-col items-center absolute top-1/2 left-1/2 -translate-1/2  bg-transparent",
          boxClassName
        )}
        {...otherBoxProps}
      >
        {children}
      </Box>
    </dialog>
  );
};

export const DialogHeader: React.FC<PropsWithChildren<BannerProps>> = ({
  className,
  children,
  ...otherProps
}) => {
  return (
    <Banner
      color="orange"
      className={cn(
        "text-3xl pt-6 pb-8 px-10 md:pt-8 md:pb-12 md:px-16 md:text-4xl text-center absolute -top-8 md:-top-12",
        className
      )}
      {...otherProps}
    >
      {children}
    </Banner>
  );
};
