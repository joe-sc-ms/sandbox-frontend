import ChatBot from "./features/ChatBot";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
// import { ThemeProvider } from "@fluentui/react/lib/Theme";
import "./App.css";

function App() {
  return (
    <FluentProvider theme={webLightTheme}>
      <div className="app-wrapper">
        <ChatBot />
      </div>
    </FluentProvider>
  );
}

export default App;
