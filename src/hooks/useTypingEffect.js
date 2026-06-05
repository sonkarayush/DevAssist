import { useEffect, useState } from "react";

function useTypingEffect(text = "", speed = 18) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");

    if (!text) return;

    let index = 0;
    const interval = window.setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index += 1;

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, speed]);

  return displayedText;
}

export default useTypingEffect;
