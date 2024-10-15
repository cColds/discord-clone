import { welcomeMessages } from "../constants/welcomeMessages";

export const getRandomWelcomeMessage = () =>
  welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
