import { connectDB } from "@/lib/mongodb";
import AMC from "@/models/AMC";

export async function GET() {
  await connectDB();

  const amcs = await AMC.find()
    .populate("customerId")
    .populate("roId")
    .sort({ startDate: -1 });

  const now = new Date();

  const formatted = amcs.map((amc) => {
    let status = "ACTIVE";

    if (now > amc.twelveMonth?.date) status = "EXPIRED";
    else if (now > amc.eightMonth?.date) status = "DUE";
    else if (now > amc.fourMonth?.date) status = "DUE";

    return {
      ...amc.toObject(),
      status,
    };
  });

  return Response.json(formatted);
}

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const start = new Date(body.startDate);

  const fourMonth = new Date(start);
  fourMonth.setMonth(start.getMonth() + 4);

  const eightMonth = new Date(start);
  eightMonth.setMonth(start.getMonth() + 8);

  const twelveMonth = new Date(start);
  twelveMonth.setMonth(start.getMonth() + 12);

  const amc = await AMC.create({
    customerId: body.customerId,
    roId: body.roId,
    startDate: start,

    fourMonth: { date: fourMonth },
    eightMonth: { date: eightMonth },
    twelveMonth: { date: twelveMonth },
  });

  return Response.json({
    success: true,
    amc,
  });
}