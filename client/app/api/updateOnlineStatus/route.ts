import dbConnect from "@/lib/db/dbConnect";
import User from "@/models/User";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    userId: string;
    isOnline: number;
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, isOnline } = body;

  const statusAction = isOnline ? "online" : "offline";
  console.log(
    `User ${userId} went ${statusAction} at ${new Date().toISOString()}`
  );

  await dbConnect();
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        online: isOnline,
      },
      { new: true }
    );
    console.log("Updated user online status: ", updatedUser?.online);
    return NextResponse.json(updatedUser);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
