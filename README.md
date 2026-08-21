# 🌌 ETERNO — El Eterno Retorno de Nietzsche

> *"¿Qué harías si un demonio te dijera que tendrás que vivir esta misma vida exactamente igual, una y otra vez por toda la eternidad?"* — Friedrich Nietzsche

**ETERNO** es un videojuego de aventura y RPG filosófico en 2D (Pixel Art / Top-Down) desarrollado con **HTML5 Canvas**, **Vanilla JavaScript** y **Web Audio API**. El juego prescinde de dependencias pesadas y utiliza síntesis de audio procedural en tiempo real.

---

## 📖 Concepto y Filosofía

El jugador se encuentra atrapado en un bucle temporal de **7 días**. A diferencia de los RPGs tradicionales donde el progreso se mide en niveles de fuerza física, en **ETERNO** el verdadero progreso es el **conocimiento acumulado**, las reflexiones morales y las decisiones tomadas ante el misterio del Eterno Retorno.

Tus decisiones moldean 4 estadísticas filosóficas fundamentales:
- **VOL (Voluntad de Poder)**: La determinación de superarse y trascender el ciclo.
- **NIH (Nihilismo)**: La pérdida de sentido y el abismo de la nada.
- **AMO (Amor Fati)**: El amor al destino, aceptando y abrazando cada instante con alegría.
- **CRE (Creación)**: La forja de nuevos valores e interpretaciones del mundo.

Alcanzar 80 puntos en alguna estadística (o el equilibrio entre todas) desbloquea uno de los **5 finales filosóficos** tras sobrevivir varios ciclos.

---

## ⚡ Características y Mecánicas Principales

### ⏱️ 1. Reloj en Tiempo Real y Ciclo Día/Noche Continuo
- Cada día dura **90 segundos reales** de juego continuo.
- El reloj de 24 horas (`06:00` a `24:00`) y la barra de progreso solar avanzan en tiempo real.
- **Iluminación dinámica fluida**:
  - `06:00 - 09:30`: Amanecer cálido y dorado.
  - `09:30 - 16:45`: Luz clara de mediodía.
  - `16:45 - 20:20`: Atardecer rojizo y púrpura.
  - `20:20 - 24:00`: Noche azulada y profunda.
- Al llegar la medianoche, el día avanza automáticamente y se activan los eventos diarios (¡en el **Día 5** llega el Demonio!).

### 🏃 2. Movimiento Ágil con Dash / Impulso (`SHIFT`)
- Esquiva obstáculos y desplázate rápidamente por los mapas usando el Dash con estela de sombras (*ghost trail*).

### 🎯 3. Minijuegos y Desafíos Activos de Habilidad
- 🥖 **Mercado (Desafío de Reflejos / QTE)**: Sincroniza la aguja en la zona dorada del horno en movimiento.
- 📜 **Biblioteca (Enigma de Runas Antiguas)**: Pon a prueba tu memoria reproduciendo secuencias de runas numéricas `[1, 2, 3, 4]`.
- 🔔 **Catedral (Armonía del Campanario Sagrado)**: Minijuego rítmico de 4 carriles donde tocas las notas celestiales al compás.
- 🌲 **Bosque (Niebla del Abismo - Supervivencia 10s)**: Esquiva proyectiles de sombras oscuras usando tus reflejos y el Dash.
- 😈 **Día 5 (Duelo de Voluntad con el Demonio)**: Desafío de resistencia y velocidad (*Tug of War*) machacando la tecla de acción para someter la Duda Eterna.

### 📱 4. Soporte para Dispositivos Móviles (Controles Arcade Táctiles)
- **D-Pad táctil retro**: Cruceta de 4 direcciones en pantalla.
- **Botones de acción**: Botón `A` (Interactuar/Confirmar), Botón `B` (Acción), Botón `DASH` (Impulso rápido).
- **Botonera Numérica Virtual `[1, 2, 3, 4]`**: Aparece automáticamente durante minijuegos y elecciones de diálogo.
- **Acceso rápido**: Botones superiores para `🗺️ MAPA` y `⏳ DÍA`.

### 🎵 5. Audio 100% Procedural (Web Audio API)
- No requiere archivos de audio externos (`.mp3` o `.wav`).
- Genera pistas ambientales con osciladores, envolventes ADSR y efectos de sonido dinámicos (pasos, campanas, dash, runas, fanfarrias y finales únicos).

---

## 🗺️ Zonas del Mundo

1. **Ciudad Central**: La plaza del pueblo con fuentes, estatuas y el Guardián.
2. **Mercado**: Puestos de mercaderes, panadería y gran actividad comercial.
3. **Biblioteca**: Estanterías ancestrales con citas reales de Nietzsche y manuscritos ocultos.
4. **Catedral**: Templo silencioso con columnas, altares de sacrificio de estadísticas y campanario.
5. **Bosque Profundo**: Niebla misteriosa, tumbas y presencias enigmáticas tras varios ciclos.

---

## 🕹️ Controles de Juego

### 💻 Teclado (PC)
| Tecla | Acción |
|---|---|
| **WASD** / **Flechas** | Mover al personaje |
| **SHIFT** | Dash / Impulso rápido |
| **E** / **Espacio** / **Enter** | Interactuar con NPCs/Objetos / Acción en Minijuegos |
| **1, 2, 3, 4** | Seleccionar opciones de diálogo / Teclas de Minijuegos |
| **M** / **Escape** | Abrir/Cerrar Mapa de Viaje Rápido |
| **T** | Descansar / Avanzar al siguiente día manualmente |

### 📱 Pantalla Táctil (Móviles / Tablets)
- **D-Pad Virtual**: Movimiento en 4 direcciones.
- **Botón A / B**: Interactuar y ejecutar acciones en minijuegos.
- **Botón DASH**: Impulso rápido.
- **Botones 1-4**: Teclado flotante para minijuegos y elecciones.
- **Botones Superiores**: Acceso directo a Mapa y Día.

---

## 🚀 Cómo Ejecutar el Proyecto

1. Clona o descarga este repositorio:
   ```bash
   git clone https://github.com/brayanjavi/web-project-eternity-game.git
   ```
2. Abre `index.html` en cualquier navegador moderno (Google Chrome, Firefox, Safari, Edge).
3. ¡No requiere instalación de servidores ni paquetes adicionales! Todo funciona de forma nativa en el navegador.

---

## 🛠️ Estructura del Código

- `index.html`: Estructura base y carga de fuentes.
- `game.js`: Motor del juego (renderizado Canvas, HUD, mapas, diálogos, minijuegos, ciclo día/noche y controles táctiles).
- `audio.js`: Motor de audio procedural sintetizado vía Web Audio API.
- `style.css`: Hoja de estilos complementaria.
