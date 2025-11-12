import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Get userId from query or header, for now assume from query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId, storefront: "LYLA" },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, storefront: "LYLA" },
        include: {
          cartItems: {
            include: {
              product: {
                include: {
                  images: true,
                  category: true,
                },
              },
            },
          },
        },
      });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, productId, quantity, size } = body;

    if (!userId || !productId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId, storefront: "LYLA" },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, storefront: "LYLA" },
      });
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          size,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          include: {
            product: {
              include: {
                images: true,
                category: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
