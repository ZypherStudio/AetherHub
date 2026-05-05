import { X, Settings2, Play, Gamepad2, Wrench } from 'lucide-react';
import './GameConfigModal.css';
import { useState } from 'react';

interface GameConfigModalProps {
  game: { id: string; title: string; image: string };
  onClose: () => void;
  onLaunch: () => void;
}

const GameConfigModal = ({ game, onClose, onLaunch }: GameConfigModalProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'input' | 'advanced'>('general');
  const [resolution, setResolution] = useState('800x600');
  const [dxvk, setDxvk] = useState('2.3');
  const [wine, setWine] = useState('Proton 8.0-4');
  const [lossless, setLossless] = useState(true);

  // New states
  const [inputLayout, setInputLayout] = useState('xbox');
  const [esync, setEsync] = useState(true);
  const [fsr, setFsr] = useState('off');

  return (
    <div className="console-modal-overlay fade-enter-active" onClick={onClose}>
      <div className="console-modal-content" onClick={e => e.stopPropagation()}>
        
        <div className="console-modal-sidebar" style={{ backgroundImage: `url(${game.image})` }}>
          <div className="sidebar-overlay">
            <h2>{game.title}</h2>
            <div className="config-tabs">
              <button className={`config-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
                <Settings2 size={18} /> General
              </button>
              <button className={`config-tab ${activeTab === 'input' ? 'active' : ''}`} onClick={() => setActiveTab('input')}>
                <Gamepad2 size={18} /> Input Controls
              </button>
              <button className={`config-tab ${activeTab === 'advanced' ? 'active' : ''}`} onClick={() => setActiveTab('advanced')}>
                <Wrench size={18} /> Advanced Tweaks
              </button>
            </div>
          </div>
        </div>

        <div className="console-modal-main">
          <div className="modal-header">
            <div className="modal-title">
              <span>{activeTab === 'general' ? 'Emulator Configuration' : activeTab === 'input' ? 'Virtual Gamepad' : 'Advanced Settings'}</span>
            </div>
            <button className="close-btn" onClick={onClose}><X size={24} /></button>
          </div>

          <div className="modal-body">
            {activeTab === 'general' && (
              <>
                <div className="form-group">
                  <label>Emulator Engine</label>
                  <select>
                    <option value="winlator">Winlator (Recommended)</option>
                    <option value="mobox">Mobox (Termux-X11)</option>
                    <option value="cassia">Cassia</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Resolution</label>
                  <select value={resolution} onChange={e => setResolution(e.target.value)}>
                    <option value="640x480">640 x 480 (Performance)</option>
                    <option value="800x600">800 x 600 (Recommended)</option>
                    <option value="1280x720">1280 x 720 (HD)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Wine / Proton Version</label>
                  <select value={wine} onChange={e => setWine(e.target.value)}>
                    <option value="Proton 8.0-4">Proton 8.0-4 (Stock)</option>
                    <option value="Wine 9.0">Wine 9.0 (Latest)</option>
                    <option value="Wine 8.2 GE">Wine 8.2 GE</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>DXVK Version</label>
                  <select value={dxvk} onChange={e => setDxvk(e.target.value)}>
                    <option value="2.3">DXVK 2.3</option>
                    <option value="1.10.3">DXVK 1.10.3 (Async)</option>
                  </select>
                </div>

                <div className="form-group" style={{marginTop: 16}}>
                  <button className="console-btn secondary" style={{justifyContent: 'center', width: '100%'}} onClick={() => alert('Save dosyaları Google Drive ile senkronize ediliyor...')}>
                    ☁️ Cloud Save Sync
                  </button>
                </div>
              </>
            )}

            {activeTab === 'input' && (
              <>
                <div className="form-group">
                  <label>On-Screen Controller Layout</label>
                  <select value={inputLayout} onChange={e => setInputLayout(e.target.value)}>
                    <option value="xbox">Xbox 360 Gamepad (XInput)</option>
                    <option value="ps4">PlayStation 4 DualShock</option>
                    <option value="kb_mouse">Keyboard & Mouse (Keymapper)</option>
                  </select>
                </div>

                {inputLayout === 'kb_mouse' ? (
                  <div className="keymapper-ui">
                    <div className="keymapper-header">
                      <span>Advanced Keymapper</span>
                      <button className="console-btn secondary">Load Profile</button>
                    </div>
                    
                    <div className="keymapper-grid">
                      <div className="keymapper-item">
                        <label>Left Analog (Movement)</label>
                        <div className="key-bind-box">W A S D</div>
                      </div>
                      <div className="keymapper-item">
                        <label>Right Analog (Camera)</label>
                        <div className="key-bind-box">Mouse Drag</div>
                      </div>
                      <div className="keymapper-item">
                        <label>A Button (Jump)</label>
                        <div className="key-bind-box">Space</div>
                      </div>
                      <div className="keymapper-item">
                        <label>Right Trigger (Shoot)</label>
                        <div className="key-bind-box">Left Click</div>
                      </div>
                    </div>

                    <div className="form-group row-toggle" style={{marginTop: 10}}>
                      <div className="toggle-info">
                        <label>Mouse Sensitivity (DPI)</label>
                        <input type="range" min="1" max="100" defaultValue="50" style={{width: '100%', marginTop: 8}} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="preview-box">
                    <Gamepad2 size={48} opacity={0.5} />
                    <p>Touch layout will be overlaid on screen.</p>
                    <button className="console-btn secondary" style={{marginTop: 10, alignSelf: 'center'}}>Edit Layout</button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'advanced' && (
              <>
                <div className="form-group">
                  <label>FSR (FidelityFX Super Resolution)</label>
                  <select value={fsr} onChange={e => setFsr(e.target.value)}>
                    <option value="off">Off (Native)</option>
                    <option value="performance">Performance (1.5x scaling)</option>
                    <option value="quality">Quality (1.2x scaling)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>TDP / Power Profile</label>
                  <select>
                    <option value="max">Maximum Performance (Uncapped)</option>
                    <option value="15w">Balanced (15W)</option>
                    <option value="10w">Battery Saver (10W)</option>
                    <option value="custom">Custom TDP</option>
                  </select>
                </div>

                <div className="form-group row-toggle">
                  <div className="toggle-info">
                    <label>Lossless Scaling (Frame Gen)</label>
                    <span>Boosts FPS using AI interpolation</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={lossless} onChange={e => setLossless(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="form-group row-toggle">
                  <div className="toggle-info">
                    <label>WINEESYNC / WINEFSYNC</label>
                    <span>Improves CPU overhead in Wine.</span>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={esync} onChange={e => setEsync(e.target.checked)} />
                    <span className="slider"></span>
                  </label>
                </div>
              </>
            )}

          </div>

          <div className="modal-footer">
            <button className="console-btn primary" onClick={() => { onClose(); onLaunch(); }}>
              <span className="btn-console-icon">A</span>
              Launch
            </button>
            <button className="console-btn secondary" onClick={onClose}>
              <span className="btn-console-icon">B</span>
              Back
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GameConfigModal;
