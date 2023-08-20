import React, { useEffect } from "react";
import NotionRouter from "./route/NotionRouter";
import "./assets/main.scss";
const App = () => {
  const setVh = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight}px`
    );
  };
  useEffect(() => {
    window.addEventListener("resize", setVh);
    setVh();
    return () => window.removeEventListener("resize", setVh);
  });

  return <NotionRouter />;
};

export default App;
