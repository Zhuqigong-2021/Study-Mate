import { auth } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import neatPerson from "../assets/neatperson.png";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
        backgroundImage: `url(${neatPerson.src})`,
        backgroundPosition: "center bottom",
        zIndex: -50,
        backgroundSize: "cover",
        objectFit: "contain",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="md:left flex flex-col items-center gap-5 rounded-lg px-5 py-10 md:absolute md:left-[2%] md:top-[20%] md:items-start lg:left-[8%]">
        <div className="flex flex-col items-center gap-6 text-center md:items-start md:text-left">
          <span className="md:items flex flex-col items-center space-y-5 text-2xl font-bold tracking-tight text-slate-800 md:items-start md:text-5xl lg:text-6xl">
            <span className="scale-y-90">Ignite Brilliance Now</span>
            <span className="scale-y-90">Smart Evaluation</span>
            <span className="scale-y-90">Learn Wise</span>
          </span>
        </div>
        <p className="max-w-[440px] py-8 font-sans leading-8 text-slate-800">
          StudyMate: An all-in-one academic app combining note-taking, editing,
          exam prep, and an AI chatbot for interactive learning and efficient
          study management
        </p>
        <Button
          size="lg"
          asChild
          className="hover:white rounded-full bg-gradient-to-br from-teal-300 from-10% via-teal-400 via-30% to-teal-600 to-90% text-white shadow-lg shadow-[#9d824f]"
        >
          <Link href="/notes">start using now</Link>
        </Button>
      </div>
    </main>
  );
}
