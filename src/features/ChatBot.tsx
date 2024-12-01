import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";

enum SENDER {
  AGENT = "agent",
  USER = "user",
}

type Message = {
  text: string;
  sender: SENDER;
  time: string;
};

const testMessages = [
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

function Chatbot() {
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>(testMessages);
  const [pending, setPending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // 'messages' is your state variable containing chat messages

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const createMessage = (user: SENDER, text: string) => {
    return {
      sender: user,
      text: text,
      time: new Date().toLocaleString(),
    };
  };

  const handleSend = async () => {
    const newMessage = createMessage(SENDER.USER, userQuery);
    setMessages([...messages, newMessage]);
    setUserQuery("");

    const SEARCH_URL =
      import.meta.env.VITE_API_URL + import.meta.env.VITE_API_AISEARCH; //"http://localhost:7071/api/AssetSearchAgent";
    console.log("search url", SEARCH_URL);
    try {
      setPending(true);
      const response = await fetch(SEARCH_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "user", query: userQuery }),
      });
      console.log("response: ", response);

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          createMessage(
            SENDER.AGENT,
            "There was an error completing your request."
          ),
        ]);
        setPending(false);
        console.error("Error with service response", response);
        return;
      }

      const data = await response.json();

      console.log("response data", data);

      try {
        const messageContent = data.message.content;
        console.log("message content", messageContent);

        if (messageContent) {
          setPending(false);
          setMessages((prevMessages) => [
            ...prevMessages,
            createMessage(SENDER.AGENT, messageContent),
          ]);
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && userQuery.trim()) {
        event.preventDefault();
        handleSend();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [userQuery]);

  const titleStyle = {
    fontSize: ".8em",
    fontWeight: "bold",
  };

  const dateStyle = {
    fontSize: ".5em",
    fontWeight: "light",
  };

  return (
    <div>
      <div className="chat-message-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              "chat-message" + (msg.sender === "agent" ? " ai-message" : "")
            }
            ref={index === messages.length - 1 ? messagesEndRef : null}
          >
            <span style={titleStyle}>{msg.sender.toUpperCase()}:</span>
            <div style={dateStyle}>{msg.time}</div>
            <MarkdownRenderer content={msg.text} />
          </div>
        ))}
        {pending && (
          <div className="chat-message pending">Retrieving answer...</div>
        )}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <textarea
            className="input-box chat-input"
            placeholder="Message agent..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            style={{ marginBottom: "8px", padding: "20px" }}
          />
        </div>

        <div>
          <button onClick={handleSend} className="send-btn">
            Send
          </button>
          <button
            onClick={() => {
              setMessages([]);
              setPending(false);
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
export default Chatbot;
