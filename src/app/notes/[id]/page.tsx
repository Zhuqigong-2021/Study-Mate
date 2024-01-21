import CreateQuestion from "@/components/CreateQuestion";
import React from "react";

export interface idProps {
  params: { id: number };
}
const page = ({ params }: idProps) => {
  const { id } = params;
  return (
    <div>
      <CreateQuestion params={{ id }} />
    </div>
  );
};

export default page;
