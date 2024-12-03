import ChatBot from "./features/ChatBot";
import { NextUIProvider } from "@nextui-org/system";
import "./App.css";

function App() {
  return (
    <NextUIProvider>
      <div className="app-wrapper">
        <ChatBot />
      </div>
    </NextUIProvider>
  );
}

export default App;
