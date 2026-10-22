'use client';
import { useEffect, useState, useRef } from 'react';

export interface ScrollamaOptions {
  stepSelector?: string;
  offset?: number; // 0 to 1 representing percentage of viewport
  threshold?: number[];
  onStepEnter?: (response: { element: HTMLElement; index: number; direction: 'up' | 'down' }) => void;
  onStepExit?: (response: { element: HTMLElement; index: number; direction: 'up' | 'down' }) => void;
}

export function useScrollama(options: ScrollamaOptions = {}) {
  const {
    stepSelector = '.scrolly-step',
    offset = 0.5,
    onStepEnter,
    onStepExit,
  } = options;

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const directionRef = useRef<'up' | 'down'>('down');
  const lastScrollY = useRef<number>(0);
  const onStepEnterRef = useRef(onStepEnter);
  const onStepExitRef = useRef(onStepExit);

  useEffect(() => {
    onStepEnterRef.current = onStepEnter;
    onStepExitRef.current = onStepExit;
  }, [onStepEnter, onStepExit]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newDir = scrollY > lastScrollY.current ? 'down' : 'up';
      directionRef.current = newDir;
      setDirection(newDir);
      lastScrollY.current = scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const stepElements = Array.from(document.querySelectorAll<HTMLElement>(stepSelector));
    if (stepElements.length === 0) {
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    // Configure IntersectionObserver with a reliable center trigger line
    const topMargin = -Math.round(window.innerHeight * (offset - 0.05));
    const bottomMargin = -Math.round(window.innerHeight * (1 - offset - 0.05));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          const index = stepElements.indexOf(target);

          if (entry.isIntersecting) {
            setCurrentStep(index);
            if (onStepEnterRef.current) {
              onStepEnterRef.current({ element: target, index, direction: directionRef.current });
            }
          } else {
            if (onStepExitRef.current) {
              onStepExitRef.current({ element: target, index, direction: directionRef.current });
            }
          }
        });
      },
      {
        root: null,
        rootMargin: `${topMargin}px 0px ${bottomMargin}px 0px`,
        threshold: 0,
      }
    );

    stepElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [stepSelector, offset]);

  return { currentStep, setCurrentStep, direction };
}

