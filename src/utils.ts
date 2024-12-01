import { SENDER } from "./constants";

export const createMessage = (user: SENDER, text: string) => {
  return {
    sender: user,
    text: text,
    time: new Date().toLocaleString(),
  };
};
