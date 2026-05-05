import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// SERVER-SIDE API KEYS — Users never see these
// ============================================
const STEAM_API_KEY = 'DD4A53E631AD3EACA480D83DB913A912';

const STEAM_API_BASE = 'https://api.steampowered.com';

// ============================================
// STEAM ENDPOINTS
// ============================================

// GET /api/steam/games?steamid=XXXXX
app.get('/api/steam/games', async (req, res) => {
  const { steamid } = req.query;
  if (!steamid) return res.status(400).json({ error: 'steamid is required' });

  try {
    const url = `${STEAM_API_BASE}/IPlayerService/GetOwnedGames/v1/?key=${STEAM_API_KEY}&steamid=${steamid}&include_appinfo=true&include_played_free_games=true&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.response || !data.response.games) {
      return res.status(404).json({ error: 'No games found. Make sure your Steam profile game details are set to Public.' });
    }

    const games = data.response.games.map((game) => ({
      id: `steam-${game.appid}`,
      appid: game.appid,
      title: game.name,
      platform: 'steam',
      image: `https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/library_600x900_2x.jpg`,
      headerImage: `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
      playtimeMinutes: game.playtime_forever || 0,
      lastPlayed: game.rtime_last_played || 0,
      installed: false,
      active: false,
    }));

    games.sort((a, b) => b.playtimeMinutes - a.playtimeMinutes);
    res.json({ count: games.length, games });
  } catch (err) {
    console.error('Steam API error:', err);
    res.status(500).json({ error: 'Failed to fetch Steam library' });
  }
});

// GET /api/steam/player?steamid=XXXXX
app.get('/api/steam/player', async (req, res) => {
  const { steamid } = req.query;
  if (!steamid) return res.status(400).json({ error: 'steamid is required' });

  try {
    const url = `${STEAM_API_BASE}/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${steamid}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.response?.players?.length > 0) {
      const p = data.response.players[0];
      res.json({ steamid: p.steamid, personaname: p.personaname, avatarfull: p.avatarfull, profileurl: p.profileurl });
    } else {
      res.status(404).json({ error: 'Player not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch player info' });
  }
});

// GET /api/steam/resolve?vanityurl=XXXXX
app.get('/api/steam/resolve', async (req, res) => {
  const { vanityurl } = req.query;
  if (!vanityurl) return res.status(400).json({ error: 'vanityurl is required' });

  try {
    const url = `${STEAM_API_BASE}/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanityurl}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.response?.success === 1) {
      res.json({ steamid: data.response.steamid });
    } else {
      res.status(404).json({ error: 'Vanity URL not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to resolve vanity URL' });
  }
});

// ============================================
// EPIC GAMES — Using Legendary client creds
// (Same method BannerHub uses)
// ============================================
const EPIC_CLIENT_ID = '34a02cf8f4414e29b15921876da36f9a';
const EPIC_CLIENT_SECRET = 'daafbccc737745039dffe53d94fc76cf';
const EPIC_TOKEN_URL = 'https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token';
const EPIC_LIBRARY_URL = 'https://library-service.live.use1a.on.epicgames.com/library/api/public/items';
const EPIC_CATALOG_URL = 'https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/namespace';

// Epic callback — browser redirects here after login, auto-exchanges code
app.get('/api/epic/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.send(`<html><body style="background:#111;color:white;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh"><h2>❌ No authorization code received</h2></body></html>`);
  }

  try {
    // Exchange auth code for tokens
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
    });

    const tokenRes = await fetch(EPIC_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${EPIC_CLIENT_ID}:${EPIC_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.send(`<html><body style="background:#111;color:#ef4444;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column"><h2>❌ Auth Failed</h2><p>Code may have expired. Close this and try again.</p></body></html>`);
    }

    // Send token data back to the opener (our GameHub app) via postMessage
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Epic Games — Connected!</title></head>
      <body style="background:#111;color:white;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;flex-direction:column">
        <h2 style="color:#10b981">✅ Successfully connected!</h2>
        <p>Welcome, <b>${tokenData.displayName || 'Epic User'}</b>!</p>
        <p style="color:#888">Syncing your library... This window will close automatically.</p>
        <script>
          if (window.opener) {
            window.opener.postMessage({
              type: 'EPIC_AUTH_SUCCESS',
              access_token: '${tokenData.access_token}',
              account_id: '${tokenData.account_id || ''}',
              displayName: '${tokenData.displayName || 'Epic User'}'
            }, '*');
            setTimeout(() => window.close(), 2000);
          }
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    res.send(`<html><body style="background:#111;color:#ef4444;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh"><h2>❌ Server Error</h2></body></html>`);
  }
});

