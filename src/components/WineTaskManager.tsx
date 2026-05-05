import { useState } from 'react';
import { X, Terminal, Trash2, Pause, Play } from 'lucide-react';
import './WineTaskManager.css';

interface WineProcess {
  pid: number;
  name: string;
  status: 'running' | 'suspended';
  memoryMB: number;
  cpuPercent: number;
}

const mockProcesses: WineProcess[] = [
  { pid: 1024, name: 'explorer.exe', status: 'running', memoryMB: 12, cpuPercent: 0.5 },
  { pid: 2048, name: 'winedevice.exe', status: 'running', memoryMB: 8, cpuPercent: 1.2 },
  { pid: 3072, name: 'services.exe', status: 'running', memoryMB: 6, cpuPercent: 0.1 },
  { pid: 4096, name: 'plugplay.exe', status: 'running', memoryMB: 4, cpuPercent: 0.0 },
  { pid: 5120, name: 'Cyberpunk2077.exe', status: 'running', memoryMB: 2048, cpuPercent: 85.3 },
  { pid: 5200, name: 'dxvk_cache.exe', status: 'running', memoryMB: 128, cpuPercent: 12.1 },
];

interface Props {
  onClose: () => void;
}

const WineTaskManager = ({ onClose }: Props) => {
  const [processes, setProcesses] = useState(mockProcesses);

  const killProcess = (pid: number) => {
    setProcesses(prev => prev.filter(p => p.pid !== pid));
  };

  const toggleSuspend = (pid: number) => {
    setProcesses(prev => prev.map(p =>
      p.pid === pid ? { ...p, status: p.status === 'running' ? 'suspended' as const : 'running' as const } : p
    ));
  };

  const totalMem = processes.reduce((a, p) => a + p.memoryMB, 0);
  const totalCpu = processes.reduce((a, p) => a + p.cpuPercent, 0);

  return (
    <div className="wtm-overlay fade-enter-active">
      <div className="wtm-window">
        <div className="wtm-header">
          <Terminal size={18} />
          <h2>Wine Task Manager</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="wtm-summary">
          <span>Processes: {processes.length}</span>
          <span>CPU: {totalCpu.toFixed(1)}%</span>
          <span>Memory: {totalMem > 1024 ? `${(totalMem/1024).toFixed(1)} GB` : `${totalMem} MB`}</span>
        </div>

        <div className="wtm-table">
          <div className="wtm-row wtm-thead">
            <span className="wtm-col pid">PID</span>
            <span className="wtm-col name">Process</span>
            <span className="wtm-col status">Status</span>
            <span className="wtm-col mem">Memory</span>
            <span className="wtm-col cpu">CPU %</span>
            <span className="wtm-col actions">Actions</span>
          </div>
          {processes.map(p => (
            <div key={p.pid} className={`wtm-row ${p.status === 'suspended' ? 'suspended' : ''}`}>
              <span className="wtm-col pid">{p.pid}</span>
              <span className="wtm-col name">{p.name}</span>
              <span className={`wtm-col status ${p.status}`}>{p.status}</span>
              <span className="wtm-col mem">{p.memoryMB > 1024 ? `${(p.memoryMB/1024).toFixed(1)} GB` : `${p.memoryMB} MB`}</span>
              <span className="wtm-col cpu" style={{ color: p.cpuPercent > 50 ? '#ef4444' : '#10b981' }}>{p.cpuPercent.toFixed(1)}%</span>
              <span className="wtm-col actions">
                <button className="wtm-action" onClick={() => toggleSuspend(p.pid)} title={p.status === 'running' ? 'Suspend' : 'Resume'}>
                  {p.status === 'running' ? <Pause size={12} /> : <Play size={12} />}
                </button>
                <button className="wtm-action danger" onClick={() => killProcess(p.pid)} title="Kill Process">
                  <Trash2 size={12} />
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WineTaskManager;
