import { connectDB } from "@/lib/mongodb";
import AMC from "@/models/AMC";
import Customer from "@/models/Customer";
import RO from "@/models/RO";

export async function POST(req: Request) {

  await connectDB();

  const body = await req.json();

  const { amcId, checkpoint, partsUsed, notes, billAmount } = body;

  const update = {
    [`${checkpoint}.completed`]: true,
    [`${checkpoint}.completedOn`]: new Date(),
    [`${checkpoint}.partsUsed`]: partsUsed || [],
    [`${checkpoint}.notes`]: notes || "",
    [`${checkpoint}.billAmount`]: billAmount || 0,
  };

  const updated = await AMC.findByIdAndUpdate(
    amcId,
    { $set: update },
    { new: true }
  );

  return Response.json({
    success: true,
    amc: updated,
  });
}