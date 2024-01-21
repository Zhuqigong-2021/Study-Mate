import Pie from "@/components/Pie";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = ({
  searchParams,
}: {
  searchParams: { correct: string; total: string; result: string };
}) => {
  let wrong = Number(searchParams.total) - Number(searchParams.correct);
  return (
    <div
      className="top-50% -transalte-y-[50%] absolute left-[50%] flex w-full -translate-x-[50%] flex-col items-center justify-center"
      suppressHydrationWarning={true}
    >
      <h2 className="mb-8 text-xl font-bold text-green-600">
        {Number(searchParams.correct) / Number(searchParams.total) === 1 &&
          "Congratulations you got full mark !!!"}
      </h2>
      <Pie right={Number(searchParams.correct)} wrong={wrong} />
      <p className="text-red-500">{Number(searchParams.result) + "%"}</p>
      <Button asChild className="mt-4">
        <Link href="/exam">back</Link>
      </Button>
    </div>
  );
};

export default page;
