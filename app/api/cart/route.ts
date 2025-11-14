import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

async function getAuthenticatedUser(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id, storefront: "LYLA" },
      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            size: true,
            priceAtTimeOfAddition: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                salePercent: true,
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
        data: { userId: user.id, storefront: "LYLA" },
        include: {
          cartItems: {
            select: {
              id: true,
              quantity: true,
              size: true,
              priceAtTimeOfAddition: true,
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  salePercent: true,
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
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity, size } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create cart
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id, storefront: "LYLA" },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: user.id, storefront: "LYLA" },
      });
    }

    // Get product to calculate current price
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { price: true, salePercent: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate current price accounting for sale
    const currentPrice =
      product.salePercent > 0
        ? product.price * (1 - product.salePercent / 100)
        : product.price;

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
          priceAtTimeOfAddition: currentPrice,
        },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            size: true,
            priceAtTimeOfAddition: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                salePercent: true,
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

export async function PUT(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find the cart item and ensure it belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: user.id,
          storefront: "LYLA",
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: { id: cartItemId },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findFirst({
      where: { userId: user.id, storefront: "LYLA" },
      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            size: true,
            priceAtTimeOfAddition: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                salePercent: true,
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
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");

    if (!cartItemId) {
      return NextResponse.json(
        { error: "Cart item ID is required" },
        { status: 400 }
      );
    }

    // Find the cart item and ensure it belongs to the user
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId: user.id,
          storefront: "LYLA",
        },
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    // Return updated cart
    const updatedCart = await prisma.cart.findFirst({
      where: { userId: user.id, storefront: "LYLA" },
      include: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            size: true,
            priceAtTimeOfAddition: true,
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                salePercent: true,
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
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