// POST /api/epic/auth — Exchange authorization code for tokens (manual fallback)
app.post('/api/epic/auth', async (req, res) => {
  const { authorizationCode } = req.body;
  if (!authorizationCode) return res.status(400).json({ error: 'authorizationCode is required' });

  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: authorizationCode,
    });

    const response = await fetch(EPIC_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${EPIC_CLIENT_ID}:${EPIC_CLIENT_SECRET}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();
    if (data.access_token) {
      res.json({
        access_token: data.access_token,
        account_id: data.account_id,
        displayName: data.displayName,
        expires_in: data.expires_in,
      });
    } else {
      res.status(401).json({ error: 'Auth failed', details: data });
    }
  } catch (err) {
    res.status(500).json({ error: 'Epic auth failed' });
  }
});

// GET /api/epic/library?token=XXX&account_id=XXX
app.get('/api/epic/library', async (req, res) => {
  const { token, account_id } = req.query;
  if (!token) return res.status(400).json({ error: 'token is required' });

  try {
    // Step 1: Get library items
    const response = await fetch(`${EPIC_LIBRARY_URL}?includeMetadata=true`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();

    if (!data.records) {
      return res.status(404).json({ error: 'No library data' });
    }

    // Step 2: Collect unique namespaces to fetch catalog metadata
    const uniqueNamespaces = [...new Set(data.records.map(r => r.namespace).filter(Boolean))];
    
    // Step 3: Fetch catalog data for each namespace (in batches)
    const catalogMap = new Map();
    
    for (const ns of uniqueNamespaces) {
      try {
        const catRes = await fetch(
          `${EPIC_CATALOG_URL}/${ns}/bulk/items?country=TR&locale=en`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        if (catRes.ok) {
          const catData = await catRes.json();
          for (const [itemId, item] of Object.entries(catData)) {
            catalogMap.set(itemId, item);
          }
        }
      } catch {
        // Skip failed catalog lookups
      }
    }

    // Step 4: Build enriched game list
    const games = [];
    const seenIds = new Set();

    for (const record of data.records) {
      if (!record.catalogItemId || seenIds.has(record.catalogItemId)) continue;
      seenIds.add(record.catalogItemId);

      const catItem = catalogMap.get(record.catalogItemId);
      
      // Get the real title
      let title = catItem?.title || record.appName || record.catalogItemId;
      
      // Skip UE marketplace assets, DLCs with no real title, and internal items
      if (!catItem && (title.length === 32 || title.includes('V1') || title.includes('V2'))) continue;
      if (catItem?.categories?.some(c => c.path === 'assets')) continue;

      // Get cover image
      let image = '';
      if (catItem?.keyImages) {
        const tall = catItem.keyImages.find(i => i.type === 'DieselGameBoxTall');
        const wide = catItem.keyImages.find(i => i.type === 'DieselGameBox');
        const thumb = catItem.keyImages.find(i => i.type === 'Thumbnail');
        image = (tall || wide || thumb)?.url || '';
      }

      games.push({
        id: `epic-${record.catalogItemId}`,
        title,
        platform: 'epic',
        image,
        installed: false,
        active: false,
      });
    }

    res.json({ count: games.length, games });
  } catch (err) {
    console.error('Epic library error:', err);
    res.status(500).json({ error: 'Failed to fetch Epic library' });
  }
});

// ============================================
// GOG — OAuth2 flow
// ============================================
const GOG_CLIENT_ID = '46899977096215655';
const GOG_CLIENT_SECRET = '9d85c43b1482497dbbce61f6e4aa173a433796eebd2c1f0f';
const GOG_TOKEN_URL = 'https://auth.gog.com/token';
const GOG_LIBRARY_URL = 'https://embed.gog.com/account/getFilteredProducts';

// POST /api/gog/auth
app.post('/api/gog/auth', async (req, res) => {
  const { code, redirect_uri } = req.body;
  if (!code) return res.status(400).json({ error: 'code is required' });

  try {
    const params = new URLSearchParams({
      client_id: GOG_CLIENT_ID,
      client_secret: GOG_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirect_uri || 'https://embed.gog.com/on_login_success?origin=client',
    });

    const response = await fetch(`${GOG_TOKEN_URL}?${params.toString()}`);
    const data = await response.json();

    if (data.access_token) {
      res.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        user_id: data.user_id,
      });
    } else {
      res.status(401).json({ error: 'GOG auth failed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'GOG auth failed' });
  }
});

// GET /api/gog/library?token=XXX
app.get('/api/gog/library', async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ error: 'token is required' });

  try {
    const response = await fetch(`${GOG_LIBRARY_URL}?mediaType=1&page=1`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const data = await response.json();

    if (data.products) {
      const games = data.products.map((p) => ({
        id: `gog-${p.id}`,
        title: p.title,
        platform: 'gog',
        image: p.image ? `https:${p.image}_392.jpg` : '',
        installed: false,
        active: false,
      }));
      res.json({ count: games.length, games });
    } else {
      res.status(404).json({ error: 'No GOG library data' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch GOG library' });
  }
});

const PORT = 3001;

// === SYSTEM ENGINE: Real Game Installation & Launch ===

let systemLogs = [
  { time: new Date().toLocaleTimeString(), msg: 'System Engine initialized.', type: 'info' }
];

const addLog = (msg, type = 'info') => {
  systemLogs.push({ time: new Date().toLocaleTimeString(), msg, type });
  if (systemLogs.length > 500) systemLogs.shift(); // Keep last 500 lines
};

app.get('/api/system/logs', (req, res) => {
  res.json(systemLogs);
});

// Check for required tools (Wine, Box64, etc.)
app.get('/api/system/status', async (req, res) => {
  const checkCommand = (cmd) => {
    return new Promise((resolve) => {
      const p = spawn('which', [cmd]);
      p.on('close', (code) => resolve(code === 0));
    });
  };

  res.json({
    wine: await checkCommand('wine'),
    box64: await checkCommand('box64'),
    legendary: await checkCommand('legendary'),
    steamcmd: await checkCommand('steamcmd'),
    dxvk: fs.existsSync('./drivers/dxvk'),
    storage: {
      total: '256GB',
      free: '112GB'
    }
  });
});

// Execute Installation (Legendary for Epic, SteamCMD for Steam)
app.post('/api/system/install', (req, res) => {
  const { platform, gameId, title } = req.body;
  
  // Real command selection
  let cmd = '';
  let args = [];

  if (platform === 'epic') {
    cmd = 'legendary';
    args = ['install', gameId, '--yes'];
  } else if (platform === 'steam') {
    cmd = 'steamcmd';
    args = ['+login', 'anonymous', '+app_update', gameId, 'validate', '+quit'];
  }

  if (!cmd) return res.status(400).json({ error: 'Unsupported platform' });

  console.log(`Starting installation: ${cmd} ${args.join(' ')}`);
  addLog(`Starting installation: ${cmd} ${args.join(' ')}`, 'command');

  const process = spawn(cmd, args);

  process.stdout.on('data', (data) => {
    const line = data.toString().trim();
    if (line) addLog(line, 'stdout');
  });

  process.stderr.on('data', (data) => {
    const line = data.toString().trim();
    if (line) addLog(`ERROR: ${line}`, 'stderr');
  });

  process.on('close', (code) => {
    addLog(`Installation process finished with code ${code}`, code === 0 ? 'success' : 'error');
  });

  res.json({ status: 'started', pid: process.pid });
});

// Launch Game via Wine/Box64
app.post('/api/system/launch', (req, res) => {
  const { gamePath, useBox64 = true } = req.body;

  let cmd = 'wine';
  let args = [gamePath];

  if (useBox64) {
    cmd = 'box64';
    args = ['wine', gamePath];
  }

  const process = spawn(cmd, args);
  res.json({ status: 'launched', pid: process.pid });
});

app.listen(PORT, () => {
  console.log(`\n🎮 GameHub API Server running on http://localhost:${PORT}`);
  console.log(`\n📡 Steam Endpoints (API Key hidden server-side):`);
  console.log(`   GET /api/steam/games?steamid=XXX`);
  console.log(`   GET /api/steam/player?steamid=XXX`);
  console.log(`   GET /api/steam/resolve?vanityurl=XXX`);
  console.log(`\n📡 Epic Endpoints:`);
  console.log(`   POST /api/epic/auth { authorizationCode }`);
  console.log(`   GET  /api/epic/library?token=XXX`);
  console.log(`\n📡 GOG Endpoints:`);
  console.log(`   POST /api/gog/auth { code }`);
  console.log(`   GET  /api/gog/library?token=XXX`);
});
