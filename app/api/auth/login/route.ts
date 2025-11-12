import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email and storefront
    const user = await prisma.user.findUnique({
      where: {
        email_storefront: {
          email,
          storefront: "LYLA",
        },
      },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret";
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "7d" }
    );

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set token in httpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    console.log("Login API: user from database:", {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      phone: user.phone,
      role: user.role,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
