import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { code, userId, orderTotal } = await request.json();

    if (!code || !userId) {
      return NextResponse.json(
        { error: "Promo code and user ID are required" },
        { status: 400 }
      );
    }

    // Find the promo code
    const promoCode = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!promoCode) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 400 }
      );
    }

    // Check if promo code is active
    if (!promoCode.isActive) {
      return NextResponse.json(
        { error: "Promo code is not active" },
        { status: 400 }
      );
    }

    // Check if promo code has expired
    if (promoCode.expiresAt && promoCode.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "Promo code has expired" },
        { status: 400 }
      );
    }

    // Check usage limits
    if (promoCode.usageLimit !== null) {
      const totalUsages = await prisma.promoCodeUsage.count({
        where: { promoCodeId: promoCode.id },
      });

      if (totalUsages >= promoCode.usageLimit) {
        return NextResponse.json(
          { error: "Promo code usage limit exceeded" },
          { status: 400 }
        );
      }
    }

    // Check per-user limits
    if (promoCode.perUserLimit !== null) {
      const userUsages = await prisma.promoCodeUsage.count({
        where: {
          promoCodeId: promoCode.id,
          userId,
        },
      });

      if (userUsages >= promoCode.perUserLimit) {
        return NextResponse.json(
          {
            error:
              "You have already used this promo code the maximum number of times",
          },
          { status: 400 }
        );
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promoCode.discountType === "PERCENTAGE") {
      discountAmount = (orderTotal * promoCode.discountValue) / 100;
    } else {
      discountAmount = promoCode.discountValue;
    }

    // Ensure discount doesn't exceed order total
    discountAmount = Math.min(discountAmount, orderTotal);

    return NextResponse.json({
      success: true,
      discount: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
        discountAmount,
      },
    });
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
