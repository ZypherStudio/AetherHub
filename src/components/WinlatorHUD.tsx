import { useState, useEffect } from 'react';
import { X, Activity, Cpu, MemoryStick, Thermometer, Monitor, Battery, Clock } from 'lucide-react';
import './WinlatorHUD.css';

interface Props {
  onClose: () => void;
  mode: 'normal' | 'detailed' | 'konkr';
}

const WinlatorHUD = ({ onClose, mode }: Props) => {
  const [fps, setFps] = useState(60);
  const [cpuUsage, setCpuUsage] = useState(45);
  const [gpuUsage, setGpuUsage] = useState(62);
  const [ramUsed, setRamUsed] = useState(4.2);
  const [swapUsed, setSwapUsed] = useState(1.1);
  const [cpuTemp, setCpuTemp] = useState(58);
  const [gpuTemp, setGpuTemp] = useState(52);
  const [batTemp, setBatTemp] = useState(34);
  const [batPercent, setBatPercent] = useState(86);
  const [coreFreqs, setCoreFreqs] = useState([2800, 2400, 2400, 2000, 1800, 1800, 1400, 1400]);

  // Simulate fluctuating values
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(prev => Math.max(15, Math.min(120, prev + (Math.random() * 10 - 5))));
      setCpuUsage(prev => Math.max(10, Math.min(99, prev + (Math.random() * 8 - 4))));
      setGpuUsage(prev => Math.max(20, Math.min(99, prev + (Math.random() * 6 - 3))));
      setRamUsed(prev => Math.max(2, Math.min(7.5, prev + (Math.random() * 0.4 - 0.2))));
      setCpuTemp(prev => Math.max(40, Math.min(85, prev + (Math.random() * 4 - 2))));
      setGpuTemp(prev => Math.max(35, Math.min(80, prev + (Math.random() * 3 - 1.5))));
      setCoreFreqs(prev => prev.map(f => Math.max(800, Math.min(3200, f + Math.floor(Math.random() * 200 - 100)))));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fpsColor = fps > 50 ? '#10b981' : fps > 30 ? '#eab308' : '#ef4444';

  return (
    <div className="hud-overlay fade-enter-active">
      <div className="hud-window">
        <div className="hud-header">
          <Activity size={16} color="#10b981" />
          <span>Winlator HUD — {mode === 'normal' ? 'Normal' : mode === 'detailed' ? 'Extra Detailed' : 'Konkr Style'}</span>
          <button className="close-btn" onClick={onClose}><X size={16} /></button>
        </div>

        {mode === 'normal' && (
          <div className="hud-normal">
            <div className="hud-fps" style={{ color: fpsColor }}>{Math.round(fps)} FPS</div>
            <div className="hud-frametime">{(1000 / fps).toFixed(1)} ms</div>
            <div className="hud-res">1280×720</div>
          </div>
        )}

        {mode === 'detailed' && (
          <div className="hud-detailed">
            <div className="hud-row">
              <div className="hud-metric">
                <span className="hud-label">FPS</span>
                <span className="hud-value" style={{ color: fpsColor }}>{Math.round(fps)}</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label"><Cpu size={12} /> CPU</span>
                <span className="hud-value">{Math.round(cpuUsage)}%</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label"><Monitor size={12} /> GPU</span>
                <span className="hud-value">{Math.round(gpuUsage)}%</span>
              </div>
            </div>
            <div className="hud-row">
              <div className="hud-metric">
                <span className="hud-label"><MemoryStick size={12} /> RAM</span>
                <span className="hud-value">{ramUsed.toFixed(1)} / 8.0 GB</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label">SWAP</span>
                <span className="hud-value">{swapUsed.toFixed(1)} / 4.0 GB</span>
              </div>
            </div>
            <div className="hud-row">
              <div className="hud-metric">
                <span className="hud-label"><Thermometer size={12} /> CPU</span>
                <span className="hud-value" style={{ color: cpuTemp > 70 ? '#ef4444' : '#10b981' }}>{Math.round(cpuTemp)}°C</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label"><Thermometer size={12} /> GPU</span>
                <span className="hud-value" style={{ color: gpuTemp > 70 ? '#ef4444' : '#10b981' }}>{Math.round(gpuTemp)}°C</span>
              </div>
              <div className="hud-metric">
                <span className="hud-label"><Battery size={12} /> BAT</span>
                <span className="hud-value">{Math.round(batTemp)}°C</span>
              </div>
            </div>
          </div>
        )}

        {mode === 'konkr' && (
          <div className="hud-konkr">
            <div className="konkr-fps">{Math.round(fps)}</div>
            <div className="konkr-grid">
              <div className="konkr-section">
                <div className="konkr-label">CPU {Math.round(cpuUsage)}% — {Math.round(cpuTemp)}°C</div>
                <div className="core-grid">
                  {coreFreqs.map((f, i) => (
                    <div key={i} className="core-cell">
                      <span className="core-id">C{i}</span>
                      <span className="core-mhz">{f} MHz</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="konkr-section">
                <div className="konkr-label">GPU {Math.round(gpuUsage)}% — {Math.round(gpuTemp)}°C</div>
                <div className="konkr-detail">Adreno 730 — 818 MHz — 1280×720</div>
              </div>
              <div className="konkr-section">
                <div className="konkr-mem-row">
                  <span className="mem-label ram">RAM</span>
                  <span>{ramUsed.toFixed(1)} / 8.0 GB</span>
                </div>
                <div className="konkr-mem-row">
                  <span className="mem-label swap">SWAP</span>
                  <span>{swapUsed.toFixed(1)} / 4.0 GB</span>
                </div>
                <div className="konkr-mem-row">
                  <span className="mem-label bat">BAT</span>
                  <div className="bat-bar-wrap">
                    <div className="bat-bar-fill" style={{ width: `${batPercent}%` }}></div>
                  </div>
                  <span>{batPercent}%</span>
                </div>
                <div className="konkr-mem-row">
                  <span className="mem-label time"><Clock size={10} /></span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinlatorHUD;
