import { connectDB } from "@/lib/db";
import  User  from "../../../lib/models/User";
import { NextResponse } from "next/server";
import {z} from 'zod'

const userSchema = z.object({
    name: z.string().min(3).max(10),
    age: z.number().min(18).max(100),
    username: z.string().min(4).max(12),
    password: z.string().min(6).max(16)
})

export async function POST(req) {
    try {
        await connectDB()

        // take body
        const body = await req.json()
        console.log(body)

        // check body
        const parsedBody = userSchema.safeParse(body)
        if(!parsedBody.success){
            const errors = parsedBody.error.errors.map(err => ({
                message: err.message,
                path: err.path[0]
            }));
            return NextResponse.json({mes:"Form Validation error",errors},{status: 400})
        }

        // create User model with body
        const userModel = await new User({
            name: body.name,
            age: body.age,
            username: body.username,
            password: body.password
        })

        await userModel.save()


        return NextResponse.json({ mes: "Test USER POST Success!" }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ mes: error.message }, { status: 500 });
    }
}