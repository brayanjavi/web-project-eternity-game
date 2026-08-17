/**
 * ETERNO - A Philosophical RPG Prototype
 * Based on Nietzsche's eternal return.
 */

// --- DOM & Setup ---
document.body.style.margin = '0';
document.body.style.padding = '0';
document.body.style.backgroundColor = '#000';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.height = '100vh';
document.body.style.overflow = 'hidden';
document.body.style.fontFamily = 'monospace';

const style = document.createElement('style');
style.innerHTML = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  #gameContainer {
    position: relative;
    width: 960px;
    max-width: 100vw;
    aspect-ratio: 4/3;
    max-height: 100vh;
  }
  canvas {
    width: 100%; height: 100%;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    border: 2px solid #1a1a2a;
    box-shadow: 0 0 40px rgba(139,92,246,0.12), 0 0 80px rgba(0,0,0,0.8);
  }
  .hud {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; font-family: 'Press Start 2P', monospace;
  }
  .stats {
    position: absolute; bottom: 12px; left: 12px;
    display: flex; flex-direction: column; gap: 6px;
    background: rgba(8,8,15,0.85);
    padding: 10px 14px; border-radius: 4px;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .stat-row {
    display: flex; align-items: center; gap: 8px;
    font-size: 8px; color: #bbb; text-shadow: 1px 1px 0 #000;
  }
  .stat-bar-bg {
    width: 80px; height: 6px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 2px;
  }
  .stat-bar-fill { height: 100%; transition: width 0.5s ease; border-radius: 1px; }
  .top-right {
    position: absolute; top: 12px; right: 12px;
    text-align: right; font-size: 9px;
    color: #d4a843; text-shadow: 1px 1px 0 #000;
    background: rgba(8,8,15,0.85);
    padding: 8px 12px; border-radius: 4px;
    border: 1px solid rgba(212,168,67,0.15);
    line-height: 1.8;
  }
  .dialog-box {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    width: 88%; background: rgba(8,8,15,0.95);
    border: 2px solid rgba(255,255,255,0.12);
    border-radius: 4px; padding: 14px 18px;
    color: #eee; font-size: 10px; display: none; flex-direction: column;
    pointer-events: auto; font-family: 'Press Start 2P', monospace;
    box-shadow: 0 4px 30px rgba(0,0,0,0.6);
  }
  .dialog-speaker { color: #d4a843; font-weight: bold; margin-bottom: 8px; font-size: 10px; letter-spacing: 1px; }
  .dialog-text { flex-grow: 1; margin-bottom: 8px; white-space: pre-wrap; line-height: 1.8; font-size: 9px; }
  .dialog-choices { display: flex; flex-direction: column; gap: 6px; margin-top: auto; }
  .choice-btn {
    background: rgba(30,30,50,0.8); border: 1px solid rgba(139,92,246,0.2);
    color: #ccc; padding: 8px 12px; text-align: left; cursor: pointer;
    font-family: 'Press Start 2P', monospace; font-size: 8px;
    border-radius: 3px; transition: all 0.2s; line-height: 1.6;
  }
  .choice-btn:hover { background: rgba(139,92,246,0.15); border-color: #8b5cf6; color: #fff; }
  .notification {
    position: absolute; top: 20%; left: 50%; transform: translateX(-50%);
    background: rgba(8,8,15,0.9); color: #d4a843;
    padding: 12px 24px; border-radius: 4px;
    font-size: 10px; opacity: 0; transition: opacity 0.4s;
    text-align: center; border: 1px solid rgba(212,168,67,0.2);
    font-family: 'Press Start 2P', monospace;
    text-shadow: 0 0 10px rgba(212,168,67,0.3);
  }
  .overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: #08080f; display: flex; flex-direction: column;
    justify-content: center; align-items: center; color: #fff;
    opacity: 0; pointer-events: none; transition: opacity 0.5s; z-index: 10;
    font-family: 'Press Start 2P', monospace;
  }
  .title-screen {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: radial-gradient(ellipse at center, #12121e 0%, #08080f 70%);
    display: flex; flex-direction: column; justify-content: center; align-items: center;
    color: #fff; z-index: 20; font-family: 'Press Start 2P', monospace;
  }
  .title-text {
    font-size: 48px; letter-spacing: 12px; margin-bottom: 24px;
    background: linear-gradient(135deg, #d4a843, #f0d78c, #a78bfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    filter: drop-shadow(0 0 20px rgba(212,168,67,0.4));
  }
  .title-sub { color: #9892a6; font-size: 10px; margin-bottom: 40px; letter-spacing: 2px; }
  .title-quote {
    color: #5a5470; font-size: 8px; max-width: 420px; text-align: center;
    line-height: 2; font-style: italic; margin-top: 20px;
  }
  .title-controls { color: #3a3450; font-size: 7px; margin-top: 30px; letter-spacing: 1px; }
  .blink { animation: blink 1.2s ease-in-out infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  .map-overlay {
    position: absolute; top: 5%; left: 5%; width: 90%; height: 90%;
    background: rgba(8,8,15,0.97); border: 2px solid rgba(255,255,255,0.1);
    display: none; flex-direction: column; align-items: center;
    color: #fff; z-index: 15; pointer-events: auto; padding: 20px;
    box-sizing: border-box; font-family: 'Press Start 2P', monospace; border-radius: 4px;
  }
  .map-grid {
    display: grid; grid-template-columns: 1fr 1fr 1fr;
    gap: 10px; width: 100%; flex: 1; margin-top: 16px;
  }
  .map-node {
    border: 1px solid rgba(255,255,255,0.1); display: flex;
    justify-content: center; align-items: center; cursor: pointer;
    transition: all 0.2s; background: rgba(0,0,0,0.5);
    font-family: 'Press Start 2P', monospace; font-size: 8px;
    color: #9892a6; border-radius: 3px;
  }
  .map-node:hover { background: rgba(139,92,246,0.15); border-color: #8b5cf6; color: #fff; }
  .map-node.active { border-color: #d4a843; background: rgba(212,168,67,0.1); color: #d4a843; }

  /* Star Wars Crawl Intro Styles */
  .starwars-screen {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: #000; display: none; flex-direction: column;
    justify-content: center; align-items: center; overflow: hidden;
    z-index: 30; font-family: 'Press Start 2P', monospace;
    perspective: 300px;
  }
  .crawl-container {
    position: absolute; bottom: 0; width: 80%; height: 100%;
    transform-origin: 50% 100%; transform: rotateX(25deg);
    overflow: hidden; pointer-events: none;
  }
  .crawl-content {
    position: absolute; bottom: -120%; width: 100%;
    text-align: justify; color: #e5b13a; font-size: 11px;
    line-height: 2.2; text-shadow: 0 0 8px rgba(229,177,58,0.5);
    animation: crawlAnim 32s linear forwards;
  }
  .crawl-content h1 {
    text-align: center; color: #e5b13a; font-size: 18px; margin-bottom: 8px; letter-spacing: 4px;
  }
  .crawl-content h2 {
    text-align: center; color: #d4a843; font-size: 13px; margin-bottom: 24px; letter-spacing: 2px;
  }
  .crawl-content p { margin-bottom: 24px; }
  @keyframes crawlAnim {
    0% { bottom: -120%; opacity: 1; }
    90% { opacity: 1; }
    100% { bottom: 130%; opacity: 0; }
  }
  .skip-intro {
    position: absolute; bottom: 16px; right: 16px; z-index: 35;
    font-size: 8px; color: #666; background: rgba(0,0,0,0.7);
    padding: 6px 10px; border: 1px solid rgba(255,255,255,0.1); border-radius: 3px;
  }
`;
document.head.appendChild(style);

const container = document.createElement('div');
container.id = 'gameContainer';
document.body.appendChild(container);

const canvas = document.createElement('canvas');
canvas.width = 320;
canvas.height = 240;
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
container.appendChild(canvas);

const hud = document.createElement('div');
hud.className = 'hud';
container.appendChild(hud);

hud.innerHTML = `
  <div class="stats">
    <div class="stat-row"><span style="color:#8b5cf6;min-width:36px">VOL</span> <div class="stat-bar-bg"><div id="bar-vol" class="stat-bar-fill" style="background:linear-gradient(90deg,#8b5cf6,#a78bfa);"></div></div></div>
    <div class="stat-row"><span style="color:#ef4444;min-width:36px">NIH</span> <div class="stat-bar-bg"><div id="bar-nih" class="stat-bar-fill" style="background:linear-gradient(90deg,#ef4444,#f87171);"></div></div></div>
    <div class="stat-row"><span style="color:#d4a843;min-width:36px">AMO</span> <div class="stat-bar-bg"><div id="bar-amo" class="stat-bar-fill" style="background:linear-gradient(90deg,#d4a843,#f0d78c);"></div></div></div>
    <div class="stat-row"><span style="color:#06b6d4;min-width:36px">CRE</span> <div class="stat-bar-bg"><div id="bar-cre" class="stat-bar-fill" style="background:linear-gradient(90deg,#06b6d4,#22d3ee);"></div></div></div>
  </div>
  <div class="top-right">
    <div id="cycle-display">Ciclo 1</div>
    <div id="day-display">Día 1</div>
  </div>
`;

const dialogBox = document.createElement('div');
dialogBox.className = 'dialog-box';
dialogBox.innerHTML = `
  <div class="dialog-speaker" id="d-speaker"></div>
  <div class="dialog-text" id="d-text"></div>
  <div class="dialog-choices" id="d-choices"></div>
`;
container.appendChild(dialogBox);

const notification = document.createElement('div');
notification.className = 'notification';
notification.id = 'notification';
container.appendChild(notification);

const overlay = document.createElement('div');
overlay.className = 'overlay';
overlay.id = 'overlay';
container.appendChild(overlay);

const titleScreen = document.createElement('div');
titleScreen.className = 'title-screen';
titleScreen.id = 'title';
titleScreen.innerHTML = `
  <div class="title-text">ETERNO</div>
  <div class="title-sub">El conocimiento es el verdadero progreso</div>
  <div class="blink" style="font-size:10px;color:#d4a843;">Presiona ENTER para comenzar</div>
  <div class="title-quote">"Un RPG donde el progreso no depende del nivel del personaje, sino del conocimiento adquirido durante cada ciclo."</div>
  <div class="title-controls">WASD/Flechas: Mover · E: Interactuar · T: Avanzar Día · M: Mapa</div>
`;
container.appendChild(titleScreen);

const starWarsScreen = document.createElement('div');
starWarsScreen.className = 'starwars-screen';
starWarsScreen.id = 'starwars-screen';
starWarsScreen.innerHTML = `
  <div class="crawl-container">
    <div class="crawl-content" id="crawl-text">
      <h1>ETERNO</h1>
      <h2>EL RETORNO DE LO MISMO</h2>
      <p>En un mundo atrapado en un bucle infinito de 7 días, el tiempo no avanza... sólo se repite.</p>
      <p>Friedrich Nietzsche planteó la pregunta definitiva: "¿Qué harías si un demonio te dijera que tendrás que vivir esta misma vida exactamente igual, una y otra vez por toda la eternidad?"</p>
      <p>Aquí, el nivel y la fuerza física son una ilusión. El verdadero progreso es el CONOCIMIENTO adquirido en cada ciclo.</p>
      <p>--- INSTRUCCIONES DE JUEGO ---</p>
      <p>• WASD / FLECHAS: Muévete por la ciudad, bosque, catedral, mercado y biblioteca.</p>
      <p>• TECLA E / ESPACIO: Interactúa con personajes y objetos (libros, altares, cofres, tumbas).</p>
      <p>• TECLA T: Avanza el día. Cada día trae eventos filosóficos únicos. ¡El Día 5 llegará el Demonio!</p>
      <p>• TECLA M: Abre el mapa para viaje rápido.</p>
      <p>• TUS DECISIONES moldean 4 estadísticas: Voluntad (VOL), Nihilismo (NIH), Amor Fati (AMO) y Creación (CRE). Alcanza 80 en una para desbloquear 1 de los 5 finales filosóficos.</p>
    </div>
  </div>
  <div class="skip-intro">Presiona ENTER o ESPACIO para saltar</div>
`;
container.appendChild(starWarsScreen);

const mapUi = document.createElement('div');
mapUi.className = 'map-overlay';
mapUi.id = 'map-ui';
container.appendChild(mapUi);

// --- Constants & Data ---
const TILE_SIZE = 16;
const MAP_W = 20;
const MAP_H = 15;

const TILE_TYPES = {
  0: { name: 'void', color: '#0a0a14', walk: false },
  1: { name: 'stone_floor', color: '#4a4a58', walk: true },
  2: { name: 'grass', color: '#2a5a38', walk: true },
  3: { name: 'wall', color: '#3a3a48', walk: false },
  4: { name: 'path', color: '#5a5850', walk: true },
  5: { name: 'water', color: '#1a3a6a', walk: false },
  6: { name: 'tree_trunk', color: '#3a2a18', walk: false },
  7: { name: 'tree_canopy', color: '#1a5a2a', walk: false },
  8: { name: 'wood_floor', color: '#5a3a20', walk: true },
  9: { name: 'bookshelf', color: '#4a2a15', walk: false },
  10: { name: 'door', color: '#6a4a20', walk: true },
  11: { name: 'carpet', color: '#5a1a28', walk: true },
  12: { name: 'column', color: '#5a5a68', walk: false },
  13: { name: 'fountain_water', color: '#3a5a8a', walk: false },
  14: { name: 'market_stall', color: '#6a4a28', walk: false },
  15: { name: 'exit_marker', color: '#5a5850', walk: true },
  16: { name: 'grave', color: '#4a4a58', walk: false },
  17: { name: 'sand', color: '#8a7a50', walk: true },
  18: { name: 'altar', color: '#6a5a4a', walk: false },
  19: { name: 'torch', color: '#4a4a58', walk: true },
  20: { name: 'sign', color: '#5a3a20', walk: false },
  21: { name: 'chest', color: '#6a5a20', walk: false }
};

// Map builders
function buildMap(layoutData) {
  const map = [];
  for (let y = 0; y < MAP_H; y++) {
    const row = [];
    for (let x = 0; x < MAP_W; x++) {
      const char = layoutData[y][x];
      let t = 0;
      switch (char) {
        case 's': t = 1; break;
        case 'g': t = 2; break;
        case 'W': t = 3; break;
        case 'p': t = 4; break;
        case 'w': t = 5; break;
        case 'T': t = 6; break; // Base tree
        case 'C': t = 7; break; // Canopy
        case 'f': t = 8; break;
        case 'B': t = 9; break;
        case 'D': t = 10; break;
        case 'c': t = 11; break;
        case 'O': t = 12; break;
        case 'F': t = 13; break;
        case 'M': t = 14; break;
        case 'E': t = 15; break;
        case 'G': t = 16; break;
        case 'd': t = 17; break; // sand
        case 'A': t = 18; break;
        case 't': t = 19; break; // torch
        default: t = 0; break;
      }
      row.push(t);
    }
    map.push(row);
  }
  return map;
}

const mapStrings = {
  ciudad_central: [
    "WWWWWWWWWWWWWWWWWWWW",
    "WssssssssssssssssssW",
    "WsWWWDDWWWssWWWDDWWs",
    "Wstttsstttsstttsstts",
    "WssssssssssssssssssW",
    "WssppppppppppppppssW",
    "WsspsssssssssssspssW",
    "EppppssFFFFFFssppppE",
    "WsspsssFFFFFFssspssW",
    "WsspsssFFFFFFssspssW",
    "WsspsssssssssssspssW",
    "WssppppppppppppppssW",
    "CgCggssssssssssggCgC",
    "TggCggssppppssggCggT",
    "CgTggCgggEEgggCggTgC"
  ],
  mercado: [
    "WWWWWWWWWWWWWWWWWWWW",
    "WddddddddddddddddddW",
    "WddMMddddMMddddMMddW",
    "WddMMddddMMddddMMddW",
    "WddddddddddddddddddW",
    "WddddddddddddddddddW",
    "EpppppppdddddddddddW",
    "WddddddddddddddddddW",
    "WddMMddddMMddddddddW",
    "WddMMddddMMddddddddW",
    "WddddddddddddddddddW",
    "WddddddddddddddddddW",
    "WddddddddddddddddddW",
    "WddddddddddddddddddW",
    "WWWWWWWWWWWWWWWWWWWW"
  ],





  biblioteca: [
    "WWWWWWWWWWWWWWWWWWWW",
    "WffffffffffffffffffW",
    "WfBBBBBBBBBBBBBBBBfW",
    "WfBBBBBBBBBBBBBBBBfW",
    "WffffffffffffffffffW",
    "WffffccccccccffffffW",
    "WffffccccccccffffffE",
    "WffffccccccccffffffW",
    "WffffccccccccffffffW",
    "WfBBffffffffffffBBfW",
    "WfBBffffffffffffBBfW",
    "WffffffffffffffffffW",
    "WffffffffffffffffffW",
    "WffffffffffffffffffW",
    "WWWWWWWWWWWWWWWWWWWW"
  ],
  catedral: [
    "WWWWWWWWWWWWWWWWWWWW",
    "WssssssssAAssssssssW",
    "WssssssccccccssssssW",
    "WssssssccccccssssssW",
    "WOOssssccccccssssOOW",
    "WttssssccccccssssttW",
    "WssssssccccccssssssW",
    "WOOssssccccccssssOOW",
    "WttssssccccccssssttW",
    "WssssssccccccssssssW",
    "WOOssssccccccssssOOW",
    "WttssssccccccssssttW",
    "WssssssssssssssssssW",
    "WssssssssEEssssssssW",
    "WWWWWWWWWWWWWWWWWWWW"
  ],
  bosque: [
    "CTCTCTCTCTCTCTCTCTCT",
    "TggggggggEEggggggggC",
    "CggpCgpTppppTgpCggpT",
    "TgpCgpCggppggCgpCgpC",
    "CgpTgpCgCgpTgggpTgpT",
    "TgpppppppppgCggpTgpC",
    "CgCgCgCgCgpTgpCgCgpT",
    "TggTggTggTppppggTgpC",
    "CgpCgpCgCgpCggpCggpT",
    "TgpppppppppgCgppppgC",
    "CgCgTgpCgpTgggpTgpT",
    "TgggggpCgppppppgCgpC",
    "CgpTggppppGpppTgggpT",
    "TgpCggCgCggCgCggCgpC",
    "CTCTCTCTCTCTCTCTCTCT"
  ]
};

const maps = {
  ciudad_central: {
    tiles: buildMap(mapStrings.ciudad_central),
    name: 'Ciudad Central',
    exits: [
      { x: 0, y: 7, target: 'biblioteca', sx: 18, sy: 6 },
      { x: 19, y: 7, target: 'mercado', sx: 1, sy: 6 },
      { x: 9, y: 14, target: 'bosque', sx: 9, sy: 2 },
      { x: 10, y: 14, target: 'bosque', sx: 10, sy: 2 },
      // Top buildings exits
      { x: 4, y: 2, target: 'catedral', sx: 9, sy: 12 },
      { x: 5, y: 2, target: 'catedral', sx: 10, sy: 12 },
      { x: 13, y: 2, target: 'catedral', sx: 9, sy: 12 },
      { x: 14, y: 2, target: 'catedral', sx: 10, sy: 12 }
    ],
    npcs: [
      { id: 'guardian', name: 'Guardián', x: 7, y: 9, h: '#666', s: '#e0c0a0', c: '#4a5a8a', d: 'guardian_intro' },
      { id: 'vieja', name: 'Anciana', x: 15, y: 4, h: '#999', s: '#d0b090', c: '#5a3a5a', d: 'vieja' }
    ]
  },
  mercado: {
    tiles: buildMap(mapStrings.mercado),
    name: 'Mercado',
    exits: [
      { x: 0, y: 6, target: 'ciudad_central', sx: 18, sy: 7 }
    ],
    npcs: [
      { id: 'panadero', name: 'Panadero', x: 4, y: 4, h: '#5a3a20', s: '#f0d0b0', c: '#8a6a40', d: 'panadero_day1' },
      { id: 'mercader', name: 'Mercader', x: 12, y: 9, h: '#2a2a2a', s: '#c0a080', c: '#3a6a4a', d: 'mercader' }
    ]
  },
  biblioteca: {
    tiles: buildMap(mapStrings.biblioteca),
    name: 'Biblioteca',
    exits: [
      { x: 19, y: 6, target: 'ciudad_central', sx: 1, sy: 7 }
    ],
    npcs: [
      { id: 'bibliotecaria', name: 'Bibliotecaria', x: 9, y: 6, h: '#8a4a30', s: '#f0d0b0', c: '#4a4a6a', d: 'bibliotecaria' }
    ]
  },
  catedral: {
    tiles: buildMap(mapStrings.catedral),
    name: 'Catedral',
    exits: [
      { x: 9, y: 13, target: 'ciudad_central', sx: 4, sy: 3 },
      { x: 10, y: 13, target: 'ciudad_central', sx: 5, sy: 3 }
    ],
    npcs: [
      { id: 'sacerdote', name: 'Sacerdote', x: 9, y: 3, h: '#555', s: '#e0c0a0', c: '#2a2a2a', d: 'sacerdote' }
    ]
  },
  bosque: {
    tiles: buildMap(mapStrings.bosque),
    name: 'Bosque',
    exits: [
      { x: 9, y: 1, target: 'ciudad_central', sx: 9, sy: 13 },
      { x: 10, y: 1, target: 'ciudad_central', sx: 10, sy: 13 }
    ],
    npcs: [
      { id: 'misterioso', name: '???', x: 13, y: 12, h: '#222', s: '#aaa', c: '#1a1a2a', d: 'misterioso', cond: (g) => g.cycle > 3 }
    ]
  }
};

const dialogues = {
  guardian_intro: {
    speaker: 'Guardián',
    lines: [
      { text: 'Bienvenido a Ciudad Central, viajero.' },
      { text: '¿Es esta tu primera vez aquí? ...O quizás no.' },
      { text: 'Algo se siente diferente hoy, ¿no crees?',
        choices: [
          { text: 'Todo parece normal.', next: 'guardian_normal', effects: { nihilismo: 5 } },
          { text: 'Siento que ya he estado aquí.', next: 'guardian_remember', effects: { voluntad: 5 } }
        ]
      }
    ]
  },
  guardian_cycle2: {
    speaker: 'Guardián',
    lines: [
      { text: 'Tú... te conozco. ¿Nos hemos visto antes?' },
      { text: 'Hay algo en tus ojos que me resulta familiar.' },
      { text: 'Ten cuidado. El mundo no es tan estable como parece.' }
    ],
    effects: { voluntad: 5 }
  },
  guardian_normal: {
    speaker: 'Guardián',
    lines: [
      { text: 'Quizás tengas razón. Quizás es solo otro día.' },
      { text: 'El mercado está al este. La biblioteca al oeste.' }
    ]
  },
  guardian_remember: {
    speaker: 'Guardián',
    lines: [
      { text: '...Interesante. Muy pocos notan eso.' },
      { text: 'Presta atención a los detalles. No todo es lo que parece.' },
      { text: 'Habla con la gente. Descubre sus secretos.' }
    ],
    effects: { voluntad: 3 }
  },
  panadero_day1: {
    speaker: 'Panadero',
    lines: [
      { text: '¡Buenos días! El pan está recién hecho.' },
      { text: 'El festival del primer día siempre me pone de buen humor.' },
      { text: '¿Quieres un consejo? Disfruta estos momentos.' }
    ]
  },
  panadero_day5: {
    speaker: 'Panadero',
    lines: [
      { text: 'No... no me siento bien.' },
      { text: 'Hay algo en el aire... algo oscuro.' },
      { text: 'Si pudiera empezar de nuevo, haría las cosas diferente...' }
    ],
    effects: { nihilismo: 3 }
  },
  bibliotecaria: {
    speaker: 'Bibliotecaria',
    lines: [
      { text: 'He dedicado mi vida a estos libros.' },
      { text: 'Hay un texto antiguo que habla de un mundo que se repite...' },
      { text: '"El eterno retorno de lo mismo", decía un filósofo.',
        choices: [
          { text: '¿Cómo se rompe el ciclo?', next: 'biblio_romper', effects: { creacion: 5 } },
          { text: 'Quizás repetir no es malo.', next: 'biblio_aceptar', effects: { amorFati: 10 } }
        ]
      }
    ]
  },
  biblio_romper: {
    speaker: 'Bibliotecaria',
    lines: [
      { text: 'Esa es la pregunta, ¿verdad?' },
      { text: 'El filósofo decía que no se trata de romper el ciclo...' },
      { text: 'Sino de vivir de tal forma que QUIERAS repetirlo eternamente.' }
    ],
    effects: { amorFati: 5 }
  },
  biblio_aceptar: {
    speaker: 'Bibliotecaria',
    lines: [
      { text: 'Amor Fati... amor al destino.' },
      { text: 'Quizás la verdadera libertad no está en escapar...' },
      { text: 'Sino en abrazar cada momento como si lo eligieras.' }
    ]
  },
  sacerdote: {
    speaker: 'Sacerdote',
    lines: [
      { text: 'La catedral ha estado aquí desde antes que la ciudad.' },
      { text: 'La fe nos protege. Sin ella, ¿qué nos queda?' },
      { text: 'He escuchado rumores sobre la Torre del Retorno...',
        choices: [
          { text: 'La fe es una ilusión necesaria.', next: 'sacerdote_ilusion', effects: { nihilismo: 5 } },
          { text: 'La fe tiene un poder real.', next: 'sacerdote_fe', effects: { voluntad: 5 } },
          { text: 'Háblame de la Torre.', next: 'sacerdote_torre', effects: { creacion: 3 } }
        ]
      }
    ]
  },
  sacerdote_ilusion: {
    speaker: 'Sacerdote',
    lines: [
      { text: '...' },
      { text: 'Quizás. Pero incluso las ilusiones mantienen a la gente en pie.' },
      { text: 'Sin la catedral, esta ciudad caería en la desesperación.' }
    ]
  },
  sacerdote_fe: {
    speaker: 'Sacerdote',
    lines: [
      { text: 'Gracias, viajero. Es reconfortante escuchar eso.' },
      { text: 'La voluntad de creer es, en sí misma, una forma de poder.' }
    ]
  },
  sacerdote_torre: {
    speaker: 'Sacerdote',
    lines: [
      { text: 'La Torre del Retorno... dicen que es el origen de todo.' },
      { text: 'Nadie ha entrado y vuelto para contarlo.' },
      { text: 'O quizás sí... pero no lo recuerdan.' }
    ]
  },
  vieja: {
    speaker: 'Anciana',
    lines: [
      { text: 'Otra vez tú... ¿o es la primera vez?' },
      { text: 'Los ojos de un viajero que ha visto demasiado...' },
      { text: 'Cuida al panadero. El día 5 no es amable con él.' }
    ],
    effects: { voluntad: 2 }
  },
  mercader: {
    speaker: 'Mercader',
    lines: [
      { text: 'Compra, vende, intercambia... eso es lo que hago.' },
      { text: 'Pero aquí entre nos... el dinero no importa.' },
      { text: 'Lo único que vale la pena acumular es conocimiento.',
        choices: [
          { text: '¿Qué sabes tú?', next: 'mercader_saber', effects: { creacion: 3 } },
          { text: 'El dinero tiene su poder.', next: 'mercader_dinero', effects: { nihilismo: 3 } }
        ]
      }
    ]
  },
  mercader_saber: {
    speaker: 'Mercader',
    lines: [
      { text: 'Sé que este mundo no es lo que parece.' },
      { text: 'Sé que mañana todo seguirá igual... o quizás no.' },
      { text: 'Y sé que tú eres diferente a los demás.' }
    ]
  },
  mercader_dinero: {
    speaker: 'Mercader',
    lines: [
      { text: 'Ja. ¿Poder? Intenta llevarte el dinero al otro lado.' },
      { text: 'Cuando el ciclo termine, todo desaparece.' },
      { text: 'Todo... excepto lo que sabes.' }
    ],
    effects: { amorFati: 3 }
  },
  misterioso: {
    speaker: '???',
    lines: [
      { text: '...' },
      { text: 'Tú también lo sientes, ¿verdad?' },
      { text: 'El peso de haber estado aquí antes.' },
      { text: 'Yo llevo contando los ciclos. Perdí la cuenta hace mucho.' },
      { text: 'Pero tú... tú podrías ser diferente.',
        choices: [
          { text: '¿Quién eres?', next: 'misterioso_quien', effects: { creacion: 5, voluntad: 5 } },
          { text: '¿Cómo escapar?', next: 'misterioso_escapar', effects: { nihilismo: -5, amorFati: 5 } }
        ]
      }
    ]
  },
  misterioso_quien: {
    speaker: '???',
    lines: [
      { text: 'Soy lo que queda cuando pierdes todo excepto la memoria.' },
      { text: 'Soy la prueba de que el conocimiento persiste.' },
      { text: 'Y soy tu futuro... o tu pasado. Depende del ciclo.' }
    ]
  },
  misterioso_escapar: {
    speaker: '???',
    lines: [
      { text: 'Escapar... ja.' },
      { text: 'No se trata de escapar. Se trata de ABRAZAR.' },
      { text: '¿Podrías vivir este mismo ciclo, eternamente, y ser feliz?' },
      { text: 'Esa es la verdadera pregunta.' }
    ]
  }
};

const dailyEvents = {
  2: [
    {
      id: 'fuego_mercado', speaker: 'Evento',
      lines: [
        { text: 'Un incendio ha estallado en el mercado.' },
        { text: '¿A quién ayudas?', choices: [
          { text: 'Al Panadero', next: null, effects: { amorFati: 10 } },
          { text: 'Al Mercader', next: null, effects: { nihilismo: 5, creacion: 5 } }
        ]}
      ]
    },
    {
      id: 'lluvia_extraña', speaker: 'Evento',
      lines: [
        { text: 'Una extraña lluvia cae hacia arriba.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Investigar', next: null, effects: { creacion: 8 } },
          { text: 'Ignorar', next: null, effects: { nihilismo: 5 } }
        ]}
      ]
    }
  ],
  3: [
    {
      id: 'eco_pasos', speaker: 'Evento',
      lines: [
        { text: 'Escuchas tus propios pasos caminando detrás de ti.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Darte la vuelta', next: null, effects: { voluntad: 8 } },
          { text: 'Seguir caminando', next: null, effects: { nihilismo: 5 } }
        ]}
      ]
    },
    {
      id: 'libro_cae', speaker: 'Evento',
      lines: [
        { text: 'Un libro cae de una estantería de la biblioteca.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Leerlo', next: null, effects: { creacion: 10 } },
          { text: 'Devolverlo', next: null, effects: { amorFati: 5 } }
        ]}
      ]
    }
  ],
  4: [
    {
      id: 'sombra_espejo', speaker: 'Evento',
      lines: [
        { text: 'Ves tu reflejo moverse de forma independiente.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Confrontarlo', next: null, effects: { voluntad: 10 } },
          { text: 'Huir', next: null, effects: { nihilismo: 8 } }
        ]}
      ]
    },
    {
      id: 'flor_crece', speaker: 'Evento',
      lines: [
        { text: 'Una flor crece a cámara rápida a tus pies.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Recogerla', next: null, effects: { creacion: 5 } },
          { text: 'Verla morir', next: null, effects: { amorFati: 8, nihilismo: 3 } }
        ]}
      ]
    }
  ],
  5: [
    {
      id: 'demonio_nietzsche', speaker: 'El Demonio',
      lines: [
        { text: '¿Qué dirías si te dijera que esta vida, tal como la has vivido, tendrás que vivirla una vez más e innumerables veces más?' },
        { text: '¿Cuál es tu respuesta?', choices: [
          { text: '¡Sí! ¡Nada más divino he escuchado!', next: null, effects: { amorFati: 20, voluntad: 10 } },
          { text: 'Eso sería la peor maldición.', next: null, effects: { nihilismo: 15, voluntad: 5 } },
          { text: '¿Y si pudiera cambiar algo?', next: null, effects: { creacion: 15, voluntad: 5 } }
        ]}
      ]
    }
  ],
  6: [
    {
      id: 'ciudad_silencio', speaker: 'Evento',
      lines: [
        { text: 'La ciudad entera se sume en un silencio absoluto.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Meditar', next: null, effects: { amorFati: 10 } },
          { text: 'Gritar', next: null, effects: { voluntad: 8, nihilismo: 5 } }
        ]}
      ]
    },
    {
      id: 'npc_recuerda', speaker: 'Evento',
      lines: [
        { text: 'Alguien en la calle te saluda con un nombre que usaste en un ciclo anterior.' },
        { text: 'Te quedas pensando...', choices: [
          { text: 'Asentir', next: null, effects: { amorFati: 5 } },
          { text: 'Ignorar', next: null, effects: { nihilismo: 5 } }
        ]}
      ]
    }
  ],
  7: [
    {
      id: 'grieta_cielo', speaker: 'Evento',
      lines: [
        { text: 'Una grieta violeta aparece en el cielo gris.' },
        { text: '¿Qué haces?', choices: [
          { text: 'Alcanzarla', next: null, effects: { voluntad: 15 } },
          { text: 'Aceptar el ciclo', next: null, effects: { amorFati: 15 } }
        ]}
      ]
    }
  ]
};

const bookQuotes = [
  '"Quien tiene un porqué para vivir, puede soportar casi cualquier cómo." — Nietzsche',
  '"No hay hechos, solo interpretaciones." — Nietzsche',
  '"Aquello que se hace por amor, está más allá del bien y del mal." — Nietzsche',
  '"El hombre es una cuerda tendida entre el animal y el Superhombre." — Nietzsche',
  '"Hay que tener caos dentro de sí para dar a luz una estrella danzarina." — Nietzsche',
  '"La madurez del hombre: haber recobrado la seriedad que de niño tenía al jugar." — Nietzsche',
  '"Invisible hilos son los lazos más fuertes." — Nietzsche',
  '"¿Es el hombre solo un error de Dios, o Dios solo un error del hombre?" — Nietzsche'
];

const signTexts = [
  'E: Interactuar con objetos y personas',
  'T: El tiempo avanza... ¿o retrocede?',
  'M: El mapa revela caminos olvidados',
  'Tus estadísticas definen tu destino',
  'El conocimiento persiste entre ciclos'
];

// --- Game State ---
const game = {
  state: 'title', // title, playing, dialog, transition, map, ending
  cycle: 1,
  day: 1,
  currentMap: 'ciudad_central',
  player: {
    x: 9, y: 11,
    tx: 9, ty: 11,
    dir: 'down',
    frame: 0,
    moving: false,
    speed: 4.0
  },
  stats: { voluntad: 30, nihilismo: 20, amorFati: 15, creacion: 25 },
  dialog: { current: null, line: 0, char: 0, active: false, timer: 0, choices: null, chosen: 0 },
  particles: [],
  time: 0,
  fade: 0,
  eventsTriggered: [],
  memory: {
    totalCycles: 0,
    npcsTalkedTo: new Set(),
    eventsExperienced: [],
    choicesMade: [],
    objectsInteracted: new Set(),
    knowledgeFragments: [],
    demonEncounters: 0,
  },
  shake: { intensity: 0, duration: 0, timer: 0 },
  ghosts: [],
  glitch: 0
};

// --- Input Handling ---
const keys = { w:0, a:0, s:0, d:0, ArrowUp:0, ArrowDown:0, ArrowLeft:0, ArrowRight:0, e:0, ' ':0, t:0, m:0, Enter:0, Escape:0, 1:0, 2:0, 3:0 };
const pressed = {};

window.addEventListener('keydown', e => {
  if (keys[e.key] !== undefined) {
    keys[e.key] = 1;
    if (!pressed[e.key]) {
      pressed[e.key] = true;
      handleKeyPress(e.key);
    }
  }
});
window.addEventListener('keyup', e => {
  if (keys[e.key] !== undefined) {
    keys[e.key] = 0;
    pressed[e.key] = false;
  }
});

function handleKeyPress(key) {
  if (game.state === 'title' && key === 'Enter') {
    showIntro();
  } else if (game.state === 'intro' && (key === 'Enter' || key === ' ' || key === 'Escape')) {
    startGame();
  } else if (game.state === 'ending' && key === 'Enter') {
    restartGame();
  } else if (game.state === 'playing') {
    if (key === 'e' || key === ' ') checkInteract();
    if (key === 't') advanceDay();
    if (key === 'm') toggleMap();
  } else if (game.state === 'dialog') {
    if (key === 'e' || key === ' ' || key === 'Enter') advanceDialog();
    if (game.dialog.choices) {
      if (key === '1' && game.dialog.choices.length >= 1) selectChoice(0);
      if (key === '2' && game.dialog.choices.length >= 2) selectChoice(1);
      if (key === '3' && game.dialog.choices.length >= 3) selectChoice(2);
    }
  } else if (game.state === 'map') {
    if (key === 'm' || key === 'Escape') toggleMap();
  }
}

// --- Logic ---
let introTimeout = null;

function showIntro() {
  window.AudioManager?.init?.();
  window.AudioManager?.playNotification?.();
  document.getElementById('title').style.display = 'none';
  
  const intro = document.getElementById('starwars-screen');
  intro.style.display = 'flex';
  game.state = 'intro';

  // Re-trigger animation
  const crawl = document.getElementById('crawl-text');
  crawl.style.animation = 'none';
  crawl.offsetHeight; // trigger reflow
  crawl.style.animation = 'crawlAnim 32s linear forwards';

  // Auto start game when crawl finishes
  if (introTimeout) clearTimeout(introTimeout);
  introTimeout = setTimeout(() => {
    if (game.state === 'intro') startGame();
  }, 32000);
}

function startGame() {
  if (introTimeout) clearTimeout(introTimeout);
  window.AudioManager?.init?.();
  window.AudioManager?.playAmbient?.('ciudad_central');
  document.getElementById('title').style.display = 'none';
  document.getElementById('starwars-screen').style.display = 'none';
  game.state = 'playing';
  updateHUD();
  showNotification('El ciclo comienza...');
}

function updateHUD() {
  document.getElementById('bar-vol').style.width = game.stats.voluntad + '%';
  document.getElementById('bar-nih').style.width = game.stats.nihilismo + '%';
  document.getElementById('bar-amo').style.width = game.stats.amorFati + '%';
  document.getElementById('bar-cre').style.width = game.stats.creacion + '%';
  document.getElementById('cycle-display').innerText = 'Ciclo ' + game.cycle;
  document.getElementById('day-display').innerText = 'Día ' + game.day;
}

function showNotification(text) {
  window.AudioManager?.playNotification?.();
  const n = document.getElementById('notification');
  n.innerText = text;
  n.style.opacity = 1;
  setTimeout(() => { n.style.opacity = 0; }, 2500);
}

function applyEffects(eff) {
  if (!eff) return;
  let isPositive = false;
  for (let k in eff) {
    if (eff[k] > 0) isPositive = true;
    game.stats[k] = Math.max(0, Math.min(100, game.stats[k] + eff[k]));
    showNotification(`${k.toUpperCase()} ${eff[k] > 0 ? '+' : ''}${eff[k]}`);
  }
  window.AudioManager?.playStatChange?.(isPositive);
  updateHUD();
}

function triggerShake(intensity, duration) {
  game.shake.intensity = intensity;
  game.shake.timer = duration;
}

function triggerEvent(day) {
  const events = dailyEvents[day];
  if (!events || events.length === 0) return false;
  const ev = events[Math.floor(Math.random() * events.length)];
  game.eventsTriggered.push(ev.id);
  game.memory.eventsExperienced.push(ev.id);
  
  if (ev.id === 'demonio_nietzsche') game.memory.demonEncounters++;

  window.AudioManager?.playEventAlert?.();
  
  game.state = 'dialog';
  game.dialog.current = {
    speaker: ev.speaker,
    lines: [...ev.lines]
  };
  game.dialog.line = 0;
  game.dialog.char = 0;
  game.dialog.timer = 0;
  game.dialog.active = true;
  game.dialog.choices = null;
  document.getElementById('d-speaker').innerText = ev.speaker;
  document.getElementById('d-text').innerText = '';
  document.getElementById('d-choices').innerHTML = '';
  dialogBox.style.display = 'flex';
  
  return true;
}

function advanceDay() {
  game.day++;
  if (game.day > 7) {
    endCycle();
  } else {
    showNotification('Día ' + game.day);
    updateHUD();
    updateNPCs();
    triggerEvent(game.day);
  }
}

function checkEnding() {
  if (game.cycle >= 3) {
    let type = null;
    let title = '';
    let text = '';
    if (game.stats.voluntad >= 80) {
      type = 'voluntad';
      title = 'EL SUPERHOMBRE';
      text = 'Has trascendido el ciclo. No lo destruyes — lo superas. Eres el puente entre lo que fue y lo que será.';
    } else if (game.stats.nihilismo >= 80) {
      type = 'nihilismo';
      title = 'EL ABISMO';
      text = 'El abismo te devolvió la mirada... y tú parpadeaste. El mundo se deshace en fragmentos de sin-sentido.';
    } else if (game.stats.amorFati >= 80) {
      type = 'amorFati';
      title = 'AMOR FATI';
      text = '"¡Sí! ¡Una vez más!" — abrazas cada instante, cada dolor, cada alegría. El ciclo no es tu prisión, es tu hogar.';
    } else if (game.stats.creacion >= 80) {
      type = 'creacion';
      title = 'EL ARTISTA';
      text = 'De las cenizas del viejo mundo, forjas valores nuevos. Cada ciclo es un lienzo en blanco.';
    } else if (game.stats.voluntad >= 40 && game.stats.voluntad <= 60 && 
               game.stats.nihilismo >= 40 && game.stats.nihilismo <= 60 &&
               game.stats.amorFati >= 40 && game.stats.amorFati <= 60 &&
               game.stats.creacion >= 40 && game.stats.creacion <= 60) {
      type = 'equilibrio';
      title = 'EL EQUILIBRIO';
      text = 'Comprendes que la pregunta de Nietzsche no tiene respuesta... porque la pregunta ES la respuesta.';
    }
    
    if (type) {
      showEnding(type, title, text);
      return true;
    }
  }
  return false;
}


function showEnding(type, title, text) {
  window.AudioManager?.playEnding?.(type);
  game.state = 'ending';
  const overlay = document.getElementById('overlay');
  overlay.innerHTML = `
    <h1 style="font-size:36px;letter-spacing:12px;color:#d4a843;text-shadow:0 0 30px rgba(212,168,67,0.6);margin-bottom:24px;text-align:center;">${title}</h1>
    <p style="font-size:12px;color:#eee;max-width:600px;text-align:center;line-height:2;margin-bottom:30px;font-style:italic;">${text}</p>
    <div style="font-size:10px;color:#aaa;margin-bottom:10px;">Estadísticas Finales:</div>
    <div style="font-size:8px;color:#8b5cf6;margin-bottom:4px;">Voluntad: ${game.stats.voluntad}</div>
    <div style="font-size:8px;color:#ef4444;margin-bottom:4px;">Nihilismo: ${game.stats.nihilismo}</div>
    <div style="font-size:8px;color:#d4a843;margin-bottom:4px;">Amor Fati: ${game.stats.amorFati}</div>
    <div style="font-size:8px;color:#06b6d4;margin-bottom:24px;">Creación: ${game.stats.creacion}</div>
    <div style="font-size:10px;color:#9892a6;margin-bottom:30px;">Ciclos vividos: ${game.cycle}</div>
    <div class="blink" style="font-size:10px;color:#d4a843;cursor:pointer;" onclick="restartGame()">Presiona ENTER para renacer</div>
  `;
  overlay.style.opacity = 1;
}

window.restartGame = function() {
  game.memory.totalCycles++;
  game.cycle = 1;
  game.day = 1;
  game.stats = { voluntad: 30, nihilismo: 20, amorFati: 15, creacion: 25 };
  game.player.x = 9; game.player.y = 11;
  game.player.tx = 9; game.player.ty = 11;
  game.currentMap = 'ciudad_central';
  game.eventsTriggered = [];
  updateNPCs();
  updateHUD();
  document.getElementById('overlay').style.opacity = 0;
  setTimeout(() => {
    document.getElementById('overlay').innerHTML = '';
    game.state = 'title';
    document.getElementById('title').style.display = 'flex';
  }, 1000);
};

function endCycle() {
  window.AudioManager?.playCycleEnd?.();
  game.state = 'transition';
  game.glitch = 1.0;
  triggerShake(5, 1.0);
  
  document.getElementById('overlay').innerHTML = `<h1 style="font-size:32px;letter-spacing:8px;color:#d4a843;text-shadow:0 0 20px rgba(212,168,67,0.4);margin-bottom:16px;">CICLO ${game.cycle}</h1><p style="font-size:10px;color:#9892a6;margin-bottom:8px;">El mundo se reinicia...</p><p style="font-size:10px;color:#d4a843;">Tu conocimiento permanece.</p>`;
  document.getElementById('overlay').style.opacity = 1;
  
  setTimeout(() => {
    if (checkEnding()) return;

    game.memory.totalCycles++;
    game.cycle++;
    game.day = 1;
    game.player.x = 9; game.player.y = 11;
    game.player.tx = 9; game.player.ty = 11;
    game.currentMap = 'ciudad_central';
    game.eventsTriggered = [];
    updateNPCs();
    updateHUD();
    document.getElementById('overlay').style.opacity = 0;
    setTimeout(() => {
      document.getElementById('overlay').innerHTML = '';
      game.state = 'playing';
      showNotification('Ciclo ' + game.cycle);
    }, 500);
  }, 3000);
}

function updateNPCs() {
  const p = maps.mercado.npcs.find(n => n.id === 'panadero');
  if (p) p.d = game.day >= 5 ? 'panadero_day5' : 'panadero_day1';
  
  const g = maps.ciudad_central.npcs.find(n => n.id === 'guardian');
  if (g) g.d = game.cycle >= 2 ? 'guardian_cycle2' : 'guardian_intro';
}

function getWalkable(mx, my) {
  if (mx < 0 || mx >= MAP_W || my < 0 || my >= MAP_H) return false;
  const t = maps[game.currentMap].tiles[Math.floor(my)][Math.floor(mx)];
  return TILE_TYPES[t].walk;
}

function checkInteract() {
  let ix = game.player.x;
  let iy = game.player.y;
  if (game.player.dir === 'up') iy -= 1;
  if (game.player.dir === 'down') iy += 1;
  if (game.player.dir === 'left') ix -= 1;
  if (game.player.dir === 'right') ix += 1;

  ix = Math.round(ix);
  iy = Math.round(iy);

  window.AudioManager?.playInteract?.();

  const m = maps[game.currentMap];
  for (let npc of m.npcs) {
    if (npc.cond && !npc.cond(game)) continue;
    if (Math.abs(npc.x - ix) <= 1 && Math.abs(npc.y - iy) <= 1) {
      startDialog(npc);
      return;
    }
  }

  // Check interactive tiles
  if (ix >= 0 && ix < MAP_W && iy >= 0 && iy < MAP_H) {
    let tId = m.tiles[iy][ix];
    let t = TILE_TYPES[tId];
    
    if (t.name === 'bookshelf') {
      let q = bookQuotes[Math.floor(Math.random() * bookQuotes.length)];
      showCustomDialog('Estantería', q, { creacion: 3 });
      game.memory.objectsInteracted.add(`bookshelf_${ix}_${iy}`);
    } else if (t.name === 'altar') {
      showAltarDialog();
    } else if (t.name === 'chest') {
      let cId = `chest_${game.cycle}_${ix}_${iy}`;
      if (game.memory.objectsInteracted.has(cId)) {
        showCustomDialog('Cofre', 'Ya has abierto este cofre en este ciclo.', null);
      } else {
        game.memory.objectsInteracted.add(cId);
        let statKeys = ['voluntad', 'nihilismo', 'amorFati', 'creacion'];
        let rStat = statKeys[Math.floor(Math.random() * statKeys.length)];
        let eff = {}; eff[rStat] = 8;
        showCustomDialog('Cofre', `Encuentras un fragmento cristalizado...`, eff);
      }
    } else if (t.name === 'grave') {
      let domStat = Object.keys(game.stats).reduce((a, b) => game.stats[a] > game.stats[b] ? a : b);
      let text = '';
      if (domStat === 'voluntad') text = '"Aquí yace aquel que no se rindió."';
      else if (domStat === 'nihilismo') text = '"Aquí yace la nada."';
      else if (domStat === 'amorFati') text = '"Volvería a vivirlo todo."';
      else text = '"Creador hasta el final."';
      text += `\n(Ciclo ${game.cycle})`;
      showCustomDialog('Tumba', text, { voluntad: 3 });
    } else if (t.name === 'sign') {
      let s = signTexts[Math.floor(Math.random() * signTexts.length)];
      showCustomDialog('Letrero', s, null);
    } else if (t.name === 'fountain_water') {
      showCustomDialog('Fuente', 'Las aguas reflejan... ¿eres tú o es tu otro yo?', { amorFati: 2 });
    }
  }
}

function showCustomDialog(speaker, text, effects) {
  window.AudioManager?.playDialogOpen?.();
  game.state = 'dialog';
  game.dialog.current = {
    speaker: speaker,
    lines: [
      { text: text, effects: effects }
    ]
  };
  game.dialog.line = 0;
  game.dialog.char = 0;
  game.dialog.timer = 0;
  game.dialog.active = true;
  game.dialog.choices = null;
  document.getElementById('d-speaker').innerText = speaker;
  document.getElementById('d-text').innerText = '';
  document.getElementById('d-choices').innerHTML = '';
  dialogBox.style.display = 'flex';
}

function showAltarDialog() {
  window.AudioManager?.playDialogOpen?.();
  game.state = 'dialog';
  game.dialog.current = {
    speaker: 'Altar',
    lines: [
      { text: 'Un altar antiguo. Puedes sacrificar 10 de una estadística para ganar 15 en otra.' },
      { text: '¿Qué ofreces?', choices: [
        { text: 'Sacrificar Nihilismo por Voluntad', next: null, action: () => { if(game.stats.nihilismo>=10){game.stats.nihilismo-=10; applyEffects({voluntad: 15});} } },
        { text: 'Sacrificar Voluntad por Amor Fati', next: null, action: () => { if(game.stats.voluntad>=10){game.stats.voluntad-=10; applyEffects({amorFati: 15});} } },
        { text: 'No hacer nada', next: null }
      ]}
    ]
  };
  game.dialog.line = 0;
  game.dialog.char = 0;
  game.dialog.timer = 0;
  game.dialog.active = true;
  game.dialog.choices = null;
  document.getElementById('d-speaker').innerText = 'Altar';
  document.getElementById('d-text').innerText = '';
  document.getElementById('d-choices').innerHTML = '';
  dialogBox.style.display = 'flex';
}

function startDialog(npc) {
  window.AudioManager?.playDialogOpen?.();
  if (npc.id) game.memory.npcsTalkedTo.add(npc.id);
  
  game.state = 'dialog';
  let dId = npc.d;
  let original = dialogues[dId];
  
  game.dialog.current = {
    speaker: npc.name || original.speaker,
    effects: original.effects,
    lines: [...original.lines]
  };
  
  if (game.cycle >= 6 && npc.id) {
    game.dialog.current.lines.push({ text: `[Ciclo ${game.cycle}] La repetición se hace pesada, ¿no lo sientes?` });
  }

  game.dialog.line = 0;
  game.dialog.char = 0;
  game.dialog.timer = 0;
  game.dialog.active = true;
  game.dialog.choices = null;
  document.getElementById('d-speaker').innerText = game.dialog.current.speaker;
  document.getElementById('d-text').innerText = '';
  document.getElementById('d-choices').innerHTML = '';
  dialogBox.style.display = 'flex';
}

function advanceDialog() {
  const lineData = game.dialog.current.lines[game.dialog.line];
  if (game.dialog.char < lineData.text.length) {
    game.dialog.char = lineData.text.length; // skip to end
    renderDialogText();
  } else {
    if (lineData.choices) return; // Wait for choice
    if (game.dialog.line < game.dialog.current.lines.length - 1) {
      game.dialog.line++;
      game.dialog.char = 0;
      renderDialogText();
    } else {
      endDialog();
    }
  }
}

function endDialog() {
  if (game.dialog.current.effects) applyEffects(game.dialog.current.effects);
  game.state = 'playing';
  game.dialog.active = false;
  dialogBox.style.display = 'none';
}

window.selectChoice = function(idx) {
  window.AudioManager?.playDialogChoice?.();
  const lineData = game.dialog.current.lines[game.dialog.line];
  const choice = lineData.choices[idx];
  
  if (choice.effects) applyEffects(choice.effects);
  if (choice.action) choice.action();
  
  if (choice.next) {
    let original = dialogues[choice.next];
    game.dialog.current = {
      speaker: original.speaker,
      effects: original.effects,
      lines: [...original.lines]
    };
    game.dialog.line = 0;
    game.dialog.char = 0;
    document.getElementById('d-choices').innerHTML = '';
  } else {
    endDialog();
  }
};

function renderDialogText() {
  const lineData = game.dialog.current.lines[game.dialog.line];
  document.getElementById('d-text').innerText = lineData.text.substring(0, game.dialog.char);
  
  if (game.dialog.char >= lineData.text.length && lineData.choices) {
    game.dialog.choices = lineData.choices;
    let html = '';
    lineData.choices.forEach((c, i) => {
      html += `<button class="choice-btn" onclick="selectChoice(${i})">${i+1}. ${c.text}</button>`;
    });
    document.getElementById('d-choices').innerHTML = html;
  }
}

function toggleMap() {
  if (game.state === 'playing') {
    game.state = 'map';
    const ui = document.getElementById('map-ui');
    ui.style.display = 'flex';
    ui.innerHTML = '<h2>Viaje Rápido</h2><div class="map-grid"></div><p style="font-size:12px;margin-top:10px;">Presiona M o ESC para cerrar</p>';
    const grid = ui.querySelector('.map-grid');
    for (let k in maps) {
      const div = document.createElement('div');
      div.className = 'map-node' + (game.currentMap === k ? ' active' : '');
      div.innerText = maps[k].name;
      div.onclick = () => { if(game.currentMap !== k) travelTo(k); else toggleMap(); };
      grid.appendChild(div);
    }
  } else if (game.state === 'map') {
    game.state = 'playing';
    document.getElementById('map-ui').style.display = 'none';
  }
}

function travelTo(mapId) {
  document.getElementById('map-ui').style.display = 'none';
  game.state = 'transition';
  window.AudioManager?.playAmbient?.(mapId);
  document.getElementById('overlay').innerHTML = `<h2>${maps[mapId].name}</h2>`;
  document.getElementById('overlay').style.opacity = 1;
  setTimeout(() => {
    game.currentMap = mapId;
    game.player.x = 10; game.player.y = 10; // Safe default
    game.player.tx = 10; game.player.ty = 10;
    document.getElementById('overlay').style.opacity = 0;
    setTimeout(() => {
      game.state = 'playing';
    }, 500);
  }, 800);
}

function changeMap(exit) {
  game.state = 'transition';
  window.AudioManager?.playAmbient?.(exit.target);
  document.getElementById('overlay').innerHTML = `<h2>${maps[exit.target].name}</h2>`;
  document.getElementById('overlay').style.opacity = 1;
  setTimeout(() => {
    game.currentMap = exit.target;
    game.player.x = exit.sx; game.player.y = exit.sy;
    game.player.tx = exit.sx; game.player.ty = exit.sy;
    document.getElementById('overlay').style.opacity = 0;
    setTimeout(() => {
      game.state = 'playing';
    }, 500);
  }, 800);
}

function update(dt) {
  game.time += dt;

  if (game.state === 'playing') {
    if (!game.player.moving) {
      let dx = 0, dy = 0;
      if (keys.w || keys.ArrowUp) { dy = -1; game.player.dir = 'up'; }
      else if (keys.s || keys.ArrowDown) { dy = 1; game.player.dir = 'down'; }
      else if (keys.a || keys.ArrowLeft) { dx = -1; game.player.dir = 'left'; }
      else if (keys.d || keys.ArrowRight) { dx = 1; game.player.dir = 'right'; }

      if (dx !== 0 || dy !== 0) {
        let nx = game.player.x + dx;
        let ny = game.player.y + dy;
        if (getWalkable(nx, ny)) {
          game.player.tx = nx;
          game.player.ty = ny;
          game.player.moving = true;
          window.AudioManager?.playFootstep?.();
        }
      }
    }

    if (game.player.moving) {
      let dx = game.player.tx - game.player.x;
      let dy = game.player.ty - game.player.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      
      if (Math.random() < 0.2) {
        game.ghosts.unshift({x: game.player.x, y: game.player.y, dir: game.player.dir, frame: game.player.frame});
        if (game.ghosts.length > 8) game.ghosts.pop();
      }

      if (dist < game.player.speed * dt) {
        game.player.x = game.player.tx;
        game.player.y = game.player.ty;
        game.player.moving = false;
        game.ghosts = [];
        
        // Check exits
        const m = maps[game.currentMap];
        for (let e of m.exits) {
          if (Math.round(game.player.x) === e.x && Math.round(game.player.y) === e.y) {
            changeMap(e);
            break;
          }
        }
      } else {
        game.player.x += (dx / dist) * game.player.speed * dt;
        game.player.y += (dy / dist) * game.player.speed * dt;
      }
      game.player.frame += dt * 8;
    } else {
      game.player.frame = 0;
      game.ghosts = [];
    }

    // Particles logic per map
    if (Math.random() < 0.1 && game.particles.length < 30) {
      let pColor = '#fff';
      let vx = (Math.random() - 0.5) * 10;
      let vy = (Math.random() - 0.5) * 10;
      
      if (game.currentMap === 'ciudad_central') {
        pColor = '#ffd700'; // Golden dust
        vy = -Math.abs(vy) - 5;
      } else if (game.currentMap === 'mercado') {
        pColor = '#d2b48c'; // Sand
        vx = 15; vy = 2;
      } else if (game.currentMap === 'biblioteca') {
        pColor = '#8bf'; // glowing letters
        vy = -Math.abs(vy) * 0.5;
      } else if (game.currentMap === 'catedral') {
        pColor = '#fa0'; // candle light
        vy = -10;
      } else if (game.currentMap === 'bosque') {
        pColor = '#af5'; // fireflies
        vx = Math.sin(game.time * 5) * 10;
      }

      game.particles.push({
        x: Math.random() * MAP_W * TILE_SIZE,
        y: Math.random() * MAP_H * TILE_SIZE,
        vx: vx,
        vy: vy,
        life: 1.0,
        color: pColor
      });
    }
  } else if (game.state === 'dialog') {
    game.dialog.timer += dt;
    if (game.dialog.timer > 0.03) {
      game.dialog.timer = 0;
      const lineData = game.dialog.current.lines[game.dialog.line];
      if (game.dialog.char < lineData.text.length) {
        game.dialog.char++;
        renderDialogText();
      }
    }
  }

  // Update particles
  for (let i = game.particles.length - 1; i >= 0; i--) {
    let p = game.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt * 0.5;
    if (p.life <= 0) game.particles.splice(i, 1);
  }
  
  if (game.glitch > 0) game.glitch -= dt;
  if (game.shake.timer > 0) game.shake.timer -= dt;
}

// --- Rendering ---
function seededRandom(x, y) {
  let h = Math.imul(x ^ y, 0x9E3779B9);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function renderMap() {
  const m = maps[game.currentMap];
  
  // Cycle saturation modifier & hue
  let sat = Math.min(1.0, 0.4 + (game.cycle - 1) * 0.1);
  ctx.filter = `saturate(${sat * 100}%)`;

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      let tId = m.tiles[y][x];
      let t = TILE_TYPES[tId];
      let px = x * TILE_SIZE;
      let py = y * TILE_SIZE;
      
      let tColor = t.color;
      if (t.name === 'grass' && game.cycle >= 4) tColor = '#2a4a28'; // Darker grass
      
      ctx.fillStyle = tColor;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      
      // Procedural details
      let sr = seededRandom(x, y);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      
      if (t.name === 'grass') {
        for(let i=0; i<4; i++) {
          let dx = Math.floor(seededRandom(x*i, y) * TILE_SIZE);
          let dy = Math.floor(seededRandom(x, y*i) * TILE_SIZE);
          ctx.fillStyle = sr > 0.5 ? '#1a4a28' : (game.cycle >= 4 ? '#2a3a28' : '#3a6a48');
          ctx.fillRect(px+dx, py+dy, 2, 2);
        }
      } else if (t.name === 'stone_floor' || t.name === 'wall') {
        ctx.fillRect(px, py, TILE_SIZE, 1);
        ctx.fillRect(px, py, 1, TILE_SIZE);
        if (sr > 0.8) ctx.fillRect(px+4, py+4, 2, 2);
        if (game.cycle >= 2 && sr < 0.05) {
           ctx.save();
           ctx.font = '5px "Press Start 2P", monospace';
           ctx.fillStyle = 'rgba(255,255,255,0.08)';
           let words = ['?', 'Ciclo', 'Fati'];
           ctx.fillText(words[Math.floor(sr*100)%3], px+1, py+10);
           ctx.restore();
           ctx.fillStyle = 'rgba(0,0,0,0.2)';
        }
      } else if (t.name === 'water' || t.name === 'fountain_water') {
        let wave = Math.sin(game.time * 2 + x + y) * 2;
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(px + 4 + wave, py + 8, 8, 1);
      } else if (t.name === 'tree_canopy') {
        ctx.beginPath();
        ctx.arc(px+8, py+8, 8, 0, Math.PI*2);
        ctx.fillStyle = '#114411';
        ctx.fill();
      } else if (t.name === 'bookshelf') {
        ctx.fillStyle = '#822'; ctx.fillRect(px+2, py+2, 3, 10);
        ctx.fillStyle = '#228'; ctx.fillRect(px+6, py+2, 4, 10);
        ctx.fillStyle = '#282'; ctx.fillRect(px+11, py+2, 3, 10);
      } else if (t.name === 'torch') {
        ctx.fillStyle = '#632';
        ctx.fillRect(px+6, py+8, 4, 8);
        // Flame
        let fh = 4 + Math.random()*4;
        ctx.fillStyle = '#fa0';
        ctx.fillRect(px+6, py+8-fh, 4, fh);
      }
    }
  }
  ctx.filter = 'none';
}

function drawCharacter(x, y, hColor, sColor, cColor, dir, frame, isPlayer) {
  let px = x * TILE_SIZE + TILE_SIZE/2;
  let py = y * TILE_SIZE + TILE_SIZE/2;
  
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath(); ctx.ellipse(px, py+6, 6, 3, 0, 0, Math.PI*2); ctx.fill();
  
  // Aura for player based on stats
  if (isPlayer) {
    if (game.stats.voluntad > 60) {
      ctx.fillStyle = 'rgba(150,50,200,0.2)';
      ctx.beginPath(); ctx.arc(px, py, 12 + Math.sin(game.time*5)*2, 0, Math.PI*2); ctx.fill();
    }
  }
  
  px -= 5; // center 10x14 sprite
  py -= 8;
  
  // Body/Cloak
  ctx.fillStyle = cColor;
  ctx.fillRect(px, py+6, 10, 6);
  
  // Head
  ctx.fillStyle = sColor;
  ctx.fillRect(px+1, py+2, 8, 5);
  
  // Hair
  ctx.fillStyle = hColor;
  ctx.fillRect(px, py, 10, 3);
  if (dir === 'down' || dir === 'left' || dir === 'right') {
    ctx.fillRect(px, py+2, 2, 3);
    ctx.fillRect(px+8, py+2, 2, 3);
  }
  
  // Eyes
  if (dir === 'down') {
    ctx.fillStyle = '#000';
    ctx.fillRect(px+2, py+4, 2, 2);
    ctx.fillRect(px+6, py+4, 2, 2);
  } else if (dir === 'left') {
    ctx.fillStyle = '#000';
    ctx.fillRect(px+2, py+4, 2, 2);
  } else if (dir === 'right') {
    ctx.fillStyle = '#000';
    ctx.fillRect(px+6, py+4, 2, 2);
  }
  
  // Legs (walk animation)
  ctx.fillStyle = '#222';
  let lOffset = Math.floor(frame) % 2 === 0 ? 0 : 2;
  if (dir === 'idle') lOffset = 0;
  
  if (dir === 'left' || dir === 'right') {
    ctx.fillRect(px+4 - lOffset/2, py+12, 3, 2);
  } else {
    ctx.fillRect(px+2, py+12 - (lOffset===0?1:0), 3, 2);
    ctx.fillRect(px+6, py+12 - (lOffset===2?1:0), 3, 2);
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  if (game.state === 'title') return;
  
  ctx.save();
  if (game.shake.timer > 0) {
    let dx = (Math.random() - 0.5) * game.shake.intensity;
    let dy = (Math.random() - 0.5) * game.shake.intensity;
    ctx.translate(dx, dy);
  }

  // Glitch underlay
  if (game.glitch > 0) {
    if (Math.random() < 0.3) {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 5);
    }
  }
  
  renderMap();
  
  // Exits and Torches lighting effects
  const m = maps[game.currentMap];
  for (let e of m.exits) {
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(e.x*TILE_SIZE, e.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
  
  // Draw NPCs
  for (let npc of m.npcs) {
    if (npc.cond && !npc.cond(game)) continue;
    let bob = Math.sin(game.time * 2 + npc.x) * 1;
    drawCharacter(npc.x, npc.y + bob/TILE_SIZE, npc.h, npc.s, npc.c, 'down', 0, false);
    
    // Indicator if not seen
    if (!game.dialog.active) {
      ctx.fillStyle = '#ff0';
      ctx.fillText('!', npc.x*TILE_SIZE + 6, npc.y*TILE_SIZE - 2 + bob);
    }
  }
  
  // Draw Ghosts
  for (let i = 0; i < game.ghosts.length; i++) {
    let g = game.ghosts[i];
    ctx.globalAlpha = Math.max(0, 0.15 - (i * 0.015));
    drawCharacter(g.x, g.y, '#111', '#f5d5b5', '#335', g.dir, g.frame, true);
  }
  ctx.globalAlpha = 1.0;

  // Draw Player
  drawCharacter(game.player.x, game.player.y, '#111', '#f5d5b5', '#335', game.player.dir, game.player.frame, true);
  
  // Particles
  for (let p of game.particles) {
    ctx.fillStyle = p.color;
    let alpha = p.life;
    if (game.currentMap === 'bosque') alpha = p.life * (0.5 + 0.5 * Math.sin(game.time * 10 + p.x));
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.fillRect(p.x, p.y, 1.5, 1.5);
  }
  ctx.globalAlpha = 1.0;
  
  // Overlays (Day Cycle)
  let overlayColor = 'transparent';
  if (game.day <= 2) overlayColor = 'rgba(255,200,100,0.05)';
  else if (game.day === 5) overlayColor = 'rgba(200,50,50,0.08)';
  else if (game.day === 6) overlayColor = 'rgba(30,30,100,0.15)';
  else if (game.day === 7) overlayColor = 'rgba(80,20,100,0.15)';
  
  if (overlayColor !== 'transparent') {
    ctx.fillStyle = overlayColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Vignette
  let gColor1 = game.cycle >= 6 ? 'rgba(30,10,40,0)' : 'rgba(0,0,0,0)';
  let gColor2 = game.cycle >= 6 ? 'rgba(40,10,50,0.6)' : 'rgba(0,0,0,0.5)';
  let grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height/3, canvas.width/2, canvas.height/2, canvas.width);
  grad.addColorStop(0, gColor1);
  grad.addColorStop(1, gColor2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.restore();

  // Visual "tear" for cycle 3+
  if (game.cycle >= 3 && Math.random() < 0.02) {
    let ty = Math.random() * canvas.height;
    let th = Math.random() * 5 + 2;
    let tx = (Math.random() - 0.5) * 8;
    ctx.drawImage(canvas, 0, ty, canvas.width, th, tx, ty, canvas.width, th);
  }
}

// --- Main Loop ---
let lastTime = 0;
function gameLoop(timestamp) {
  let dt = (timestamp - lastTime) / 1000;
  if (dt > 0.1) dt = 0.1; // cap
  lastTime = timestamp;
  
  update(dt);
  render();
  
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
