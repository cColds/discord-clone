import { PROFILE_PICTURES } from "@/utils/constants/profilePictures";

export const getRandomProfilePic = () => {
  return PROFILE_PICTURES[Math.floor(Math.random() * PROFILE_PICTURES.length)];
};
