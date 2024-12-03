import { createMessage } from "./utils";

export enum ROLE {
  ASSISTANT = "assistant",
  USER = "user",
}

export type Message = {
  content: string;
  role: ROLE;
  time: string;
};

export const testMessages = [
  {
    content: "how many assets are available today to reserve?",
    role: ROLE.USER,
    time: "6:41:40 AM",
  },
  {
    content:
      "There are three assets available for reservation today:\n\n1. **mock-asset-9qdum**\n   - System RAM: 800 GB\n   - Local Disk: 7000 GB\n   - CPU: GenuineIntel\n   - GPU: 2x Titan V\n   - Location: Redmond Ridge\n   - OS: Ubuntu 22.04 LTS\n\n2. **mock-asset-xpty5**\n   - System RAM: 64 GB\n   - Local Disk: 1000 GB\n   - CPU: Intel Xeon E5-2673 v3 2.40GHz (2 Procs)\n   - GPU: None\n   - Location: West US 2\n   - OS: Ubuntu 22.04 LTS\n\n3. **mock-asset-q6ohw**\n   - System RAM: 800 GB\n   - Local Disk: 7000 GB\n   - CPU: GenuineIntel\n   - GPU: Titan V\n   - Location: Redmond Ridge\n   - OS: Ubuntu 22.04 LTS\n\nAll of these assets are not restricted and have no reserved dates, meaning they are available for immediate reservation.",
    role: ROLE.ASSISTANT,
    time: "6:42:40 AM",
  },
];

const greeting =
  "Hello! I am the Research Asset Guide. How can I help you today?";
export const defaultMessages = [createMessage(ROLE.ASSISTANT, greeting)];

export const SEARCH_URL =
  "https://vjchildress-test-aicalls.azurewebsites.net/api/AssetSearchAgent";

export const SEARCH_URL_LOCAL = "http://localhost:7071/api/AssetSearchAgent";
