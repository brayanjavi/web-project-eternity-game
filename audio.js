/**
 * AudioManager - Sistema de Audio Procedural para ETERNO
 * Genera todos los efectos y música ambiental usando Web Audio API sin archivos externos.
 */
class AudioManager {
    constructor() {
        // Inicialización perezosa (lazy init) del AudioContext
        this.ctx = null;
        this.masterGain = null;
        
        // Estado ambiental
        this.ambientNodes = [];
        this.currentAmbient = null;
        
        // Comprobar soporte de Web Audio API
        this.isSupported = !!(window.AudioContext || window.webkitAudioContext);
    }

    /**
     * Inicializa el AudioContext en la primera interacción del usuario
     */
    init() {
        if (!this.isSupported) return;
        
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.ctx.createGain();
            this.masterGain.connect(this.ctx.destination);
            this.masterGain.gain.value = 1.0;
        }

        // Reanudar el contexto si está suspendido (políticas de autoplay de navegadores)
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Ajusta el volumen maestro general
     * @param {number} vol - Volumen entre 0.0 y 1.0
     */
    setMasterVolume(vol) {
        if (!this.ctx || !this.masterGain) return;
        this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }

    /**
     * Reproduce una nota simple con una envolvente ADSR
     */
    playNote(freq, duration, type = 'sine', volume = 0.5, delay = 0) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        const startTime = this.ctx.currentTime + delay;
        
