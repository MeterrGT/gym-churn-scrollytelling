'use client';
import { useState, useEffect } from 'react';

export function useTypingEffect(
  text: string,
  typingSpeed: number = 65,
  deletingSpeed: number = 30,
  pauseDelay: number = 2600
) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (charIndex < text.length) {
        timer = setTimeout(() => {
          setDisplayText(text.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, typingSpeed);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDelay);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayText(text.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, deletingSpeed);
      } else {
        timer = setTimeout(() => setIsDeleting(false), 200);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, text, typingSpeed, deletingSpeed, pauseDelay]);

  return displayText;
}


