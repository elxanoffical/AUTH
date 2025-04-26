import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createJWT } from "@/lib/auth";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password)
      return NextResponse.json(
        { mes: "username or password is empty" },
        { status: 400 }
      );

    // find username by username
    const userData = await User.findOne({ username: username });
    if (!userData)
      return NextResponse.json(
        { mes: "username or password is wrong" },
        { status: 400 }
      );

    const checkPasword = await bcrypt.compare(password, userData.password);
    if (!checkPasword)
      return NextResponse.json(
        { mes: "username or password is wrong" },
        { status: 400 }
      );

    const token = await createJWT({ _id: userData._id.toString() });

    return new Response(JSON.stringify({ mes: "Welcome" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
      },
    });
  } catch (error) {
    return NextResponse.json({ mes: error.message }, { status: 500 });
  }
}
