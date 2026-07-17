import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const assessment = await prisma.assessment.findUnique({
    where: { id: params.id },
  });

  if (!assessment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(assessment, { status: 200 });
}
