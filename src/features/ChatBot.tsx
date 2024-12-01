import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { Message, SENDER, SEARCH_URL, defaultMessages } from "../constants";
import { createMessage } from "../utils";

function Chatbot() {
  const [userQuery, setUserQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
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

  const handleSend = async () => {
    const newMessage = createMessage(SENDER.USER, userQuery);
    setMessages([...messages, newMessage]);
    setUserQuery("");

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

  return (
    <div className="chat-app-wrapper">
      <div className="title-section">
        <h2>Research Asset Guide</h2>
        <p>
          An AI agent to help find compute resources for your research needs.
        </p>
      </div>
      <div className="chat-message-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              "chat-message" + (msg.sender === "agent" ? " ai-message" : "")
            }
            ref={index === messages.length - 1 ? messagesEndRef : null}
          >
            <div className="header">
              <span className="sender">{msg.sender.toUpperCase()}:</span>
              <div className="timestamp">{msg.time}</div>
            </div>

            <div className="message">
              <MarkdownRenderer content={msg.text} />
            </div>
          </div>
        ))}
        {pending && (
          <div className="chat-message pending">Retrieving answer...</div>
        )}
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="chat-form">
        <div className="input-wrapper">
          <textarea
            className="input-box"
            placeholder="Message agent..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            rows={5}
          />
          <div className="msg-btn-section">
            <button onClick={handleSend} className="msg-btn send">
              Send
            </button>
            {/* <button
                className="msg-btn clear"
                onClick={() => {
                  setMessages([]);
                  setPending(false);
                }}
              >
                Clear
              </button> */}
          </div>
        </div>
      </form>
    </div>
  );
}
export default Chatbot;
