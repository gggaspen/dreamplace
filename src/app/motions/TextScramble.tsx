"use client";

import React, { useEffect, useRef, useState } from "react";

class TextScrambleClass {
  el: HTMLElement;
  chars: string;
  queue: Array<{
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }>;
  resolve!: () => void;
  frameRequest!: number;
  frame: number;

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.queue = [];
    this.frame = 0;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => {
      this.resolve = resolve as () => void;
    });
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i];
      let { char } = this.queue[i];
      // console.log(from);
      // console.log(to);
      // console.log(start);
      // console.log(end);

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span style="color:#fff;">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Props for TextScramble component
interface TextScrambleProps {
  phrases: string[];
  duration?: number; // Optional duration for the delay between phrases
  className?: string; // Optional class name for styling
}

const TextScramble: React.FC<TextScrambleProps> = ({
  phrases,
  duration = 1800,
  className,
}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted && textRef.current) {
      const fx = new TextScrambleClass(textRef.current);
      const firstPhrase = phrases[0] || "";
      fx.setText(firstPhrase);
    }
  }, [phrases]);

  // useEffect(() => {
  //   if (hasMounted && textRef.current) {
  //     const fx = new TextScrambleClass(textRef.current);
  //     let currentIndex = 0;

  //     const runScramble = async () => {
  //       while (true) {
  //         await fx.setText(phrases[currentIndex]);
  //         currentIndex = (currentIndex + 1) % phrases.length;
  //         await new Promise((resolve) => setTimeout(resolve, duration));
  //       }
  //     };

  //     runScramble();
  //   }
  // }, [hasMounted, phrases, duration]);

  return <div ref={textRef} className={className} />;
};

export default TextScramble;
