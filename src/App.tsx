import ChatBot from "./features/ChatBot";
import "./App.css";

function App() {
  return (
    <div className="chat-app-wrapper">
      <div className="title-section">
        <h2>RESEARCH ASSET AGENT</h2>
        <p>
          An AI agent that can help find available compute assets for user's
          research needs.
        </p>
      </div>
      <div>
        <div>
          <ChatBot />
        </div>
      </div>
    </div>
  );
}

export default App;
