import { useState } from 'react';
import { X, Lock, ShieldCheck, Globe, User, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './PlatformConnectModal.css';

interface PlatformConnectModalProps {
  platform: 'steam' | 'epic' | 'gog';
  onClose: () => void;
  onSuccess: (platform: string, games?: any[]) => void;
}

const PlatformConnectModal = ({ platform, onClose, onSuccess }: PlatformConnectModalProps) => {
  const [step, setStep] = useState<'login' | 'fetching' | 'error' | 'paste_code'>('login');
  const [epicCode, setEpicCode] = useState('');
  const [steamId, setSteamId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState('');
  const [fetchedCount, setFetchedCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const platformNames: Record<string, string> = {
    steam: 'Steam',
    epic: 'Epic Games',
    gog: 'GOG Galaxy'
  };

  // === STEAM: User only enters Steam ID, API key is on server ===
  const handleSteamConnect = async () => {
    if (!steamId) return;
    setStep('fetching');
    setErrorMsg('');

    try {
      // Resolve vanity URL if needed
      let resolvedId = steamId.trim();
      if (!/^\d{17}$/.test(resolvedId)) {
        try {
          const resolveRes = await fetch(`http://localhost:3001/api/steam/resolve?vanityurl=${resolvedId}`);
          const resolveData = await resolveRes.json();
          if (resolveData.steamid) resolvedId = resolveData.steamid;
        } catch { /* use as-is */ }
      }

      // Get player info
      try {
        const playerRes = await fetch(`http://localhost:3001/api/steam/player?steamid=${resolvedId}`);
        const playerData = await playerRes.json();
        if (playerData.personaname) {
          setPlayerName(playerData.personaname);
          setPlayerAvatar(playerData.avatarfull);
        }
      } catch { /* non-critical */ }

      // Get games
      const gamesRes = await fetch(`http://localhost:3001/api/steam/games?steamid=${resolvedId}`);
      const gamesData = await gamesRes.json();

      if (gamesData.error) {
        setStep('error');
        setErrorMsg(gamesData.error);
        return;
      }

      setFetchedCount(gamesData.count);
      setTimeout(() => onSuccess(platform, gamesData.games), 2000);
    } catch {
      setStep('error');
      setErrorMsg('Backend server not running. Run: node server/index.mjs');
    }
  };

  // === EPIC: Opens real Epic login, auto-captures via server callback ===
  const handleEpicConnect = () => {
    const epicLoginUrl = 'https://www.epicgames.com/id/login?redirectUrl=https%3A%2F%2Fwww.epicgames.com%2Fid%2Fapi%2Fredirect%3FclientId%3D34a02cf8f4414e29b15921876da36f9a%26responseType%3Dcode';
    window.open(epicLoginUrl, 'epic_login', 'width=500,height=700');
    // Stay on login screen so user can paste the code

    // Listen for postMessage from the callback page (auto mode)
    // AND provide manual paste fallback after 30 seconds
    const messageHandler = async (event: MessageEvent) => {
      if (event.data?.type === 'EPIC_AUTH_SUCCESS') {
        window.removeEventListener('message', messageHandler);
        setPlayerName(event.data.displayName || 'Epic User');
        
        // Fetch library with the token
        try {
          const libRes = await fetch(`http://localhost:3001/api/epic/library?token=${event.data.access_token}`);
          const libData = await libRes.json();
          if (libData.games?.length > 0) {
            setFetchedCount(libData.count);
            setTimeout(() => onSuccess(platform, libData.games), 1500);
          } else {
            onSuccess(platform);
          }
        } catch {
          onSuccess(platform);
        }
      }
    };
    window.addEventListener('message', messageHandler);
  };

  const handleEpicCodeSubmit = async () => {
    if (!epicCode.trim()) return;
    setStep('fetching');
    try {
      const tokenRes = await fetch('http://localhost:3001/api/epic/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorizationCode: epicCode.trim() }),
      });
      const tokenData = await tokenRes.json();

      if (tokenData.access_token) {
        setPlayerName(tokenData.displayName || 'Epic User');
        const libRes = await fetch(`http://localhost:3001/api/epic/library?token=${tokenData.access_token}`);
        const libData = await libRes.json();
        if (libData.games?.length > 0) {
          setFetchedCount(libData.count);
          setTimeout(() => onSuccess(platform, libData.games), 1500);
        } else {
          onSuccess(platform);
        }
      } else {
        setStep('error');
        setErrorMsg(tokenData.error || 'Token exchange failed. Code may have expired — try again.');
      }
    } catch {
      setStep('error');
      setErrorMsg('Backend not running. Start with: node server/index.mjs');
    }
  };

  // === GOG: Opens real GOG login ===
  const handleGogConnect = () => {
    const gogLoginUrl = `https://auth.gog.com/auth?client_id=46899977096215655&redirect_uri=https%3A%2F%2Fembed.gog.com%2Fon_login_success%3Forigin%3Dclient&response_type=code&layout=client2`;
    const popup = window.open(gogLoginUrl, 'gog_login', 'width=500,height=700');
    setStep('fetching');

    const pollTimer = setInterval(async () => {
      try {
        if (!popup || popup.closed) {
          clearInterval(pollTimer);
          setStep('error');
          setErrorMsg('Login window was closed.');
          return;
        }
        const popupUrl = popup.location.href;
        if (popupUrl.includes('code=')) {
          clearInterval(pollTimer);
          const urlParams = new URLSearchParams(new URL(popupUrl).search);
          const code = urlParams.get('code');
          popup.close();

          if (code) {
            const tokenRes = await fetch('http://localhost:3001/api/gog/auth', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });
            const tokenData = await tokenRes.json();
            if (tokenData.access_token) {
              const libRes = await fetch(`http://localhost:3001/api/gog/library?token=${tokenData.access_token}`);
              const libData = await libRes.json();
              if (libData.games?.length > 0) {
                setFetchedCount(libData.count);
                setTimeout(() => onSuccess(platform, libData.games), 1500);
              } else {
                onSuccess(platform);
              }
            }
          }
        }
      } catch {
        // Cross-origin, keep polling
      }
    }, 1000);
  };

  return (
    <div className="oauth-overlay fade-enter-active">
      <div className="oauth-window" style={{ maxWidth: platform === 'steam' ? 480 : 440 }}>
        <div className="oauth-header">
          <div className="oauth-browser-controls">
            <span className="dot close" onClick={onClose}></span>
            <span className="dot minimize"></span>
            <span className="dot expand"></span>
          </div>
          <div className="oauth-url-bar">
            <Lock size={12} color="#10b981" />
            <span>
              {platform === 'steam' && 'api.steampowered.com — Secure Connection'}
              {platform === 'epic' && 'epicgames.com/id/login — OAuth2'}
              {platform === 'gog' && 'auth.gog.com — OAuth2'}
            </span>
          </div>
        </div>

        <div className={`oauth-content ${platform}`}>

          {/* ========== STEAM ========== */}
          {platform === 'steam' && step === 'login' && (
            <div className="steam-api-form">
              <div className="steam-logo-area">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg" alt="Steam" style={{width: 48, height: 48}} />
                <h2>Connect Your Steam Library</h2>
                <p className="steam-subtitle">Enter your Steam ID to sync your real game library. No password needed!</p>
              </div>

              <div className="api-input-group">
                <label><User size={14} /> Steam ID or Custom URL Name</label>
                <input
                  type="text"
                  value={steamId}
                  onChange={e => setSteamId(e.target.value)}
                  placeholder="76561198XXXXXXXXX or your custom URL name"
                  onKeyDown={e => e.key === 'Enter' && handleSteamConnect()}
                />
                <a href="https://steamid.io" target="_blank" rel="noreferrer" className="api-help-link">
                  → Find your Steam ID here (steamid.io)
                </a>
              </div>

              <button className="oauth-btn primary" onClick={handleSteamConnect} disabled={!steamId}>
                <Globe size={16} /> Connect & Sync Library
              </button>

              <div className="api-security-note">
                <ShieldCheck size={14} color="#10b981" />
                <span>GameHub sadece herkese açık oyun listenķi okur. Şifre, giriş bilgisi veya kişisel veri saklanmaz.</span>
              </div>

              <button className="info-toggle" onClick={() => setShowInfo(!showInfo)}>
                <Info size={14} />
                {showInfo ? 'Bilgilendirmeyi Gizle' : 'Nasıl Yapılır? (Sık Sorulan Sorular)'}
                {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showInfo && (
                <div className="info-panel">
                  <div className="info-item">
                    <strong>🔍 Steam ID nedir, nereden bulunur?</strong>
                    <p>Steam ID, 17 haneli benzersiz numaranızdır. Steam profilinize gidin → URL'İdeki sayı sizin Steam ID'nizdir. Örnek: <code>76561198XXXXXXXXX</code>. Alternatif olarak özel URL adınızı da girebilirsiniz.</p>
                  </div>
                  <div className="info-item">
                    <strong>🔓 Profilimi Public yapmam lazım mı?</strong>
                    <p>Evet! Steam → Ayarlar → Gizlilik → <b>"Oyun Detayları"</b> kısmını <b>"Herkese Açık"</b> yapın. Yoksa oyunlarınızı göremeyiz.</p>
                  </div>
                  <div className="info-item">
                    <strong>📱 Steam oyunları telefonda nasıl çalışır?</strong>
                    <p>Proton (Wine) + Box64 + DXVK pipeline'ı ile. Windows oyun dosyası ARM işlemcide çalışacak şekilde çevrilir. Snapdragon 8 Gen 1+ işlemci önerilir.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== EPIC ========== */}
          {platform === 'epic' && (step === 'login' || step === 'paste_code') && (
            <div className="steam-api-form">
              <div className="steam-logo-area">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Epic_Games_logo.svg" alt="Epic" style={{width: 48, height: 48, filter: 'invert(1)'}} />
                <h2>Connect Epic Games</h2>
              </div>

              <div className="epic-steps">
                <div className="epic-step">
                  <span className="step-number">1</span>
                  <div className="step-content">
                    <strong>Epic Games'e giriş yap</strong>
                    <p>Açılan pencerede Epic hesabınla giriş yap</p>
                    <button className="oauth-btn primary" onClick={handleEpicConnect} style={{marginTop: 8}}>
                      <Globe size={16} /> Epic Games Giriş Sayfasını Aç
                    </button>
                  </div>
                </div>

                <div className="epic-step">
                  <span className="step-number">2</span>
                  <div className="step-content">
                    <strong>Kodu kopyala ve yapıştır</strong>
                    <p>Giriş yaptıktan sonra ekrana bir kod gelecek. <b>"authorizationCode"</b> yanındaki kodu kopyala ve aşağıya yapıştır.</p>
                    <div className="api-input-group" style={{marginTop: 8}}>
                      <input
                        type="text"
                        value={epicCode}
                        onChange={e => setEpicCode(e.target.value)}
                        placeholder="Kodu buraya yapıştır..."
                        onKeyDown={e => e.key === 'Enter' && handleEpicCodeSubmit()}
                        style={{fontFamily: 'monospace', letterSpacing: '1px'}}
                      />
                    </div>
                    <button className="oauth-btn primary" onClick={handleEpicCodeSubmit} disabled={!epicCode.trim()} style={{marginTop: 8}}>
                      <Globe size={16} /> Kütüphaneyi Senkronize Et
                    </button>
                  </div>
                </div>
              </div>

              <div className="api-security-note">
                <ShieldCheck size={14} color="#10b981" />
                <span>Şifren sadece Epic Games'in kendi sitesine giriliyor. GameHub şifreni görmez ve saklamaz.</span>
              </div>
            </div>
          )}

          {/* ========== GOG ========== */}
          {platform === 'gog' && step === 'login' && (
            <div className="steam-api-form">
              <div className="steam-logo-area">
                <span style={{fontSize: 36, fontWeight: 'bold', color: '#c0392b'}}>GOG</span>
                <h2>Connect GOG Galaxy</h2>
                <p className="steam-subtitle">GOG hesabınızla giriş yapın ve kütühhanenizi senkronize edin.</p>
              </div>
              <button className="oauth-btn primary" onClick={handleGogConnect}>
                <Globe size={16} /> GOG Giriş Sayfasını Aç
              </button>
              <div className="api-security-note">
                <ShieldCheck size={14} color="#10b981" />
                <span>Resmi GOG OAuth2 akışı kullanılır. Şifreniz sadece gog.com'da girilir.</span>
              </div>

              <button className="info-toggle" onClick={() => setShowInfo(!showInfo)}>
                <Info size={14} />
                {showInfo ? 'Gizle' : 'GOG hakkında bilgi'}
                {showInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {showInfo && (
                <div className="info-panel">
                  <div className="info-item">
                    <strong>🔓 DRM-Free ne demek?</strong>
                    <p>GOG oyunları kopya koruması içermez. Bu, emülasyonda daha az sorun çıkması demektir. Çevrimdışı bile çalışırlar.</p>
                  </div>
                  <div className="info-item">
                    <strong>📦 GOG oyunları nasıl yüklenir?</strong>
                    <p>GOG oyunları doğrudan .exe installer olarak gelir. Wine üzerinden kurulum yapılır — Steam'deki gibi ekstra DRM kontrolü yoktur.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========== FETCHING (all platforms) ========== */}
          {step === 'fetching' && (
            <div className="steam-fetching">
              {playerAvatar && <img src={playerAvatar} alt="avatar" className="player-avatar" />}
              {playerName && <h3 className="player-name">Welcome, {playerName}!</h3>}
              <div className="spinner"></div>
              <h3 style={{color: 'white', marginTop: 16}}>
                {fetchedCount > 0 ? `${fetchedCount} games found!` : `Connecting to ${platformNames[platform]}...`}
              </h3>
              <p style={{color: '#aaa', fontSize: 13}}>
                {fetchedCount > 0 ? 'Adding games to your GameHub library...' : `Fetching your ${platformNames[platform]} library...`}
              </p>
            </div>
          )}

          {/* ========== ERROR ========== */}
          {step === 'error' && (
            <div className="steam-error">
              <div style={{fontSize: 48, marginBottom: 16}}>⚠️</div>
              <h3 style={{color: '#ef4444', marginBottom: 10}}>Connection Failed</h3>
              <p style={{color: '#aaa', fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 1.5}}>{errorMsg}</p>
              <button className="oauth-btn primary" onClick={() => setStep('login')}>Try Again</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformConnectModal;
