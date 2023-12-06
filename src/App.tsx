import { useEffect } from "react";

import { NotionContainer } from "./components";

import "./assets/main.scss";

const App = () => {
  const setVh = () => {
    document.documentElement.style.setProperty(
      "--vh",
      `${window.innerHeight}px`
    );
  };
  useEffect(() => {
    if (!localStorage.getItem("webP_able")) {
      var image = new Image();
      image.onload = function () {
        localStorage.setItem("webP_able", "true");
        image.parentNode?.removeChild(image);
      };
      image.onerror = function () {
        localStorage.setItem("webP_able", "false");
        image.parentNode?.removeChild(image);
      };
      image.src =
        "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";
    }
  }, []);
  useEffect(() => {
    window.addEventListener("resize", setVh);
    setVh();
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return <NotionContainer />;
};

export default App;
