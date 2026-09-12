import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: "#1d4ed8",
          borderRadius: 6,
          fontFamily:
            "'Inter', 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
