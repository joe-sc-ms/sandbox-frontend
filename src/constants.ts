import { createMessage } from "./utils";

export enum SENDER {
  AGENT = "agent",
  USER = "user",
}

export type Message = {
  text: string;
  sender: SENDER;
  time: string;
};

export const testMessages = [
  {
    text: "how many assets are available today to reserve?",
    sender: SENDER.USER,
    time: "6:41:40 AM",
  },
  {
    text: "There are three assets available for reservation today:\n\n1. **mock-asset-9qdum**\n   - System RAM: 800 GB\n   - Local Disk: 7000 GB\n   - CPU: GenuineIntel\n   - GPU: 2x Titan V\n   - Location: Redmond Ridge\n   - OS: Ubuntu 22.04 LTS\n\n2. **mock-asset-xpty5**\n   - System RAM: 64 GB\n   - Local Disk: 1000 GB\n   - CPU: Intel Xeon E5-2673 v3 2.40GHz (2 Procs)\n   - GPU: None\n   - Location: West US 2\n   - OS: Ubuntu 22.04 LTS\n\n3. **mock-asset-q6ohw**\n   - System RAM: 800 GB\n   - Local Disk: 7000 GB\n   - CPU: GenuineIntel\n   - GPU: Titan V\n   - Location: Redmond Ridge\n   - OS: Ubuntu 22.04 LTS\n\nAll of these assets are not restricted and have no reserved dates, meaning they are available for immediate reservation.",
    sender: SENDER.AGENT,
    time: "6:42:40 AM",
  },
];

const greeting =
  "Hello! I am the Research Asset Guide. How can I help you today?";
export const defaultMessages = [createMessage(SENDER.AGENT, greeting)];

export const SEARCH_URL =
  "https://vjchildress-test-aicalls.azurewebsites.net/api/AssetSearchAgent";
