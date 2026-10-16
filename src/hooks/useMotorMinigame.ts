import { useState, useEffect, useCallback, useRef } from 'react';

export type MotorStatusType = 'normal' | 'warning' | 'critical' | 'crashed' | 'saved';

export function useMotorMinigame() {
  const [currentTemp, setCurrentTemp] = useState<number>(32);
  const [successfulInterventions, setSuccessfulInterventions] = useState<number>(0);
  const [isGameLocked, setIsGameLocked] = useState<boolean>(false);
  const [gameStatus, setGameStatus] = useState<MotorStatusType>('normal');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Determine status based on current temperature
  const evaluateStatus = (temp: number, saved: boolean): MotorStatusType => {
    if (saved) return 'saved';
    if (temp >= 95) return 'crashed';
    if (temp >= 75) return 'critical';
    if (temp >= 50) return 'warning';
    return 'normal';
  };

  // Temperature increment interval loop
  useEffect(() => {
    if (isGameLocked) return;

    timerRef.current = setInterval(() => {
      setCurrentTemp((prev) => {
        const nextTemp = Math.min(100, prev + Math.random() * 4 + 2);
        if (nextTemp >= 95) {
          setIsGameLocked(true);
          setGameStatus('crashed');
        } else {
          setGameStatus(evaluateStatus(nextTemp, false));
        }
        return nextTemp;
      });
    }, 1200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGameLocked]);

  // Cool down motor on button click
  const coolMotor = useCallback(() => {
    if (isGameLocked) return;

    setSuccessfulInterventions((prevCount) => {
      const nextCount = prevCount + 1;
      if (nextCount >= 5) {
        setIsGameLocked(true);
        setGameStatus('saved');
        setCurrentTemp(22);
        return nextCount;
      }

      setCurrentTemp((prevTemp) => {
        const reduced = Math.max(20, prevTemp - 24);
        setGameStatus(evaluateStatus(reduced, false));
        return reduced;
      });

      return nextCount;
    });
  }, [isGameLocked]);

  // Restart game
  const restartGame = useCallback(() => {
    setCurrentTemp(30);
    setSuccessfulInterventions(0);
    setIsGameLocked(false);
    setGameStatus('normal');
  }, []);

  return {
    currentTemp,
    successfulInterventions,
    isGameLocked,
    gameStatus,
    coolMotor,
    restartGame,
  };
}