        // Envolvente ADSR
        const attack = 0.02;
        const decay = 0.1;
        const sustain = 0.6;
        const release = duration * 0.3;

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + attack);
        gainNode.gain.linearRampToValueAtTime(volume * sustain, startTime + attack + decay);
        gainNode.gain.setValueAtTime(volume * sustain, startTime + duration - release);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);

        // Limpieza de memoria
        osc.onended = () => {
            osc.disconnect();
            gainNode.disconnect();
        };
    }

    /**
     * Crea un nodo de ruido blanco
     */
    _createNoiseBuffer() {
        const bufferSize = this.ctx.sampleRate * 2; // 2 segundos de buffer
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        return buffer;
    }

    /**
     * Detiene el ambiente actual de forma gradual
     */
    stopAmbient() {
        if (!this.ctx || this.ambientNodes.length === 0) return;

        const fadeOutTime = 2.0;
        const now = this.ctx.currentTime;

        this.ambientNodes.forEach(node => {
            if (node.gain) {
                // Desvanecer el volumen gradualmente
                node.gain.gain.setValueAtTime(node.gain.gain.value, now);
                node.gain.gain.linearRampToValueAtTime(0, now + fadeOutTime);
            }
            if (node.source) {
                node.source.stop(now + fadeOutTime);
                setTimeout(() => {
                    try {
                        node.source.disconnect();
                        if (node.gain) node.gain.disconnect();
                        if (node.filter) node.filter.disconnect();
                    } catch(e) { /* ya desconectado */ }
                }, fadeOutTime * 1000 + 100);
            }
        });

        this.ambientNodes = [];
        this.currentAmbient = null;
    }

    /**
     * Reproduce el sonido ambiental de un mapa específico
     */
    playAmbient(mapName) {
        if (!this.ctx) return;
        if (this.currentAmbient === mapName) return;

        this.stopAmbient();
        this.currentAmbient = mapName;
        const now = this.ctx.currentTime;

        const addOscillator = (freq, type, vol, modFreq = 0, modDepth = 0) => {
            const osc = this.ctx.createOscillator();
            const gainNode = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(vol, now + 2.0); // Fade in

            if (modFreq > 0) {
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.value = modFreq;
                lfo.connect(lfoGain);
                lfoGain.gain.value = modDepth;
                lfoGain.connect(gainNode.gain);
                lfo.start();
                this.ambientNodes.push({ source: lfo });
            }

            osc.connect(gainNode);
            gainNode.connect(this.masterGain);
            osc.start();

            this.ambientNodes.push({ source: osc, gain: gainNode });
            return { osc, gainNode };
        };

        const addNoise = (type, freq, Q, vol) => {
            const noiseBuffer = this._createNoiseBuffer();
            const noiseSource = this.ctx.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = type;
            filter.frequency.value = freq;
            filter.Q.value = Q;

            const gainNode = this.ctx.createGain();
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(vol, now + 2.0); // Fade in

            noiseSource.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.masterGain);
            noiseSource.start();

            this.ambientNodes.push({ source: noiseSource, gain: gainNode, filter });
            return { noiseSource, gainNode, filter };
        };

        // Generar ambiente según el mapa
        switch (mapName) {
            case 'ciudad_central':
                // Drone cálido y bajo con modulación lenta
                addOscillator(80, 'sine', 0.05, 0.1, 0.02);
                addOscillator(120, 'sine', 0.03, 0.15, 0.01);
                break;
                
            case 'mercado':
                // Drone y murmullo distante (ruido filtrado paso bajo)
                addOscillator(100, 'sine', 0.04);
                addNoise('lowpass', 400, 1, 0.03); // Simula murmullo de multitud
                break;

            case 'biblioteca':
                // Pad muy suave, pacífico y académico
                addOscillator(200, 'sine', 0.02);
                addOscillator(300, 'sine', 0.015);
                addOscillator(400, 'sine', 0.01);
                break;

            case 'catedral':
                // Dron profundo con efecto de eco/reverberación
                const delayNode = this.ctx.createDelay();
                delayNode.delayTime.value = 0.5;
                const feedbackGain = this.ctx.createGain();
                feedbackGain.gain.value = 0.4;
                
                delayNode.connect(feedbackGain);
                feedbackGain.connect(delayNode);
                delayNode.connect(this.masterGain);

                const cNode1 = addOscillator(65, 'sine', 0.06);
                const cNode2 = addOscillator(130, 'triangle', 0.03);
                const cNode3 = addOscillator(195, 'sine', 0.02);

                cNode1.gainNode.connect(delayNode);
                cNode2.gainNode.connect(delayNode);
                
                this.ambientNodes.push({ filter: delayNode }, { filter: feedbackGain });
                break;

            case 'bosque':
                // Viento bajo
                addNoise('lowpass', 150, 1, 0.04);
                
                // Insectos/grillos pulsantes (ruido paso banda)
                const insects = addNoise('bandpass', 3000, 5, 0.02);
                
                // LFO para pulsar el sonido de los insectos
                const lfo = this.ctx.createOscillator();
                const lfoGain = this.ctx.createGain();
                lfo.frequency.value = 2; // Pulsos rápidos
                lfo.connect(lfoGain);
                lfoGain.gain.value = 0.015;
                lfoGain.connect(insects.gainNode.gain);
                lfo.start();
                this.ambientNodes.push({ source: lfo });
                break;
        }
    }

    /**
     * Sonido de pasos del personaje
     */
    playFootstep() {
        if (!this.ctx) return;
        
        const noiseBuffer = this._createNoiseBuffer();
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        // Variación aleatoria de tono
        filter.frequency.value = 500 + Math.random() * 200; 

        const gainNode = this.ctx.createGain();
        const duration = 0.05;
        const startTime = this.ctx.currentTime;

        gainNode.gain.setValueAtTime(0.05, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noiseSource.start(startTime);
        noiseSource.stop(startTime + duration);

        noiseSource.onended = () => {
            noiseSource.disconnect();
            filter.disconnect();
            gainNode.disconnect();
        };
    }

    /**
     * Sonido al interactuar con un objeto/NPC
     */
    playInteract() {
        if (!this.ctx) return;
        this.playNote(440, 0.1, 'triangle', 0.1, 0);
        this.playNote(660, 0.1, 'triangle', 0.1, 0.1);
    }

    /**
     * Cambio de estadísticas (positivo o negativo)
     */
    playStatChange(positive) {
        if (!this.ctx) return;
        const dur = 0.08;
        const vol = 0.1;
        if (positive) {
            // Arpegio mayor ascendente (C5 - E5 - G5)
            this.playNote(523.25, dur, 'sine', vol, 0);
            this.playNote(659.25, dur, 'sine', vol, dur);
            this.playNote(783.99, dur, 'sine', vol, dur * 2);
        } else {
            // Arpegio menor descendente (G4 - Eb4 - C4)
            this.playNote(392.00, dur, 'sine', vol, 0);
            this.playNote(311.13, dur, 'sine', vol, dur);
            this.playNote(261.63, dur, 'sine', vol, dur * 2);
        }
    }

    /**
     * Apertura de diálogo
     */
    playDialogOpen() {
        if (!this.ctx) return;
        
        const noiseBuffer = this._createNoiseBuffer();
        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        const startTime = this.ctx.currentTime;
        const duration = 0.3;

        // Barrido del filtro
        filter.frequency.setValueAtTime(200, startTime);
        filter.frequency.exponentialRampToValueAtTime(2000, startTime + duration);

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0.05, startTime);
        gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

        noiseSource.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.masterGain);

        noiseSource.start(startTime);
        noiseSource.stop(startTime + duration);

        noiseSource.onended = () => {
            noiseSource.disconnect();
            filter.disconnect();
            gainNode.disconnect();
        };
    }

    /**
     * Selección de opción en diálogo
     */
    playDialogChoice() {
        if (!this.ctx) return;
        this.playNote(880, 0.03, 'square', 0.02, 0);
    }

    /**
     * Efecto dramático para el fin del ciclo / eterno retorno
     */
    playCycleEnd() {
        if (!this.ctx) return;
        
        // Retumbo profundo
        this.playNote(40, 2.0, 'sine', 0.3, 0);
        
        // Escala cromática descendente rápida en registro alto + Glitch
        let delay = 0;
        let freq = 1046.50; // C6

        for (let i = 0; i < 15; i++) {
            // Glitch: probabilidad de salto de frecuencia aleatorio
            let currentFreq = freq;
            if (Math.random() > 0.7) {
                currentFreq += (Math.random() * 400 - 200);
            }
            this.playNote(currentFreq, 0.05, 'sawtooth', 0.05, delay);
            freq *= 0.94387; // Medio tono abajo aprox
            delay += 0.05;
        }
    }

    /**
     * Notificación general (campana suave)
     */
    playNotification() {
        if (!this.ctx) return;
        this.playNote(1200, 0.3, 'sine', 0.1, 0);
        this.playNote(2400, 0.3, 'sine', 0.05, 0); // Armónico
    }

    /**
     * Alerta de evento importante
     */
    playEventAlert() {
        if (!this.ctx) return;
        const dur = 0.15;
        const vol = 0.05;
        for (let i = 0; i < 3; i++) {
            this.playNote(600, dur, 'square', vol, (dur * 2) * i);
            this.playNote(800, dur, 'square', vol, (dur * 2) * i + dur);
        }
    }

    /**
     * Sonidos para los diferentes finales del juego
     */
    playEnding(type) {
        if (!this.ctx) return;
        this.stopAmbient();
        
        const dur = 0.4;
        const vol = 0.15;

        switch(type) {
            case 'voluntad':
                // Acorde Mayor Ascendente y Heroico (C - E - G - C)
                this.playNote(261.63, dur, 'triangle', vol, 0);
                this.playNote(329.63, dur, 'triangle', vol, dur);
                this.playNote(392.00, dur, 'triangle', vol, dur * 2);
                this.playNote(523.25, 2.0, 'triangle', vol, dur * 3);
                break;

            case 'nihilismo':
                // Escala menor descendente hacia ruido
                this.playNote(392.00, dur, 'sine', vol, 0);
                this.playNote(349.23, dur, 'sine', vol, dur);
                this.playNote(311.13, dur, 'sine', vol, dur * 2);
                this.playNote(261.63, 1.0, 'sine', vol, dur * 3);
                
                // Disolución en ruido
                const noiseBuffer = this._createNoiseBuffer();
                const noiseSource = this.ctx.createBufferSource();
                noiseSource.buffer = noiseBuffer;
                const gainNode = this.ctx.createGain();
                
                gainNode.gain.setValueAtTime(0, this.ctx.currentTime + dur * 3);
                gainNode.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + dur * 3 + 1.0);
                gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + dur * 3 + 3.0);
                
                noiseSource.connect(gainNode);
                gainNode.connect(this.masterGain);
                noiseSource.start(this.ctx.currentTime + dur * 3);
                noiseSource.stop(this.ctx.currentTime + dur * 3 + 3.0);
                break;

            case 'amorFati':
                // Acorde cálido y sostenido (F - A - C - F)
                this.playNote(174.61, 3.0, 'sine', vol, 0);
                this.playNote(220.00, 3.0, 'sine', vol, 0);
                this.playNote(261.63, 3.0, 'sine', vol, 0);
                this.playNote(349.23, 3.0, 'sine', vol, 0);
                break;

            case 'creacion':
                // Secuencia arpegiada juguetona
                this.playNote(523.25, 0.15, 'triangle', vol, 0);
                this.playNote(659.25, 0.15, 'triangle', vol, 0.15);
                this.playNote(783.99, 0.15, 'triangle', vol, 0.3);
                this.playNote(1046.50, 0.15, 'triangle', vol, 0.45);
                this.playNote(880.00, 0.15, 'triangle', vol, 0.6);
                this.playNote(1174.66, 1.0, 'triangle', vol, 0.75);
                break;

            case 'equilibrio':
                // Armónicos balanceados hacia un solo tono puro
                this.playNote(220, 2.0, 'sine', vol, 0);
                this.playNote(440, 1.5, 'sine', vol * 0.5, 0);
                this.playNote(660, 1.0, 'sine', vol * 0.25, 0);
                this.playNote(880, 0.5, 'sine', vol * 0.125, 0);
                this.playNote(220, 2.0, 'sine', vol, 2.0); // Tono puro final
                break;
        }
    }
}

// Asignar al objeto global window
window.AudioManager = new AudioManager();
