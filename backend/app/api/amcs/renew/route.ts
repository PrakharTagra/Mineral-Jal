import { connectDB } from "@/lib/mongodb";
import AMC from "@/models/AMC";

export async function POST(req: Request) {

  await connectDB();

  const { amcId } = await req.json();

  const amc = await AMC.findById(amcId);

  const start = new Date();

  const four = new Date(start);
  four.setMonth(start.getMonth() + 4);

  const eight = new Date(start);
  eight.setMonth(start.getMonth() + 8);

  const twelve = new Date(start);
  twelve.setMonth(start.getMonth() + 12);

  const renewed = await AMC.findByIdAndUpdate(
    amcId,
    {
      startDate: start,
      fourMonth: { date: four },
      eightMonth: { date: eight },
      twelveMonth: { date: twelve },
      renewed: true,
    },
    { new: true }
  );

  return Response.json({
    success: true,
    amc: renewed,
  });
}