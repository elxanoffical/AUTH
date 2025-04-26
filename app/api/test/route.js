import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();

  return NextResponse.json({ mes: "User added successfully" }, { status: 201 });
}
