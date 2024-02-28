import { SessionUser } from "./SessionUser";
import { SocialPopulated } from "./social";

export type User = SessionUser & SocialPopulated;
