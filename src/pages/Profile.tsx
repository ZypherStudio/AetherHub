import { useState } from 'react';
import './Profile.css';
import { Settings, Zap, Monitor, Cpu } from 'lucide-react';

const Profile = () => {
  const [losslessScaling, setLosslessScaling] = useState(true);
  const [performanceMode, setPerformanceMode] = useState(false);

  return (
    <div className="profile-container fade-enter-active">
      <header className="profile-header">
        <div className="avatar"></div>
        <div>
          <h2>Oyuncu_1337</h2>
          <p className="status">Premium Üye</p>
        </div>
        <button className="icon-button glass" style={{ marginLeft: 'auto' }}><Settings size={20} /></button>
      </header>

      <section className="settings-section">
        <h3 className="section-title">Sistem & Optimizasyon</h3>
        
        <div className="setting-card glass-panel">
          <div className="setting-info">
            <div className="setting-icon"><Monitor size={20} /></div>
            <div>
              <h4>Lossless Scaling (Frame Gen)</h4>
              <p>Oyunlarda FPS'yi yapay zeka ile artırır.</p>
            </div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={losslessScaling} onChange={(e) => setLosslessScaling(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-card glass-panel">
          <div className="setting-info">
            <div className="setting-icon" style={{ color: '#f59e0b' }}><Zap size={20} /></div>
            <div>
              <h4>Performans Modu</h4>
              <p>Bataryayı yoksayarak maksimum güç kullanır.</p>
            </div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={performanceMode} onChange={(e) => setPerformanceMode(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>

        <div className="setting-card glass-panel">
          <div className="setting-info">
            <div className="setting-icon" style={{ color: '#10b981' }}><Cpu size={20} /></div>
            <div>
              <h4>Donanım İvmelendirme</h4>
              <p>Grafikleri işlemek için GPU'yu zorlar.</p>
            </div>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="section-title">Bileşen Yöneticisi (Component Manager)</h3>
        
        <div className="setting-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => alert('Wine Sürümleri listesi açılacak')}>
          <div className="setting-info">
            <div>
              <h4>Wine / Proton Sürümleri</h4>
              <p>Geçerli: Proton-8.0-4-GE</p>
            </div>
          </div>
          <div style={{ color: 'var(--accent-color)', fontSize: 13, fontWeight: 500 }}>Yönet</div>
        </div>

        <div className="setting-card glass-panel" style={{ cursor: 'pointer' }} onClick={() => alert('Turnip/Adreno Sürücü listesi açılacak')}>
          <div className="setting-info">
            <div>
              <h4>GPU Sürücüleri (Turnip/Mesa)</h4>
              <p>Geçerli: Adreno-v24.1.0-R19</p>
            </div>
          </div>
          <div style={{ color: 'var(--accent-color)', fontSize: 13, fontWeight: 500 }}>Yönet</div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
