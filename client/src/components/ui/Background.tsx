import { PropsWithChildren } from "react";

export default function Background({ children }: PropsWithChildren) {
  return (
    <div className="home h-screen w-screen flex flex-col items-center justify-center gap-20">
      {children}
    </div>
  );
}
