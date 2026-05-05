import { useState } from 'react';
import { X, Cpu, Monitor, Gamepad2, Zap, ChevronRight, Shield, Smartphone, HardDrive, Layers } from 'lucide-react';
import './HowItWorksModal.css';

interface HowItWorksModalProps {
  onClose: () => void;
}

const HowItWorksModal = ({ onClose }: HowItWorksModalProps) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'platforms' | 'compat' | 'tips' | 'mobile'>('pipeline');

  return (
    <div className="hiw-overlay" onClick={onClose}>
      <div className="hiw-modal" onClick={e => e.stopPropagation()}>
        <div className="hiw-header">
          <h2>🎮 Oyunlar Nasıl Çalışır?</h2>
          <button className="hiw-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="hiw-tabs">
          <button className={activeTab === 'pipeline' ? 'active' : ''} onClick={() => setActiveTab('pipeline')}>
            <Layers size={16} /> Pipeline
          </button>
          <button className={activeTab === 'platforms' ? 'active' : ''} onClick={() => setActiveTab('platforms')}>
            <Monitor size={16} /> Platformlar
          </button>
          <button className={activeTab === 'compat' ? 'active' : ''} onClick={() => setActiveTab('compat')}>
            <Shield size={16} /> Uyumluluk
          </button>
          <button className={activeTab === 'tips' ? 'active' : ''} onClick={() => setActiveTab('tips')}>
            <Zap size={16} /> İpuçları
          </button>
          <button className={activeTab === 'mobile' ? 'active' : ''} onClick={() => setActiveTab('mobile')}>
            <Smartphone size={16} /> Mobil Kurulum
          </button>
        </div>

        <div className="hiw-content">
          {activeTab === 'pipeline' && (
            <div className="pipeline-view">
              <p className="hiw-desc">Bir Windows oyunu Android telefonunuzda şu aşamalardan geçerek çalışır:</p>
              
              <div className="pipeline-chain">
                <div className="pipe-node">
                  <div className="pipe-icon" style={{background: 'linear-gradient(135deg, #667eea, #764ba2)'}}>
                    <Monitor size={24} />
                  </div>
                  <strong>Oyun (.exe)</strong>
                  <span>Windows oyun dosyası</span>
                </div>
                <ChevronRight size={20} className="pipe-arrow" />
                
                <div className="pipe-node">
                  <div className="pipe-icon" style={{background: 'linear-gradient(135deg, #f093fb, #f5576c)'}}>
                    <Layers size={24} />
                  </div>
                  <strong>Wine / Proton</strong>
                  <span>Windows API → Linux çevirisi</span>
                </div>
                <ChevronRight size={20} className="pipe-arrow" />
                
                <div className="pipe-node">
                  <div className="pipe-icon" style={{background: 'linear-gradient(135deg, #4facfe, #00f2fe)'}}>
                    <Cpu size={24} />
                  </div>
                  <strong>Box64</strong>
                  <span>x86 → ARM CPU çevirisi</span>
                </div>
                <ChevronRight size={20} className="pipe-arrow" />
                
                <div className="pipe-node">
                  <div className="pipe-icon" style={{background: 'linear-gradient(135deg, #43e97b, #38f9d7)'}}>
                    <HardDrive size={24} />
                  </div>
                  <strong>DXVK / VKD3D</strong>
                  <span>DirectX → Vulkan çevirisi</span>
                </div>
                <ChevronRight size={20} className="pipe-arrow" />
                
                <div className="pipe-node">
                  <div className="pipe-icon" style={{background: 'linear-gradient(135deg, #fa709a, #fee140)'}}>
                    <Smartphone size={24} />
                  </div>
                  <strong>Turnip GPU</strong>
                  <span>Adreno sürücüsü → Ekran</span>
                </div>
              </div>

              <div className="pipe-detail-grid">
                <div className="pipe-detail-card">
                  <h4>🍷 Wine / Proton</h4>
                  <p>Windows'un <code>CreateFile()</code>, <code>DirectInput</code> gibi API çağrılarını Linux/Android karşılıklarına çevirir. Proton, Valve'ın Wine fork'udur ve oyunlara özel optimizasyonlar içerir.</p>
                </div>
                <div className="pipe-detail-card">
                  <h4>📦 Box64</h4>
                  <p>PC oyunları x86_64 (Intel/AMD) işlemciler için derlenmiştir. Box64, bu komutları ARM (Snapdragon/MediaTek) işlemcinin anlayacağı komutlara çevirir.</p>
                </div>
                <div className="pipe-detail-card">
                  <h4>🎨 DXVK & VKD3D</h4>
                  <p>DXVK: DirectX 9/10/11 → Vulkan. VKD3D: DirectX 12 → Vulkan. Telefonlar sadece Vulkan destekler, bu yüzden bu çeviri şart.</p>
                </div>
                <div className="pipe-detail-card">
                  <h4>🖥️ Turnip Driver</h4>
                  <p>Qualcomm Adreno GPU'lar için açık kaynak Vulkan sürücüsü. Resmi sürücüden daha iyi oyun uyumluluğu sunar.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'platforms' && (
            <div className="platforms-view">
              <div className="plat-card steam-card">
                <div className="plat-card-header">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" alt="" style={{width: 32, height: 32}} />
                  <h3>Steam</h3>
                </div>
                <ul>
                  <li><strong>Nasıl çalışır:</strong> Steam ID'nizi girerek kütüphanenizi senkronize edersiniz</li>
                  <li><strong>Oyun indirme:</strong> SteamCMD veya doğrudan indirme ile oyun dosyaları çekilir</li>
                  <li><strong>Uyumluluk katmanı:</strong> Proton 11 ARM (Valve'ın resmi çözümü)</li>
                  <li><strong>Cloud Save:</strong> Steam Cloud ile kayıtlar PC↔Telefon senkronize olur</li>
                  <li><strong>En iyi performans:</strong> Proton optimizasyonları sayesinde en iyi uyumluluk Steam'dedir</li>
                </ul>
              </div>

              <div className="plat-card epic-card">
                <div className="plat-card-header">
                  <span style={{fontSize: 24, fontWeight: 'bold'}}>Ⓔ</span>
                  <h3>Epic Games</h3>
                </div>
                <ul>
                  <li><strong>Nasıl çalışır:</strong> OAuth2 ile giriş yapıp authorizationCode ile bağlanırsınız</li>
                  <li><strong>Oyun indirme:</strong> Legendary launcher altyapısı ile manifest-based indirme</li>
                  <li><strong>Uyumluluk:</strong> Wine + DXVK ile çalışır (Proton da kullanılabilir)</li>
                  <li><strong>Bedava oyunlar:</strong> Her hafta aldığınız bedava oyunlar da kütüphanede görünür</li>
                </ul>
              </div>

              <div className="plat-card gog-card">
                <div className="plat-card-header">
                  <span style={{fontSize: 20, fontWeight: 'bold', color: '#c0392b'}}>GOG</span>
                  <h3>GOG Galaxy</h3>
                </div>
                <ul>
                  <li><strong>DRM-Free:</strong> Oyunlar kopya koruması olmadan gelir, offline çalışır</li>
                  <li><strong>Nasıl çalışır:</strong> GOG OAuth2 ile bağlanıp kütüphane çekilir</li>
                  <li><strong>Avantaj:</strong> DRM olmadığı için emülasyonda daha az sorun çıkar</li>
                  <li><strong>Installer:</strong> Doğrudan .exe installer ile kurulum yapılır</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'compat' && (
            <div className="compat-view">
              <p className="hiw-desc">Uyumluluk, oyunun kullandığı teknolojilere ve cihazınızın gücüne bağlıdır:</p>

              <div className="compat-table">
                <div className="compat-row header">
                  <span>Durum</span>
                  <span>Anlam</span>
                  <span>Örnek Oyunlar</span>
                </div>
                <div className="compat-row">
                  <span className="compat-badge green">🟢 Mükemmel</span>
                  <span>30+ FPS, sorunsuz</span>
                  <span>Skyrim, Fallout NV, Portal 2</span>
                </div>
                <div className="compat-row">
                  <span className="compat-badge yellow">🟡 Oynanabilir</span>
                  <span>20-30 FPS, küçük sorunlar</span>
                  <span>GTA V, Witcher 3, Dark Souls 3</span>
                </div>
                <div className="compat-row">
                  <span className="compat-badge red">🔴 Sorunlu</span>
                  <span>Düşük FPS veya çökme</span>
                  <span>Cyberpunk 2077, Elden Ring</span>
                </div>
                <div className="compat-row">
                  <span className="compat-badge gray">⚫ Çalışmıyor</span>
                  <span>Anti-cheat veya DRM engeli</span>
                  <span>Fortnite (EAC), Valorant</span>
                </div>
              </div>

              <div className="compat-chipsets">
                <h4>📱 Cihaz Performans Sınıfları</h4>
                <div className="chip-grid">
                  <div className="chip-card">
                    <span className="chip-tier">S Tier</span>
                    <strong>Snapdragon 8 Gen 3 / 8 Elite</strong>
                    <p>AAA oyunlar 720p 25-30 FPS</p>
                  </div>
                  <div className="chip-card">
                    <span className="chip-tier">A Tier</span>
                    <strong>Snapdragon 8 Gen 1-2 / Dimensity 9200</strong>
                    <p>AA oyunlar 720p 30 FPS</p>
                  </div>
                  <div className="chip-card">
                    <span className="chip-tier">B Tier</span>
                    <strong>Snapdragon 870 / 7+ Gen 2</strong>
                    <p>Indie + eski AAA oyunlar</p>
                  </div>
                  <div className="chip-card">
                    <span className="chip-tier">C Tier</span>
                    <strong>SD 778G / Dimensity 8100</strong>
                    <p>Sadece hafif oyunlar</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tips-view">
              <div className="tip-card">
                <span className="tip-emoji">🎯</span>
                <div>
                  <strong>Çözünürlüğü 720p'de tutun</strong>
                  <p>1080p yerine 720p kullanmak FPS'i neredeyse 2 katına çıkarır. FSR ile görsel kaliteyi koruyabilirsiniz.</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">❄️</span>
                <div>
                  <strong>Telefonu soğutun</strong>
                  <p>Uzun oyun seanslarında termal throttling FPS düşürür. Bir telefon soğutucu veya fan kullanın.</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">🔋</span>
                <div>
                  <strong>Şarjda oynayın</strong>
                  <p>Pil tasarrufu modu CPU/GPU'yu yavaşlatır. Şarjda oynarken performans modu aktif olur.</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">💾</span>
                <div>
                  <strong>SD kart kullanın</strong>
                  <p>Oyun dosyaları 20-100 GB arası olabilir. Hızlı bir UHS-II SD kart kullanarak depolama sorununu çözün.</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">🎮</span>
                <div>
                  <strong>Fiziksel gamepad bağlayın</strong>
                  <p>Dokunmatik kontroller yerine Bluetooth gamepad (Xbox, PS, GameSir) çok daha iyi deneyim sunar.</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-emoji">⚙️</span>
                <div>
                  <strong>DXVK ve Turnip'i güncel tutun</strong>
                  <p>Component Manager'dan en son DXVK ve Turnip sürümlerini yükleyin. Her güncelleme performans artışı getirir.</p>
                </div>
              </div>
            </div>
          {activeTab === 'mobile' && (
            <div className="mobile-setup-view">
              <div className="setup-step">
                <div className="step-badge">ADIM 1</div>
                <h4>Native Motoru Yükleyin (Winlator / Mobox)</h4>
                <p>Android'de .exe dosyalarını açmak için bir Wine konteynerine ihtiyacınız var. En popülerleri <strong>Winlator</strong> ve <strong>Mobox</strong>'tur. GameHub bu uygulamalarla köprü kurarak çalışır.</p>
              </div>

              <div className="setup-step">
                <div className="step-badge">ADIM 2</div>
                <h4>Box64 ve Turnip Sürücüleri</h4>
                <p>Oyunun kasmaması için Snapdragon işlemcili cihazlarda <strong>Turnip</strong> sürücüsünü seçmelisiniz. Bu, GPU'nuzun gücünü tam kullanmanızı sağlar.</p>
              </div>

              <div className="setup-step">
                <div className="step-badge">ADIM 3</div>
                <h4>GameHub Bridge Bağlantısı</h4>
                <p>GameHub ayarlarından "Enable Native Bridge" seçeneğini aktif edin. Artık launcher üzerinden "Launch" dediğinizde oyun otomatik olarak Winlator içerisinde açılacaktır.</p>
              </div>

              <div className="mobile-warning">
                <Shield size={20} />
                <span><strong>ÖNEMLİ:</strong> Sadece Snapdragon (Adreno GPU) işlemcili telefonlarda yüksek performans alabilirsiniz. Exynos ve MTK işlemcilerde uyumluluk daha düşüktür.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksModal;
