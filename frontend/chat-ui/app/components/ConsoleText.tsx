import React, { useEffect, useRef, useState } from 'react';

interface ConsoleTextProps {
  words: string[];
  id: string;
  colors?: string[];
}

const ConsoleText: React.FC<ConsoleTextProps> = ({ words, id, colors = ['#6D72C3'] }) => {
  const targetRef = useRef<HTMLSpanElement>(null);
  const underscoreRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let letterCount = 1;
    let x = 1;
    let waiting = false;
    let currentWordIndex = 0;
    let currentColorIndex = 0;

    const target = targetRef.current;
    if (!target) return;

    target.style.color = colors[0];

    const textInterval = setInterval(() => {
      if (letterCount === 0 && !waiting) {
        waiting = true;
        target.innerHTML = words[currentWordIndex].substring(0, letterCount);
        setTimeout(() => {
          currentColorIndex = (currentColorIndex + 1) % colors.length;
          currentWordIndex = (currentWordIndex + 1) % words.length;
          x = 1;
          target.style.color = colors[currentColorIndex];
          letterCount += x;
          waiting = false;
        }, 1000);
      } else if (letterCount === words[currentWordIndex].length + 1 && !waiting) {
        waiting = true;
        setTimeout(() => {
          x = -1;
          letterCount += x;
          waiting = false;
        }, 1000);
      } else if (!waiting) {
        target.innerHTML = words[currentWordIndex].substring(0, letterCount);
        letterCount += x;
      }
    }, 120);

    const blinkInterval = setInterval(() => {
      setVisible(v => !v);
    }, 400);

    return () => {
      clearInterval(textInterval);
      clearInterval(blinkInterval);
    };
  }, [words, colors]);

  return (
    <div className="console-container w-full">
      <span id={id} ref={targetRef} className="block"></span>
      <span 
        ref={underscoreRef} 
        className="console-underscore inline-block"
        style={{ visibility: visible ? 'visible' : 'hidden' }}
      >
        &#95;
      </span>
    </div>
  );
};

export default ConsoleText;