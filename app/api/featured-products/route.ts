import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch featured products with their images and categories
    const featuredProducts = await prisma.featuredProduct.findMany({
      where: {
        storefront: "LYLA",
        product: {
          storefront: "LYLA",
        },
      },
      include: {
        product: {
          include: {
            images: true,
            category: true,
            subCategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Most recently featured first
      },
    });

    // Transform the data to match the component's expected format
    const products = featuredProducts.map((featured) => {
      const product = featured.product;
      return {
        id: product.id,
        name: product.name,
        price:
          product.salePercent > 0
            ? `₵${(
                product.price -
                (product.price * product.salePercent) / 100
              ).toFixed(2)}`
            : undefined,
        originalPrice: `₵${product.price.toFixed(2)}`,
        image:
          product.images.length > 0
            ? product.images[0].url
            : "/images/placeholder.jpg",
        description: product.descriptionShort,
        category: product.category.name,
        inStock: product.stock > 0,
        isOnSale: product.salePercent > 0,
        rating: 4.5, // Default rating since it's not in schema
        reviews: 0, // Default reviews count
      };
    });

    return NextResponse.json({
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
