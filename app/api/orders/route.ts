import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@/generated/prisma";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Types for the API responses
interface OrderItemWithProduct {
  id: string;
  quantity: number;
  size: string | null;
  priceAtTimeOfOrder: number | null;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: { name: string };
  };
}

interface OrderWithItems {
  id: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemWithProduct[];
}

interface OrderWithTotals extends OrderWithItems {
  total: number;
  itemCount: number;
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { shippingInfo, paymentReference, totalAmount, promoCode } = body;

    // Get authenticated user
    const cookies = request.cookies;
    const token = cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Validate required fields
    if (!shippingInfo || !paymentReference) {
      return NextResponse.json(
        { error: "Missing required fields: shippingInfo, paymentReference" },
        { status: 400 }
      );
    }

    // Start a transaction to ensure data consistency
    const order = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Get user's cart items
        const cartItems = await tx.cartItem.findMany({
          where: {
            cart: {
              userId,
            },
          },
          include: {
            product: true,
          },
        });

        if (cartItems.length === 0) {
          throw new Error("Cart is empty");
        }

        // Calculate subtotal for discount validation
        const subtotal = cartItems.reduce(
          (total, item) =>
            total +
            (item.priceAtTimeOfAddition || item.product.price) * item.quantity,
          0
        );

        // Calculate discount if promo code is provided
        let discountAmount = 0;
        let promoCodeRecord = null;
        if (promoCode) {
          promoCodeRecord = await tx.promoCode.findUnique({
            where: { code: promoCode.toUpperCase() },
          });

          if (promoCodeRecord) {
            if (promoCodeRecord.discountType === "PERCENTAGE") {
              discountAmount = (subtotal * promoCodeRecord.discountValue) / 100;
            } else {
              discountAmount = promoCodeRecord.discountValue;
            }
            // Ensure discount doesn't exceed subtotal
            discountAmount = Math.min(discountAmount, subtotal);
          }
        }

        // Validate that the provided totalAmount matches our calculation
        const expectedTotal = subtotal - discountAmount;
        if (Math.abs(totalAmount - expectedTotal) > 0.01) {
          // Allow for small rounding differences
          throw new Error("Total amount mismatch");
        }

        // Create the order with shipping info and validated total
        const newOrder = await tx.order.create({
          data: {
            userId,
            storefront: "LYLA",
            status: "PENDING", // Use PENDING instead of PAID until confirmed
            shippingFirstName: shippingInfo.firstName,
            shippingLastName: shippingInfo.lastName,
            shippingEmail: shippingInfo.email,
            shippingStreetAddress: shippingInfo.streetAddress,
            shippingCity: shippingInfo.city,
            shippingPostalCode: shippingInfo.postalCode,
            paymentReference,
            totalAmount,
          },
        });

        // Create order items with preserved prices
        await Promise.all(
          cartItems.map((cartItem) => {
            return tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                size: cartItem.size,
                priceAtTimeOfOrder: cartItem.priceAtTimeOfAddition,
              },
            });
          })
        );

        // Handle promo code usage if provided
        if (promoCodeRecord) {
          // Create promo code usage record
          await tx.promoCodeUsage.create({
            data: {
              promoCodeId: promoCodeRecord.id,
              userId,
              orderId: newOrder.id,
              discountApplied: discountAmount,
            },
          });
        }

        // Clear the cart
        await tx.cartItem.deleteMany({
          where: {
            cart: {
              userId,
            },
          },
        });

        // Return the created order with items
        return await tx.order.findUnique({
          where: { id: newOrder.id },
          include: {
            orderItems: {
              include: {
                product: true,
              },
            },
          },
        });
      }
    );

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

// Get user orders
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const cookies = request.cookies;
    const token = cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      userId = decoded.userId;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Extract pagination parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch orders with pagination and count
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          orderItems: {
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
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.order.count({
        where: {
          userId,
        },
      }),
    ]);

    // Transform the orders to include calculated totals
    const ordersWithTotals: OrderWithTotals[] = orders.map(
      (order: OrderWithItems) => ({
        ...order,
        total: order.orderItems.reduce(
          (sum: number, item: OrderItemWithProduct) =>
            sum +
            (item.priceAtTimeOfOrder || item.product.price) * item.quantity,
          0
        ),
        itemCount: order.orderItems.reduce(
          (sum: number, item: OrderItemWithProduct) => sum + item.quantity,
          0
        ),
      })
    );

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      orders: ordersWithTotals,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
