import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getActiveStorewideSale() {
  try {
    const activeSale = await prisma.storewideSale.findFirst({
      where: {
        isActive: true,
        storefront: "LYLA",
      },
      select: {
        discountPercent: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return activeSale;
  } catch (error) {
    console.error("Error fetching active storewide sale:", error);
    return null;
  }
}
