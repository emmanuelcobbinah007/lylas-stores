import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: {
        storefront: "LYLA",
      },
      include: {
        subCategories: true,
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Server Error",
        error: error,
      },
      { status: 500 }
    );
  }
}
