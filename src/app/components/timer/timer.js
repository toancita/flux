'use client'
import { useState, useEffect, useRef } from 'react';
import styles from './timer.module.css';

const Timer = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [selectedTime, setSelectedTime] = useState(30);
  const timerRef = useRef(null);

  const workDuration = selectedTime * 60;
  const breakDuration = 10 * 60;

  useEffect(() => {  // Cargar el conteo de pomodoros desde localStorage
    const savedCount = localStorage.getItem('pomodoroCount');
    if (savedCount) {
      setPomodoroCount(parseInt(savedCount));
    }
    return () => { 
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoroCount', pomodoroCount.toString());
  }, [pomodoroCount]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            clearInterval(timerRef.current);
            
            if (!isBreakTime) {
              // Terminó el tiempo de trabajo
              setPomodoroCount((prev) => prev + 1);
              setIsBreakTime(true);
              return breakDuration;
            } else {
              // Terminó el tiempo de descanso
              setIsBreakTime(false);
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsBreakTime(false);
    setTimeLeft(workDuration);
  };

  const handleTimeChange = (minutes) => {
    setSelectedTime(minutes);
    setTimeLeft(minutes * 60);
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
  };

  const calculateProgress = () => {
    const totalTime = workDuration;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const progress = calculateProgress();
  let progressColor = '#94C8A9';
  if (progress >= 50) progressColor = '#A9CAEB';
  if (progress >= 80) progressColor = '#FDA8B2';

  return (
    <div className={styles.timerContainer}>
      <div className={styles.pomodoroCounter}>
        Sesiones completadas: <span>{pomodoroCount}</span> 💌
      </div>

      <div className={styles.timeOptions}>
        <button 
          onClick={() => handleTimeChange(30)} 
          className={styles.timeBtn}>30 min</button>
        <button 
          onClick={() => handleTimeChange(45)} 
          className={styles.timeBtn}>45 min</button>
        <button 
          onClick={() => handleTimeChange(60)} 
          className={styles.timeBtn}>60 min</button>
      </div>

      <div className={styles.timerDisplay}>{formatTime(timeLeft)}</div>
      
      <div className={styles.progressContainer}>
        <div 
          className={styles.progressBar} 
          style={{
            width: `${progress}%`,
            backgroundColor: progressColor
          }}
        ></div>
      </div>
      
      <div className={styles.controls}>
        <button 
          onClick={toggleTimer} 
          className={styles.controlBtn}
        >
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button 
          onClick={resetTimer} 
          className={styles.controlBtn}
        >
          ↺
        </button>
      </div>
    </div>
  );
};

export default Timer;