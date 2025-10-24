import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playBeep, playCompletionBeep } from '../utils/sound';
import { formatTime } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/storage';

function PomodoroModule() {
  const [sessionCount, setSessionCount] = useLocalStorage(STORAGE_KEYS.TIMER, 0);
  
  const [workMinutes] = useState(25);
  const [breakMinutes] = useState(5);
  const [currentMinutes, setCurrentMinutes] = useState(25);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [status, setStatus] = useState('READY');
  
  const startButtonRef = useRef(null);
  const intervalRef = useRef(null);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    
    if (!isBreak) {
      // Work session completed
      setSessionCount(prev => prev + 1);
      
      // Switch to break
      setIsBreak(true);
      setCurrentMinutes(breakMinutes);
      setCurrentSeconds(0);
      setStatus('COMPLETE');
    } else {
      // Break completed
      setIsBreak(false);
      setCurrentMinutes(workMinutes);
      setCurrentSeconds(0);
      setStatus('READY');
    }
    
    playCompletionBeep();
  }, [isBreak, breakMinutes, workMinutes, setSessionCount]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setCurrentSeconds(prevSeconds => {
          if (prevSeconds === 0) {
            setCurrentMinutes(prevMinutes => {
              if (prevMinutes === 0) {
                handleTimerComplete();
                return 0;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, handleTimerComplete]);

  const startTimer = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    setStatus('RUNNING');
    playBeep();
  }, [isRunning]);

  const pauseTimer = useCallback(() => {
    if (!isRunning) return;
    
    setIsRunning(false);
    setStatus('PAUSED');
    playBeep();
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setCurrentMinutes(isBreak ? breakMinutes : workMinutes);
    setCurrentSeconds(0);
    setStatus('READY');
    playBeep();
  }, [isBreak, breakMinutes, workMinutes]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName !== 'INPUT') {
        // Focus timer with '2'
        if (e.key === '2') {
          e.preventDefault();
          startButtonRef.current?.focus();
          playBeep();
        }
        // Start with 'S'
        if (e.key.toLowerCase() === 's' && !e.ctrlKey) {
          e.preventDefault();
          startTimer();
        }
        // Pause with 'P'
        if (e.key.toLowerCase() === 'p' && !e.ctrlKey) {
          e.preventDefault();
          pauseTimer();
        }
        // Reset with 'R'
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey) {
          e.preventDefault();
          resetTimer();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [startTimer, pauseTimer, resetTimer]);

  const statusClass = status === 'RUNNING' ? 'status-active' : 
                      status === 'PAUSED' ? 'status-paused' : '';

  return (
    <section className="module" id="pomodoro-module">
      <div className="module-header">
        <h2>[2] POMODORO TIMER</h2>
        <span className={`module-status ${statusClass}`} id="pomodoro-status">{status}</span>
      </div>
      <div className="module-content pomodoro-content">
        <div className="timer-display">
          <div id="timer-time">{formatTime(currentMinutes, currentSeconds)}</div>
          <div className="timer-label" id="timer-label">
            {isBreak ? 'BREAK TIME' : 'WORK SESSION'}
          </div>
        </div>
        <div className="timer-controls">
          <button 
            ref={startButtonRef}
            id="timer-start" 
            className="btn"
            onClick={startTimer}
            disabled={isRunning}
          >
            START [S]
          </button>
          <button 
            id="timer-pause" 
            className="btn"
            onClick={pauseTimer}
            disabled={!isRunning}
          >
            PAUSE [P]
          </button>
          <button 
            id="timer-reset" 
            className="btn"
            onClick={resetTimer}
          >
            RESET [R]
          </button>
        </div>
        <div className="timer-stats">
          <div>Sessions: <span id="session-count">{sessionCount}</span></div>
          <div>Mode: <span id="timer-mode">{workMinutes}/{breakMinutes}</span></div>
        </div>
      </div>
    </section>
  );
}

export default PomodoroModule;
