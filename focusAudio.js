/* ==========================================================================
   EDUPULSE FOCUS ROOM & PROCEDURAL AUDIO ENGINE
   Web Audio API Ambient Synthesis (100% Offline) + Pomodoro Timer
   ========================================================================== */

const FocusAudio = {
  audioCtx: null,
  activeNodes: {},
  timerInterval: null,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  isRunning: false,

  quotes: [
    "Continuous effort — not strength or intelligence — is the key to unlocking your potential.",
    "The secret of getting ahead is getting started. Focus on one topic at a time.",
    "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success.",
    "Deep focus is a superpower in a world full of digital distractions.",
    "Don't study until you get it right. Study until you can't get it wrong."
  ],

  init() {
    this.setupTimer();
    this.setupAmbientControls();
    this.setupZenMode();
  },

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  /**
   * ==========================================
   * POMODORO TIMER SYSTEM
   * ==========================================
   */
  setupTimer() {
    const startBtn = document.getElementById('timerStartBtn');
    const resetBtn = document.getElementById('timerResetBtn');
    const modeBtns = document.querySelectorAll('.pomo-mode-btn');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.pauseTimer();
        } else {
          this.startTimer();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        this.resetTimer();
      });
    }

    modeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        modeBtns.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const mins = parseInt(e.currentTarget.getAttribute('data-time'));
        const mode = e.currentTarget.getAttribute('data-mode');

        this.pauseTimer();
        this.totalSeconds = mins * 60;
        this.remainingSeconds = this.totalSeconds;
        this.updateTimerDisplay();

        const tag = document.getElementById('timerStatusTag');
        if (tag) {
          const modeLabels = {
            'study': 'Focus Study',
            'short-break': 'Short Break',
            'long-break': 'Long Break',
            'deep-work': 'Deep Work Sprint'
          };
          tag.textContent = modeLabels[mode] || 'Focus Study';
        }
      });
    });

    this.updateTimerDisplay();
  },

  startTimer() {
    this.isRunning = true;
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) {
      startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Session';
    }

    this.timerInterval = setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds--;
        this.updateTimerDisplay();
      } else {
        this.pauseTimer();
        App.showToast('Pomodoro session completed! Take a break!', 'success');
        if (window.confetti) window.confetti({ particleCount: 70, spread: 80 });
      }
    }, 1000);
  },

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    const startBtn = document.getElementById('timerStartBtn');
    if (startBtn) {
      startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start Session';
    }
  },

  resetTimer() {
    this.pauseTimer();
    this.remainingSeconds = this.totalSeconds;
    this.updateTimerDisplay();
  },

  updateTimerDisplay() {
    const mins = Math.floor(this.remainingSeconds / 60);
    const secs = this.remainingSeconds % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const display = document.getElementById('timerDisplay');
    const navDisplay = document.getElementById('navPomoTimer');
    const zenDisplay = document.getElementById('zenClock');

    if (display) display.textContent = str;
    if (navDisplay) navDisplay.textContent = str;
    if (zenDisplay) zenDisplay.textContent = str;

    // Update SVG Circle Progress
    const circle = document.getElementById('timerProgressCircle');
    if (circle) {
      const radius = 115;
      const circumference = 2 * Math.PI * radius;
      const progress = this.remainingSeconds / this.totalSeconds;
      const offset = circumference * (1 - progress);
      circle.style.strokeDashoffset = offset;
    }
  },

  /**
   * ==========================================
   * PROCEDURAL AMBIENT SOUND GENERATION
   * ==========================================
   */
  setupAmbientControls() {
    const soundCards = document.querySelectorAll('.sound-card');
    soundCards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('vol-slider') || e.target.closest('.sound-vol')) {
          return;
        }
        const soundType = card.getAttribute('data-sound');
        this.toggleSound(soundType);
      });
    });

    sliders.forEach(slider => {
      slider.addEventListener('input', (e) => {
        const soundType = e.currentTarget.getAttribute('data-sound');
        const vol = parseFloat(e.currentTarget.value) / 100;
        this.setVolume(soundType, vol);
      });
    });

    if (muteAllBtn) {
      muteAllBtn.addEventListener('click', () => {
        this.stopAllSounds();
      });
    }
  },

  toggleSound(type) {
    const card = document.querySelector(`.sound-card[data-sound="${type}"]`);
    const btn = document.querySelector(`.sound-toggle-btn[data-sound="${type}"]`);

    if (this.activeNodes[type]) {
      // Stop sound
      this.stopSound(type);
      if (card) card.classList.remove('playing');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    } else {
      // Start sound
      this.startSound(type);
      if (card) card.classList.add('playing');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }
  },

  startSound(type) {
    const ctx = this.getAudioContext();
    const gainNode = ctx.createGain();
    const slider = document.querySelector(`.vol-slider[data-sound="${type}"]`);
    const initialVol = slider ? parseFloat(slider.value) / 100 : 0.5;
    gainNode.gain.setValueAtTime(initialVol, ctx.currentTime);
    gainNode.connect(ctx.destination);

    if (type === 'rain') {
      // Rain: Pink noise through lowpass filter
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      this.activeNodes[type] = { source: whiteNoise, gain: gainNode };

    } else if (type === 'binaural') {
      // 10Hz Alpha Brainwave Binaural Beats: 200Hz left, 210Hz right
      const merger = ctx.createChannelMerger(2);

      const oscLeft = ctx.createOscillator();
      oscLeft.type = 'sine';
      oscLeft.frequency.setValueAtTime(200, ctx.currentTime);
      oscLeft.connect(merger, 0, 0);

      const oscRight = ctx.createOscillator();
      oscRight.type = 'sine';
      oscRight.frequency.setValueAtTime(210, ctx.currentTime);
      oscRight.connect(merger, 0, 1);

      merger.connect(gainNode);
      oscLeft.start();
      oscRight.start();

      this.activeNodes[type] = { sources: [oscLeft, oscRight], gain: gainNode };

    } else if (type === 'cafe') {
      // Library Hum: Low-frequency gentle filtered rumble
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(450, ctx.currentTime);
      bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

      noise.connect(bandpass);
      bandpass.connect(gainNode);
      noise.start();

      this.activeNodes[type] = { source: noise, gain: gainNode };

    } else if (type === 'fire') {
      // Campfire: Crackle clicks & warm hum
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      osc.start();

      this.activeNodes[type] = { source: osc, gain: gainNode };
    }
  },

  setVolume(type, vol) {
    if (this.activeNodes[type] && this.activeNodes[type].gain) {
      this.activeNodes[type].gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    }
  },

  stopSound(type) {
    if (this.activeNodes[type]) {
      try {
        if (this.activeNodes[type].source) {
          this.activeNodes[type].source.stop();
        }
        if (this.activeNodes[type].sources) {
          this.activeNodes[type].sources.forEach(s => s.stop());
        }
      } catch (err) {
        console.error(err);
      }
      delete this.activeNodes[type];
    }
  },

  stopAllSounds() {
    Object.keys(this.activeNodes).forEach(type => {
      this.stopSound(type);
      const card = document.querySelector(`.sound-card[data-sound="${type}"]`);
      const btn = document.querySelector(`.sound-toggle-btn[data-sound="${type}"]`);
      if (card) card.classList.remove('playing');
      if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i>';
    });
    App.showToast('All ambient study audio stopped.', 'info');
  },

  /**
   * ==========================================
   * ZEN FULLSCREEN DISTRACTION-FREE MODE
   * ==========================================
   */
  setupZenMode() {
    const zenBtn = document.getElementById('zenModeBtn');
    const exitBtn = document.getElementById('zenExitBtn');
    const overlay = document.getElementById('zenModalOverlay');
    const zenTimerBtn = document.getElementById('zenTimerToggleBtn');
    const zenSoundBtn = document.getElementById('zenSoundToggleBtn');

    if (zenBtn && overlay) {
      zenBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      });
    }

    if (exitBtn && overlay) {
      exitBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    if (zenTimerBtn) {
      zenTimerBtn.addEventListener('click', () => {
        if (this.isRunning) {
          this.pauseTimer();
          zenTimerBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
        } else {
          this.startTimer();
          zenTimerBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        }
      });
    }

    if (zenSoundBtn) {
      zenSoundBtn.addEventListener('click', () => {
        this.toggleSound('rain');
        if (this.activeNodes['rain']) {
          zenSoundBtn.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy"></i> Rain Sound: ON';
        } else {
          zenSoundBtn.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy"></i> Rain Sound: OFF';
        }
      });
    }
  }
};

if (typeof window !== 'undefined') {
  window.FocusAudio = FocusAudio;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => FocusAudio.init());
  } else {
    FocusAudio.init();
  }
}
