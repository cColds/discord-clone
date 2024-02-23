import "dotenv/config";
import User from "@/models/User";
import mongoose from "mongoose";

export async function addFieldToAllDocs(field: Object) {
  await mongoose.connect(process.env.MONGODB_URI as string, {
    bufferCommands: false,
  });
  try {
    await User.updateMany({}, { $set: field });

    console.log("Updated successfully!");
  } catch (err) {
    console.error("Failed to update docs", err);
  }

  await mongoose.disconnect();
}

const field = { online: false }; // idk just change this if u need to add new fields to all docs

addFieldToAllDocs(field);
