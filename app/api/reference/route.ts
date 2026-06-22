

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    new URL("/openapi.json", process.env.NEXTAUTH_URL || "http://localhost:3000")
    );                      
      }

