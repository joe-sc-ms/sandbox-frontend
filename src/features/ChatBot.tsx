import { useCallback, useEffect, useRef, useState } from "react";
import MarkdownRenderer from "../components/MarkdownRenderer";
import {
  Message,
  ROLE,
  SEARCH_URL,
  defaultMessages,
  SEARCH_URL_LOCAL,
} from "../constants";
import { Button, Field, ProgressBar } from "@fluentui/react-components";
import { Stack } from "@fluentui/react";
import {
  capFirstLetter,
  checkParam,
  createMessage,
  filterAssetList,
} from "../utils";
import JSONPretty from "react-json-pretty";
import { IResponse } from "../interfaces";

function Chatbot() {
  const [userQuery, setUserQuery] = useState(
    "I would like an asset to train LLMs with large amounts of data."
  );

  type Views = "chat" | "data-messages" | "data-responses";
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [hostList, setHostList] = useState<string[] | undefined>();
  const [responseList, setResponseList] = useState<IResponse[]>([]);
  const [view, setView] = useState<Views>("chat");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document
      .querySelectorAll(".state-response span.__json-key__")
      .forEach((span) => {
        if (span.textContent && span.textContent.trim() === "description") {
          if (span.nextElementSibling) {
            span.nextElementSibling.classList.add("description-content");
          }
        }
      });
  }, [messageList]);

  useEffect(() => {
    scrollToBottom();
    console.log("messageList", messageList);
  }, [messageList]);

  useEffect(() => {
    console.log("responseList", responseList);
  }, [responseList]);

  useEffect(() => {
    console.log("hostList", hostList);
  }, [hostList]);

  const environmentUrl = checkParam("local") ? SEARCH_URL_LOCAL : SEARCH_URL;
  console.log("search url", environmentUrl);

  const handleSend = useCallback(async () => {
    const newMessage = createMessage(ROLE.USER, userQuery);
    setMessageList([...messageList, newMessage]);
    setUserQuery("");
    // const userInfo = " | user_id:42";
    // newMessage.content = newMessage.content + userInfo;
    try {
      setPending(true);
      const response = await fetch(environmentUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messageList, newMessage],
        }),
      });
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
      // setResponseList(prev => [...prev, data]);
      console.log("response data", data);
      setResponseList((prev) => [...prev, data]);

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
  }, [hostList, messageList, userQuery]);

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
      <div className="title-section-wrapper">
        <h2>Research Asset Guide</h2>
        <p>
          An AI agent to help find compute resources for your research needs.
        </p>
      </div>
      {view === "data-messages" && (
        <Stack className="data-view messages-wrapper">
          <Stack horizontal horizontalAlign="center" className="title">
            Messages Data
          </Stack>
          <Stack className="data-box">
            {messageList.map((msg, index) => (
              <div key={index} className="state-message">
                {/* {JSON.stringify(msg, null, 2)} */}
                <JSONPretty className="json-pretty" data={msg}></JSONPretty>
              </div>
            ))}
          </Stack>
        </Stack>
      )}
      {view === "data-responses" && (
        <Stack className="data-view responses-wrapper">
          {" "}
          <Stack horizontal horizontalAlign="center" className="title">
            Responses Data
          </Stack>
          <Stack className="data-box">
            {responseList.map((msg, index) => (
              <div key={index} className="state-response">
                {/* {JSON.stringify(msg, null, 2)} */}
                <JSONPretty className="json-pretty" data={msg}></JSONPretty>
              </div>
            ))}
          </Stack>
        </Stack>
      )}
      {view === "chat" && (
        <div className="chat-message-box">
          <Stack>
            {defaultMessages.map((msg, index) => (
              <div
                key={index}
                className={
                  "chat-message" +
                  (msg.role === "assistant" ? " ai-message" : "")
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
            {messageList.map((msg, index) => (
              <div
                key={index}
                className={
                  "chat-message" +
                  (msg.role === "assistant" ? " ai-message" : "")
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
                {" "}
                <Field
                  validationMessage="Retrieving your answer..."
                  validationState="none"
                >
                  <ProgressBar />
                </Field>
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
          </Stack>
        </div>
      )}
      <form onSubmit={(e) => e.preventDefault()} className="chat-form">
        <div className="input-wrapper">
          <textarea
            className="input-box"
            placeholder="Message agent..."
            value={userQuery}
            onChange={(e) => setUserQuery(capFirstLetter(e.target.value))}
            rows={5}
          />
          <div className="msg-btn-section">
            <button
              className="msg-btn clear"
              onClick={() => {
                setMessageList([]);
                setHostList([]);
                setPending(false);
              }}
            >
              Clear
            </button>
            <button
              onClick={handleSend}
              className="msg-btn send"
              disabled={!userQuery}
            >
              Send
            </button>
          </div>
        </div>
      </form>
      <Stack
        className="admin-controls"
        horizontal
        horizontalAlign="center"
        tokens={{ childrenGap: 10 }}
      >
        <Button
          size="medium"
          appearance="transparent"
          className={"view-chat" + (view === "chat" ? " selected" : "")}
          onClick={() => {
            setView("chat");
          }}
        >
          Chat
        </Button>
        <Button
          size="medium"
          appearance="transparent"
          className={
            "view-messages" + (view === "data-messages" ? " selected" : "")
          }
          onClick={() => {
            setView("data-messages");
          }}
        >
          Messages
        </Button>
        <Button
          appearance="transparent"
          size="medium"
          className={
            "view-responses" + (view === "data-responses" ? " selected" : "")
          }
          onClick={() => {
            setView("data-responses");
          }}
        >
          Responses
        </Button>
      </Stack>
    </div>
  );
}
export default Chatbot;
