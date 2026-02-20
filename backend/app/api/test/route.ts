import mongoose from "mongoose";

export async function GET() {
  await mongoose.connect(process.env.MONGO_URI!);

  return new Response(JSON.stringify({ db: "connected" }), {
    headers: { "Content-Type": "application/json" },
  });
}