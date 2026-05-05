import { useState, useEffect, useRef } from 'react';
import { Terminal, X, ChevronDown, ChevronUp, Trash2, Maximize2 } from 'lucide-react';
import './SystemConsole.css';

interface SystemConsoleProps {
  onClose: () => void;
}

const SystemConsole = ({ onClose }: SystemConsoleProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/system/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 1000); // Poll every second
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className={`console-overlay ${isExpanded ? 'expanded' : ''}`}>
      <div className="console-window">
        <div className="console-header">
          <div className="console-title">
            <Terminal size={14} className="terminal-icon" />
            <span>System Engine Terminal</span>
          </div>
          <div className="console-actions">
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronDown size={16} /> : <Maximize2 size={16} />}
            </button>
            <button onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="console-body">
          {logs.length === 0 ? (
            <div className="console-empty">Awaiting system commands...</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={`log-line ${log.type}`}>
                <span className="log-time">[{log.time}]</span>
                <span className="log-msg">{log.msg}</span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
        
        <div className="console-footer">
          <div className="status-indicator">
            <div className="pulse-dot"></div>
            <span>ENGINE ACTIVE</span>
          </div>
          <div className="console-meta">
            GameHub v2.0 // Native Bridge
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConsole;
