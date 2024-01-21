import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, questions } = body;
    const { userId } = auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const note = await prisma.note.create({
      data: {
        title,
        description,
        questions: { create: [] },
        userId,
      },
    });
    return Response.json({ note }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "internal server error " },
      { status: 500 },
    );
  }
}
