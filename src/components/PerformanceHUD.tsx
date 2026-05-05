import { useState, useEffect } from 'react';
import './PerformanceHUD.css';

const PerformanceHUD = () => {
  const [fps, setFps] = useState(60);
  const [cpu, setCpu] = useState(45);
  const [gpu, setGpu] = useState(70);
  const [ram, setRam] = useState(3.4);
  const [temp, setTemp] = useState(65);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating metrics
      setFps(Math.floor(Math.random() * (62 - 58 + 1) + 58));
      setCpu(Math.floor(Math.random() * (55 - 40 + 1) + 40));
      setGpu(Math.floor(Math.random() * (85 - 65 + 1) + 65));
      setRam(+(Math.random() * (3.8 - 3.2) + 3.2).toFixed(1));
      setTemp(Math.floor(Math.random() * (70 - 62 + 1) + 62));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="perf-hud fade-enter-active">
      <div className="perf-row">
        <span className="perf-label">FPS</span>
        <span className="perf-value text-accent">{fps}</span>
      </div>
      <div className="perf-row">
        <span className="perf-label">CPU</span>
        <span className="perf-value">{cpu}%</span>
      </div>
      <div className="perf-row">
        <span className="perf-label">GPU</span>
        <span className="perf-value">{gpu}% <span className="perf-temp">{temp}°C</span></span>
      </div>
      <div className="perf-row">
        <span className="perf-label">RAM</span>
        <span className="perf-value">{ram} GB</span>
      </div>
      <div className="perf-row">
        <span className="perf-label">FSR</span>
        <span className="perf-value text-success">ON</span>
      </div>
    </div>
  );
};

export default PerformanceHUD;
