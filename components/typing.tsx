"use client"

import type React from "react";
import { useState, useEffect } from "react";

interface TypingEffectProps {
  sentence: string;
  typingSpeed?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ sentence, typingSpeed = 500 }) => {
  const words = sentence.split(" ");
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => (prev ? prev + " " + words[currentIndex] : words[currentIndex]));
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, words, typingSpeed]);

  return (
    <div>
      <span>{displayedText}</span>
      {currentIndex < words.length && <span className="caret"></span>}
    </div>
  );
};

export default TypingEffect;
