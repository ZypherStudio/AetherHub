import { X, HardDrive, Download, Cpu, Package, Play, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import './AddGameModal.css';

interface AddGameModalProps {
  onClose: () => void;
  onGameAdded: (game: any) => void;
}

const AddGameModal = ({ onClose, onGameAdded }: AddGameModalProps) => {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [container, setContainer] = useState('dxvk_2.3');
  const [unpackProgress, setUnpackProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [gameTitle, setGameTitle] = useState('');

  const mockFiles = [
    'FitGirl_Repack_Cyberpunk2077.exe',
    'NFS_Underground_2_Install.iso',
    'game_archive_v1.arc',
    'setup_witcher3.exe'
  ];

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  useEffect(() => {
    if (step === 3) {
      // Simulate ARC Unpacking / Wine Installation
      const steps = [
        'Initializing Wine Prefix at D:/Games...',
        'Mounting local storage...',
        `Analyzing ${selectedFile}...`,
        'Extracting .arc data chunks (this may take a while)...',
        'Decompressing audio files...',
        'Installing DirectX dependencies...',
        'Registering DLLs...',
        'Creating executable wrappers...',
        'Installation complete.'
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setLogs(prev => [...prev, steps[currentStep]]);
          setUnpackProgress(Math.floor((currentStep / steps.length) * 100));
          currentStep++;
        } else {
          setUnpackProgress(100);
          clearInterval(interval);
          setTimeout(() => setStep(4), 1000);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step, selectedFile]);

  const handleFinish = () => {
    const isIso = selectedFile?.includes('.iso');
    onGameAdded({
      id: `local-${Date.now()}`,
      title: gameTitle || (selectedFile?.split('.')[0] || 'Unknown Game'),
      platform: isIso ? 'iso' : 'steam',
      image: 'https://steamcdn-a.akamaihd.net/steam/apps/1222680/library_600x900_2x.jpg',
      active: false
    });
    onClose();
  };

  return (
    <div className="add-game-overlay fade-enter-active">
      <div className="wizard-window">
        <div className="wizard-header">
          <h2>Game Installation Wizard</h2>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="wizard-steps-indicator">
          <div className={`w-step ${step >= 1 ? 'active' : ''}`}>1. File</div>
          <div className="w-line"></div>
          <div className={`w-step ${step >= 2 ? 'active' : ''}`}>2. Container</div>
          <div className="w-line"></div>
          <div className={`w-step ${step >= 3 ? 'active' : ''}`}>3. Install</div>
          <div className="w-line"></div>
          <div className={`w-step ${step >= 4 ? 'active' : ''}`}>4. Shortcut</div>
        </div>

        <div className="wizard-content">
          {/* STEP 1: FILE PICKER */}
          {step === 1 && (
            <div className="wizard-panel">
              <h3>Select Installer File</h3>
              <p className="wiz-desc">Choose a setup.exe, .iso, or repack archive (.arc) from your Android Downloads folder.</p>
              
              <div className="file-picker-mock">
                <div className="fp-header">
                  <HardDrive size={16} />
                  <span>/storage/emulated/0/Download</span>
                </div>
                <div className="fp-list">
                  {mockFiles.map(file => (
                    <div 
                      key={file} 
                      className={`fp-item ${selectedFile === file ? 'selected' : ''}`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <Package size={16} color={selectedFile === file ? '#66c0f4' : '#888'} />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="wizard-actions">
                <button className="console-btn primary" disabled={!selectedFile} onClick={handleNext}>Next</button>
              </div>
            </div>
          )}

          {/* STEP 2: CONTAINER SETUP */}
          {step === 2 && (
            <div className="wizard-panel">
              <h3>Configure Environment</h3>
              <p className="wiz-desc">Select the Wine Prefix and graphics driver for this game.</p>
              
              <div className="form-group">
                <label>Target Container</label>
                <select>
                  <option>Prefix 1 (Win10, 64-bit)</option>
                  <option>Prefix 2 (Win7, 32-bit)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Graphics Wrapper</label>
                <select value={container} onChange={e => setContainer(e.target.value)}>
                  <option value="dxvk_2.3">DXVK 2.3 (DirectX 9-11)</option>
                  <option value="vkd3d">VKD3D (DirectX 12)</option>
                  <option value="turnip">Turnip Adreno Driver (Snapdragon)</option>
                </select>
              </div>

              <div className="wizard-actions">
                <button className="console-btn secondary" onClick={handleBack}>Back</button>
                <button className="console-btn primary" onClick={handleNext}>Start Install</button>
              </div>
            </div>
          )}

          {/* STEP 3: UNPACKING SIMULATION */}
          {step === 3 && (
            <div className="wizard-panel">
              <h3>Installing Game...</h3>
              <p className="wiz-desc">Do not close the app while the archive is being extracted.</p>
              
              <div className="unpack-terminal">
                {logs.map((log, i) => (
                  <div key={i} className="terminal-log">&gt; {log}</div>
                ))}
                {unpackProgress < 100 && <span className="blinking-cursor">_</span>}
              </div>

              <div className="install-progress-bar">
                <div className="install-progress-fill" style={{width: `${unpackProgress}%`}}></div>
              </div>
              <div className="progress-text">{unpackProgress}% Complete</div>
            </div>
          )}

          {/* STEP 4: SHORTCUT CREATION */}
          {step === 4 && (
            <div className="wizard-panel">
              <div className="success-icon-wrap">
                <CheckCircle size={48} color="#10b981" />
              </div>
              <h3 style={{textAlign: 'center'}}>Installation Complete!</h3>
              <p className="wiz-desc" style={{textAlign: 'center'}}>Create a library shortcut to launch the game easily.</p>
              
              <div className="form-group" style={{marginTop: 20}}>
                <label>Game Title</label>
                <input 
                  type="text" 
                  value={gameTitle} 
                  onChange={e => setGameTitle(e.target.value)}
                  placeholder="e.g. Need For Speed" 
                  className="wiz-input"
                />
              </div>

              <div className="wizard-actions" style={{justifyContent: 'center', marginTop: 30}}>
                <button className="console-btn primary" onClick={handleFinish}>Add to Library</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AddGameModal;
