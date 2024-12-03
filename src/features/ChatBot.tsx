import { useCallback, useEffect, useRef, useState } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { Message, ROLE, SEARCH_URL, defaultMessages } from "../constants";
import { createMessage, filterAssetList } from "../utils";
import { Progress } from "@nextui-org/progress";

function Chatbot() {
  const [userQuery, setUserQuery] = useState(
    "I would like an asset to train LLMs with large amounts of data."
  );
  const [messageList, setMessageList] = useState<Message[]>(defaultMessages);
  const [pending, setPending] = useState(false);
  const [hostList, setHostList] = useState<string[] | undefined>();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]); // 'messages' is your state variable containing chat messages

  useEffect(() => {
    console.log("messageList", messageList);
  }, [messageList]);

  useEffect(() => {
    console.log("hostList", hostList);
  }, [hostList]);

  const handleSend = useCallback(async () => {
    const newMessage = createMessage(ROLE.USER, userQuery);
    setMessageList([...messageList, newMessage]);
    setUserQuery("");

    console.log("search url", SEARCH_URL);
    try {
      setPending(true);
      const response = await fetch(
        import.meta.env.DEV ? import.meta.env.VITE_API_URL_LOCAL : SEARCH_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // body: JSON.stringify({ role: "user", query: userQuery }),
          body: JSON.stringify({ messages: [...messageList, newMessage] }),
        }
      );
      console.log("response: ", response);

      if (!response.ok) {
        setMessageList((prev) => [
          ...prev,
          createMessage(
            ROLE.ASSISTANT,
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

          const messageList = filterAssetList(messageContent);

          setMessageList((prevMessages) => [
            ...prevMessages,
            createMessage(ROLE.ASSISTANT, messageList[0]),
          ]);

          if (messageList.length === 2) {
            setHostList(uniqueList(messageList[1], hostList));
          }
        }
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [messageList, userQuery]);

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
  }, [handleSend, userQuery]);

  const uniqueList = (
    hostString: string,
    existingList?: string[]
  ): string[] => {
    existingList = existingList || [];
    const newList = hostString.trim().split(",");
    const newSet = new Set([...newList, ...existingList]);
    return [...newSet];
  };

  return (
    <div className="chat-app-wrapper">
      {import.meta.env.DEV ? "devmode" : "not dev mode"}
      <div className="title-section">
        <h2>Research Asset Guide</h2>
        <p>
          An AI agent to help find compute resources for your research needs.
        </p>
      </div>
      <div className="chat-message-box">
        {messageList.map((msg, index) => (
          <div
            key={index}
            className={
              "chat-message" + (msg.role === "assistant" ? " ai-message" : "")
            }
            ref={index === messageList.length - 1 ? messagesEndRef : null}
          >
            <div className="header">
              <span className="sender">{msg.role.toUpperCase()}:</span>
              <div className="timestamp">{msg.time}</div>
            </div>

            <div className="message">
              <MarkdownRenderer content={msg.content} />
            </div>
          </div>
        ))}

        {pending && (
          <div className="chat-message pending">
            Retrieving answer...
            <Progress aria-label="Loading..." value={60} className="max-w-md" />
          </div>
        )}
        <div className={"chat-actions"}>
          {hostList &&
            hostList.length > 0 &&
            hostList.map((host) => (
              <button
                className={"host-buttons"}
                onClick={() => alert(`Reserve: ${host}`)}
                aria-label="reserve asset"
                title={"Reserve asset"}
                key={host}
              >
                {host}
              </button>
            ))}
        </div>
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
