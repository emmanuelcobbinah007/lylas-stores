import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    if (!email && !userId) {
      return NextResponse.json(
        { error: "Email or userId is required" },
        { status: 400 }
      );
    }

    let existingEntry = null;

    if (userId) {
      existingEntry = await prisma.emailList.findFirst({
        where: {
          userId: userId,
          storefront: "LYLA",
        },
      });
    } else if (email) {
      existingEntry = await prisma.emailList.findFirst({
        where: {
          email: email,
          storefront: "LYLA",
        },
      });
    }

    return NextResponse.json({
      isSubscribed: !!existingEntry,
      subscription: existingEntry,
    });
  } catch (error) {
    console.error("Error checking email subscription:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, userId } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existingEntry = await prisma.emailList.findFirst({
      where: {
        email: email,
        storefront: "LYLA",
      },
    });

    if (existingEntry) {
      return NextResponse.json({
        message: "Already subscribed",
        subscription: existingEntry,
      });
    }

    const newSubscription = await prisma.emailList.create({
      data: {
        email: email,
        userId: userId || null,
        storefront: "LYLA",
      },
    });

    return NextResponse.json({
      message: "Successfully subscribed",
      subscription: newSubscription,
    });
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
