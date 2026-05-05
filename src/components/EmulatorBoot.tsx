import { useEffect, useState } from 'react';
import './EmulatorBoot.css';
import PerformanceHUD from './PerformanceHUD';
import VirtualGamepad from './VirtualGamepad';

interface EmulatorBootProps {
  gameName: string;
  onBootComplete: () => void;
}

const bootLogs = [
  "Initializing Box64 Environment...",
  "Loading Turnip Adreno Drivers v24.1.0...",
  "Mounting Z: drive (Android root)...",
  "Starting Wine Server (Proton 8.0-4)...",
  "Initializing DXVK 2.3...",
  "Applying Lossless Scaling preset...",
  "Setting CPU Affinity (Performance Cores)...",
  "Launching executable..."
];

const EmulatorBoot = ({ gameName, onBootComplete }: EmulatorBootProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [showHud, setShowHud] = useState(false);

  useEffect(() => {
    // Show HUD shortly after boot starts
    setTimeout(() => setShowHud(true), 1500);

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      } else {
        clearInterval(interval);
        setTimeout(onBootComplete, 2000); // Wait a bit longer to show HUD
      }
    }, 600);

    return () => clearInterval(interval);
  }, [onBootComplete]);

  return (
    <div className="emulator-boot-overlay fade-enter-active">
      {showHud && <PerformanceHUD />}
      {showHud && <VirtualGamepad />}
      <div className="boot-terminal">
        <div className="terminal-header">
          <span>Emulator Console - {gameName}</span>
        </div>
        <div className="terminal-body">
          {logs.map((log, index) => (
            <div key={index} className="log-line">
              <span className="log-prefix">[INFO]</span> {log}
            </div>
          ))}
          {logs.length < bootLogs.length && (
            <div className="log-line blinking-cursor">_</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmulatorBoot;
