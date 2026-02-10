import { connectDB } from "@/lib/db";
import User from "@/lib/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const user = await User.findOne({ email: body.email });

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Login success", user });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
