import mongoose from "mongoose";

export const isIdInArray = (
  ids: mongoose.Types.ObjectId[],
  idToFind: string
) => {
  return ids.find((id) => idToFind === id.toString());
};
