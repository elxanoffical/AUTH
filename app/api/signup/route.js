import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const userSchema = z.object({
  name: z.string().min(3).max(10),
  age: z.number().min(18).max(100),
  username: z.string().min(4).max(12),
  password: z.string().min(6).max(16),
});

export async function POST(req) {
  try {
    await connectDB();

    // take body
    const body = await req.json();
    // check body
    const parsedBody = userSchema.safeParse(body);
    if (!parsedBody.success) {
      const errors = parsedBody.error.errors.map((err) => ({
        message: err.message,
        path: err.path[0],
      }));
      return NextResponse.json(
        { mes: "Form Validation error", errors },
        { status: 400 }
      );
    }

    // check is user exist
    const findUser = await User.findOne({ username: body.username });
    if (findUser) {
      return NextResponse.json(
        { mes: "This username is already exist" },
        { status: 400 }
      );
    }

    // hash user password
    const currentPassword = body.password;
    const salt = await bcrypt.genSalt(14);
    const hashedPassword = await bcrypt.hash(currentPassword, salt);

    // create User model with body
    const userModel = await new User({
      name: body.name,
      age: body.age,
      username: body.username,
      password: hashedPassword,
    });

    await userModel.save();

    return NextResponse.json(
      { mes: "User added successfully!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ mes: error.message }, { status: 500 });
  }
}
