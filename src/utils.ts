import { Message, ROLE } from "./constants";

export const createMessage = (user: ROLE, text: string): Message => {
  return {
    role: user,
    content: text,
    time: new Date().toLocaleString(),
  };
};

export const filterAssetList = (text: string): string[] => {
  const sectionStart = "hostnames-referenced:";
  if (text.includes(sectionStart)) {
    return text.split(sectionStart);
  }
};
