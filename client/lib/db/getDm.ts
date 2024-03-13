"use server";

import { DmType } from "@/types/user";
import dbConnect from "./dbConnect";
import Dm from "@/models/Dm";

export async function getDm(id?: string) {
  if (!id) return null;

  await dbConnect();
  const dm = await Dm.findById(id).populate("members");
  const serializedDm = JSON.parse(JSON.stringify(dm)) as DmType;

  return serializedDm;
}
