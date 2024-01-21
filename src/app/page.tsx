import { auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();
  if (userId) redirect("/notes");
  return (
    <main
      className="-z-30 flex h-screen flex-col items-center justify-center gap-5"
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        height: "100vh",
        width: "100vw",
      }}
    >
      Hello world
    </main>
  );
}
