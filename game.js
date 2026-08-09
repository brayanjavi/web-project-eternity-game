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
    "WddddddddddddddddW",
    "WddMMddddMMddddMMdW",
    "WddMMddddMMddddMMdW",
    "WddddddddddddddddW",
    "WddddddddddddddddW",
    "EpppppppddddddddddW",
    "WddddddddddddddddW",
    "WddMMddddMMdddddddW",
    "WddMMddddMMdddddddW",
    "WddddddddddddddddW",
    "WddddddddddddddddW",
    "WddddddddddddddddW",
    "WddddddddddddddddW",
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

// --- Game State ---
const game = {
  state: 'title', // title, playing, dialog, transition, map
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
  fade: 0
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
    startGame();
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
function startGame() {
  document.getElementById('title').style.display = 'none';
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
  const n = document.getElementById('notification');
  n.innerText = text;
  n.style.opacity = 1;
  setTimeout(() => { n.style.opacity = 0; }, 2500);
}

function applyEffects(eff) {
  if (!eff) return;
  for (let k in eff) {
    game.stats[k] = Math.max(0, Math.min(100, game.stats[k] + eff[k]));
    showNotification(`${k.toUpperCase()} ${eff[k] > 0 ? '+' : ''}${eff[k]}`);
  }
  updateHUD();
}

function advanceDay() {
  game.day++;
  if (game.day > 7) {
    endCycle();
  } else {
    showNotification('Día ' + game.day);
    updateHUD();
    updateNPCs();
  }
}

function endCycle() {
  game.state = 'transition';
  document.getElementById('overlay').innerHTML = `<h1 style="font-size:32px;letter-spacing:8px;color:#d4a843;text-shadow:0 0 20px rgba(212,168,67,0.4);margin-bottom:16px;">CICLO ${game.cycle}</h1><p style="font-size:10px;color:#9892a6;margin-bottom:8px;">El mundo se reinicia...</p><p style="font-size:10px;color:#d4a843;">Tu conocimiento permanece.</p>`;
  document.getElementById('overlay').style.opacity = 1;
  setTimeout(() => {
    game.cycle++;
    game.day = 1;
    game.player.x = 9; game.player.y = 11;
    game.player.tx = 9; game.player.ty = 11;
    game.currentMap = 'ciudad_central';
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

  const m = maps[game.currentMap];
  for (let npc of m.npcs) {
    if (npc.cond && !npc.cond(game)) continue;
    if (Math.abs(npc.x - ix) <= 1 && Math.abs(npc.y - iy) <= 1) {
      startDialog(npc);
      return;
    }
  }
}

function startDialog(npc) {
  game.state = 'dialog';
  game.dialog.current = dialogues[npc.d];
  game.dialog.line = 0;
  game.dialog.char = 0;
  game.dialog.timer = 0;
  game.dialog.active = true;
  game.dialog.choices = null;
  document.getElementById('d-speaker').innerText = npc.name || game.dialog.current.speaker;
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

function selectChoice(idx) {
  const lineData = game.dialog.current.lines[game.dialog.line];
  const choice = lineData.choices[idx];
  if (choice.effects) applyEffects(choice.effects);
  if (choice.next) {
    game.dialog.current = dialogues[choice.next];
    game.dialog.line = 0;
    game.dialog.char = 0;
    document.getElementById('d-choices').innerHTML = '';
  } else {
    endDialog();
  }
}

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
        }
      }
    }

    if (game.player.moving) {
      let dx = game.player.tx - game.player.x;
      let dy = game.player.ty - game.player.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < game.player.speed * dt) {
        game.player.x = game.player.tx;
        game.player.y = game.player.ty;
        game.player.moving = false;
        
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
    }

    // Particles
    if (Math.random() < 0.1 && game.particles.length < 30) {
      game.particles.push({
        x: Math.random() * MAP_W * TILE_SIZE,
        y: Math.random() * MAP_H * TILE_SIZE,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: game.currentMap === 'bosque' ? '#af5' : '#fff'
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
}

// --- Rendering ---
// Seeded random for procedural tile details
function seededRandom(x, y) {
  let h = Math.imul(x ^ y, 0x9E3779B9);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function renderMap() {
  const m = maps[game.currentMap];
  
  // Cycle saturation modifier
  let sat = Math.min(1.0, 0.4 + (game.cycle - 1) * 0.1);
  ctx.filter = `saturate(${sat * 100}%)`;

  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      let tId = m.tiles[y][x];
      let t = TILE_TYPES[tId];
      let px = x * TILE_SIZE;
      let py = y * TILE_SIZE;
      
      ctx.fillStyle = t.color;
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      
      // Procedural details
      let sr = seededRandom(x, y);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      
      if (t.name === 'grass') {
        for(let i=0; i<4; i++) {
          let dx = Math.floor(seededRandom(x*i, y) * TILE_SIZE);
          let dy = Math.floor(seededRandom(x, y*i) * TILE_SIZE);
          ctx.fillStyle = sr > 0.5 ? '#1a4a28' : '#3a6a48';
          ctx.fillRect(px+dx, py+dy, 2, 2);
        }
      } else if (t.name === 'stone_floor' || t.name === 'wall') {
        ctx.fillRect(px, py, TILE_SIZE, 1);
        ctx.fillRect(px, py, 1, TILE_SIZE);
        if (sr > 0.8) ctx.fillRect(px+4, py+4, 2, 2);
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
  
  // Draw Player
  drawCharacter(game.player.x, game.player.y, '#111', '#f5d5b5', '#335', game.player.dir, game.player.frame, true);
  
  // Particles
  for (let p of game.particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life;
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
  let grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.height/3, canvas.width/2, canvas.height/2, canvas.width);
  grad.addColorStop(0, 'rgba(0,0,0,0)');
  grad.addColorStop(1, 'rgba(0,0,0,0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
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
