// ==UserScript==
// @name         BetterMebis
// @namespace    http://tampermonkey.net/
// @version      2026-09-28
// @description  try to take over the world!
// @author       You
// @match        https://lernplattform.bycs.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bycs.de
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
      // ---------------------------------------------------------------------
  // Styles (einmalig einfügen)
  // ---------------------------------------------------------------------
  const STYLE_ID = 'bm-player-style';
  if (!document.getElementById(STYLE_ID)) {
    const st = document.createElement('style');
    st.id = STYLE_ID;
    st.textContent = `
#mini-video-overlay{position:fixed;inset:20px;background:#000;border-radius:12px;overflow:hidden;
  z-index:999999;box-shadow:0 8px 32px rgba(0,0,0,.8);font-family:system-ui,-apple-system,sans-serif;
  color:#fff;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
  overscroll-behavior:contain}
#mini-video-overlay:fullscreen{inset:0;border-radius:0}
@media (max-width:800px),(pointer:coarse){#mini-video-overlay{inset:0;border-radius:0}}
#mini-video-overlay video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;pointer-events:none;background:#000}
#mini-video-overlay .bm-layer{position:absolute;inset:0;touch-action:none;z-index:5}
#mini-video-overlay .bm-ui{transition:opacity .2s ease}
#mini-video-overlay.bm-hide .bm-ui{opacity:0;pointer-events:none}
#mini-video-overlay.bm-hide{cursor:none}
#mini-video-overlay button,#mini-video-overlay select{font:inherit;color:#fff;border:none;
  background:rgba(255,255,255,.15);border-radius:8px;min-width:44px;min-height:44px;padding:0 12px;
  cursor:pointer;touch-action:manipulation}
#mini-video-overlay button:active{background:rgba(255,255,255,.3)}
#mini-video-overlay select option{color:#000}
.bm-close{position:absolute;top:max(10px,env(safe-area-inset-top));right:max(10px,env(safe-area-inset-right));
  z-index:30;border-radius:50%!important;width:44px;height:44px;padding:0!important;font-size:18px}
.bm-bar{position:absolute;left:0;right:0;bottom:0;z-index:30;
  padding:24px max(14px,env(safe-area-inset-right)) max(10px,env(safe-area-inset-bottom)) max(14px,env(safe-area-inset-left));
  background:linear-gradient(transparent,rgba(0,0,0,.85))}
.bm-row{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap}
.bm-grp{display:flex;align-items:center;gap:8px}
.bm-time{font-size:13px;color:#ddd;font-variant-numeric:tabular-nums;white-space:nowrap}
.bm-seek{position:relative;height:36px;display:flex;align-items:center;touch-action:none;cursor:pointer}
.bm-track{position:relative;width:100%;height:5px;border-radius:3px;background:rgba(255,255,255,.25);overflow:hidden}
.bm-buf,.bm-fill{position:absolute;left:0;top:0;bottom:0;width:0}
.bm-buf{background:rgba(255,255,255,.35)}
.bm-fill{background:#f00}
.bm-thumb{position:absolute;top:50%;left:0;width:16px;height:16px;border-radius:50%;background:#f00;
  transform:translate(-50%,-50%);pointer-events:none;box-shadow:0 0 4px rgba(0,0,0,.6)}
.bm-seek.bm-active .bm-track{height:8px}
.bm-seek.bm-active .bm-thumb{width:22px;height:22px}
.bm-ind{position:absolute;top:22%;left:50%;transform:translate(-50%,-50%);z-index:20;pointer-events:none;
  background:rgba(0,0,0,.75);padding:12px 24px;border-radius:24px;font-size:18px;font-weight:700;
  opacity:0;transition:opacity .2s ease;white-space:nowrap}
.bm-menu{position:absolute;right:max(14px,env(safe-area-inset-right));bottom:calc(max(10px,env(safe-area-inset-bottom)) + 120px);
  z-index:35;display:none;grid-template-columns:repeat(4,56px);gap:6px;padding:8px;
  background:rgba(20,20,20,.92);border-radius:12px}
.bm-menu.bm-open{display:grid}
#mini-video-overlay.bm-hide .bm-menu{display:none}
#mini-video-overlay .bm-menu button{min-width:0;padding:0;width:56px}
#mini-video-overlay .bm-menu button.bm-on{background:#f00}
.bm-badge{position:absolute;top:max(12px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);
  z-index:20;pointer-events:none;background:rgba(0,0,0,.55);padding:4px 12px;border-radius:14px;
  font-size:13px;font-weight:700;opacity:0;transition:opacity .15s ease}
.bm-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:25;
  display:flex;align-items:center;gap:28px;pointer-events:none}
#mini-video-overlay .bm-cbtn{pointer-events:auto;width:56px;height:56px;border-radius:50%;padding:0;
  font-size:15px;font-weight:700;background:rgba(0,0,0,.6)}
#mini-video-overlay .bm-cplay{width:76px;height:76px;font-size:30px}
#mini-video-overlay.bm-hide .bm-cbtn{pointer-events:none}
.bm-spin{position:absolute;top:50%;left:50%;width:44px;height:44px;margin:-22px;z-index:18;
  border:4px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;
  animation:bm-rot 1s linear infinite;display:none;pointer-events:none}
@keyframes bm-rot{to{transform:rotate(360deg)}}
@media (max-width:480px){.bm-bar .bm-fr{display:none}}
`;
    document.head.appendChild(st);
  }

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  // ---------------------------------------------------------------------
  // Player
  // ---------------------------------------------------------------------
  function openCenteredVideoPlayer(videoUrl) {
    const existing = document.getElementById('mini-video-overlay');
    if (existing && existing._cleanup) existing._cleanup(true);

    const overlay = el('div');
    overlay.id = 'mini-video-overlay';

    const video = el('video');
    video.src = videoUrl;
    video.controls = false;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.preload = 'auto';

    const layer = el('div', 'bm-layer');           // fängt alle Gesten ab
    const indicator = el('div', 'bm-ind');
    const spinner = el('div', 'bm-spin');
    const badge = el('div', 'bm-badge', '2x ››');
    const centerBtn = el('div', 'bm-center bm-ui');
    const backBtn = el('button', 'bm-cbtn', '« 10');
    const centerPlay = el('button', 'bm-cbtn bm-cplay', '►');
    const fwdBtn = el('button', 'bm-cbtn', '10 »');
    backBtn.setAttribute('aria-label', '10 Sekunden zurück');
    fwdBtn.setAttribute('aria-label', '10 Sekunden vor');
    centerBtn.append(backBtn, centerPlay, fwdBtn);
    const closeBtn = el('button', 'bm-close bm-ui', '✕');
    closeBtn.setAttribute('aria-label', 'Schließen');

    // Steuerleiste
    const bar = el('div', 'bm-bar bm-ui');
    const seek = el('div', 'bm-seek');
    seek.setAttribute('role', 'slider');
    const track = el('div', 'bm-track');
    const buf = el('div', 'bm-buf');
    const fill = el('div', 'bm-fill');
    const thumb = el('div', 'bm-thumb');
    track.append(buf, fill);
    seek.append(track, thumb);

    const row = el('div', 'bm-row');
    const left = el('div', 'bm-grp');
    const right = el('div', 'bm-grp');

    const playBtn = el('button', null, '►');
    const prevBtn = el('button', 'bm-fr', '‹ 1f');
    const nextBtn = el('button', 'bm-fr', '1f ›');
    prevBtn.title = '1 Frame zurück (,)';
    nextBtn.title = '1 Frame vor (.)';
    const timeEl = el('span', 'bm-time', '0:00 / 0:00');
    left.append(playBtn, prevBtn, nextBtn, timeEl);

    const muteBtn = el('button', null, '🔊');
    const speedBtn = el('button', null, '1x');
    speedBtn.setAttribute('aria-label', 'Wiedergabetempo');
    const menu = el('div', 'bm-menu');
    let speed = 1;
    const speedBtns = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(v => {
      const b = el('button', v === 1 ? 'bm-on' : null, `${v}x`);
      b.addEventListener('click', () => { applySpeed(v); closeMenu(); scheduleHide(); });
      menu.appendChild(b);
      return [v, b];
    });
    function applySpeed(v) {
      speed = v;
      video.defaultPlaybackRate = v;
      video.playbackRate = v;
      speedBtn.textContent = `${v}x`;
      speedBtns.forEach(([x, b]) => b.classList.toggle('bm-on', x === v));
      showIndicator(`Tempo: ${v}x`);
    }
    function closeMenu() { menu.classList.remove('bm-open'); }
    speedBtn.addEventListener('click', () => {
      const open = !menu.classList.contains('bm-open');
      menu.classList.toggle('bm-open', open);
      clearTimeout(hideTimer);
      if (!open) scheduleHide();
    });
    // Tempo bleibt auch nach dem Laden der Metadaten erhalten
    video.addEventListener('loadedmetadata', () => { video.playbackRate = speed; });
    const fsBtn = el('button', null, '⛶');
    fsBtn.title = 'Vollbild (F)';
    right.append(muteBtn, speedBtn, fsBtn);

    row.append(left, right);
    bar.append(seek, row);
    overlay.append(video, layer, spinner, indicator, badge, menu, centerBtn, closeBtn, bar);

    // -------------------------------------------------------------------
    // Helfer
    // -------------------------------------------------------------------
    const fmt = (s) => {
      if (!isFinite(s)) return '0:00';
      s = Math.floor(s);
      const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      return h > 0
        ? `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
        : `${m}:${String(sec).padStart(2, '0')}`;
    };
    const dur = () => (isFinite(video.duration) ? video.duration : 0);

    let indTimer;
    const showIndicator = (text, sticky) => {
      indicator.textContent = text;
      indicator.style.opacity = '1';
      clearTimeout(indTimer);
      if (!sticky) indTimer = setTimeout(() => { indicator.style.opacity = '0'; }, 700);
    };
    const hideIndicator = () => { clearTimeout(indTimer); indicator.style.opacity = '0'; };

    // UI Ein-/Ausblenden
    let uiVisible = true, hideTimer, scrubbing = false;
    const setUI = (v) => {
      uiVisible = v;
      overlay.classList.toggle('bm-hide', !v);
    };
    const scheduleHide = () => {
      clearTimeout(hideTimer);
      if (!video.paused && !scrubbing) hideTimer = setTimeout(() => setUI(false), 5000);
    };
    const showUI = () => { setUI(true); scheduleHide(); };

    // Wiedergabe
    const togglePlay = () => {
      if (video.paused) video.play().catch(() => {});
      else video.pause();
    };
    const seekTo = (t) => {
      if (!dur()) return;
      video.currentTime = clamp(t, 0, dur());
    };
    const seekBy = (s) => seekTo(video.currentTime + s);

    const FPS = 30;
    const stepFrame = (dir) => {
      video.pause();
      seekBy(dir / FPS);
      showIndicator(dir > 0 ? '› 1 Frame' : '‹ 1 Frame');
    };

    const setVolume = (v) => {
      video.volume = clamp(v, 0, 1);
      if (video.volume > 0) video.muted = false;
      showIndicator(`🔊 ${Math.round(video.volume * 100)}%`);
    };
    const toggleMute = () => {
      video.muted = !video.muted;
      showIndicator(video.muted ? '🔇 Stumm' : '🔊 Ton an');
    };

    // Vollbild (+ Querformat auf Mobilgeräten)
    const toggleFullscreen = () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if (overlay.requestFullscreen) {
        overlay.requestFullscreen().catch(err => console.error('Vollbild-Fehler:', err.message));
      } else if (video.webkitEnterFullscreen) {   // iPhone Safari
        video.webkitEnterFullscreen();
      }
    };
    const onFsChange = () => {
      try {
        if (document.fullscreenElement && screen.orientation && screen.orientation.lock &&
            window.matchMedia('(pointer:coarse)').matches) {
          screen.orientation.lock('landscape').catch(() => {});
        } else if (!document.fullscreenElement && screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      } catch (_) { /* ignorieren */ }
    };
    document.addEventListener('fullscreenchange', onFsChange);

    // -------------------------------------------------------------------
    // Video-Events
    // -------------------------------------------------------------------
    const syncPlayState = () => {
      const p = video.paused;
      playBtn.textContent = p ? '►' : '❚❚';
      centerPlay.textContent = p ? '►' : '❚❚';
      overlay.classList.toggle('bm-paused', p);
      if (p) { setUI(true); clearTimeout(hideTimer); } else scheduleHide();
    };
    video.addEventListener('play', syncPlayState);
    video.addEventListener('pause', syncPlayState);
    video.addEventListener('waiting', () => { spinner.style.display = 'block'; });
    ['playing', 'canplay', 'seeked'].forEach(ev =>
      video.addEventListener(ev, () => { spinner.style.display = 'none'; }));
    video.addEventListener('volumechange', () => {
      muteBtn.textContent = (video.muted || video.volume === 0) ? '🔇' : '🔊';
    });
    video.addEventListener('error', () => {
      spinner.style.display = 'none';
      showIndicator('⚠ Video konnte nicht geladen werden', true);
    });

    let raf, lastSec = -1;
    const updateProgress = () => {
      const d = dur();
      const pct = d ? (video.currentTime / d) * 100 : 0;
      fill.style.width = pct + '%';
      thumb.style.left = pct + '%';
      if (d && video.buffered.length) {
        const end = video.buffered.end(video.buffered.length - 1);
        buf.style.width = (end / d) * 100 + '%';
      }
      const sec = Math.floor(video.currentTime);
      if (sec !== lastSec || !d) {
        lastSec = sec;
        timeEl.textContent = `${fmt(video.currentTime)} / ${fmt(d)}`;
        seek.setAttribute('aria-valuenow', String(sec));
      }
    };
    const tick = () => { updateProgress(); raf = requestAnimationFrame(tick); };
    tick();

    // -------------------------------------------------------------------
    // Fortschrittsbalken (Pointer Events, Maus + Touch, Ziehen möglich)
    // -------------------------------------------------------------------
    const seekFromPointer = (e) => {
      const r = track.getBoundingClientRect();
      const f = clamp((e.clientX - r.left) / r.width, 0, 1);
      seekTo(f * dur());
      showIndicator(`${fmt(f * dur())} / ${fmt(dur())}`, true);
    };
    seek.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      scrubbing = true;
      seek.classList.add('bm-active');
      seek.setPointerCapture(e.pointerId);
      clearTimeout(hideTimer);
      seekFromPointer(e);
    });
    seek.addEventListener('pointermove', (e) => { if (scrubbing) seekFromPointer(e); });
    const endScrub = () => {
      if (!scrubbing) return;
      scrubbing = false;
      seek.classList.remove('bm-active');
      hideIndicator();
      scheduleHide();
    };
    seek.addEventListener('pointerup', endScrub);
    seek.addEventListener('pointercancel', endScrub);

    // -------------------------------------------------------------------
    // Gesten auf der Videofläche
    //   Tippen ............. Steuerung einblenden; bei sichtbarer Steuerung Play/Pause
    //   Doppeltippen L/R ... ±10 s (mehrfach hintereinander summiert sich)
    //   Doppeltippen Mitte . Play/Pause
    //   Wischen ← → ........ Vor-/Zurückspulen
    //   Wischen ↑ ↓ ........ Lautstärke
    //   Gedrückt halten .... 2x Tempo solange gehalten
    //   Maus: Klick = Play/Pause, Doppelklick = Vollbild
    // -------------------------------------------------------------------
    let g = null;
    let lastTap = 0, lastTapX = 0, tapTimer;
    let lastTouchEnd = 0;
    let accum = 0, accumTimer;

    const doubleTapSeek = (dir) => {
      accum += dir * 10;
      clearTimeout(accumTimer);
      accumTimer = setTimeout(() => { accum = 0; }, 900);
      seekBy(dir * 10);
      showIndicator(accum > 0 ? `+${accum}s »` : `« ${-accum}s`);
    };

    const handleTap = (e) => {
      const now = performance.now();
      const r = layer.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width;
      if (now - lastTap < 300 && Math.abs(e.clientX - lastTapX) < 80) {
        clearTimeout(tapTimer);
        lastTap = now; lastTapX = e.clientX;
        if (rx < 0.35) doubleTapSeek(-1);
        else if (rx > 0.65) doubleTapSeek(1);
        else togglePlay();
        return;
      }
      lastTap = now; lastTapX = e.clientX;
      tapTimer = setTimeout(() => {
        if (uiVisible) togglePlay();   // Steuerung sichtbar: Tippen = Play/Pause
        else showUI();                 // Steuerung versteckt: Tippen blendet sie ein
      }, 300);
    };

    layer.addEventListener('pointerdown', (e) => {
      closeMenu();
      if (e.pointerType === 'mouse') return;       // Maus läuft über click/dblclick
      if (g) { clearTimeout(g.lp); g = null; }      // hängende Geste verwerfen
      g = {
        id: e.pointerId, x: e.clientX, y: e.clientY, mode: null, long: false,
        startTime: video.currentTime, startVol: video.volume, target: video.currentTime,
        lp: setTimeout(() => {
          if (g && !g.mode && !video.paused) {
            g.long = true;
            video.playbackRate = 2;
            setUI(false);                       // Steuerung ausblenden, nur kleines Badge oben
            clearTimeout(hideTimer);
            badge.style.opacity = '1';
            if (navigator.vibrate) navigator.vibrate(15);
          }
        }, 450)
      };
      layer.setPointerCapture(e.pointerId);
    });

    layer.addEventListener('pointermove', (e) => {
      if (!g || e.pointerId !== g.id || g.long) return;
      const dx = e.clientX - g.x, dy = e.clientY - g.y;
      if (!g.mode && (Math.abs(dx) > 12 || Math.abs(dy) > 12)) {
        clearTimeout(g.lp);
        g.mode = Math.abs(dx) > Math.abs(dy) ? 'seek' : 'vol';
        clearTimeout(tapTimer);
      }
      const r = layer.getBoundingClientRect();
      if (g.mode === 'seek' && dur()) {
        const range = Math.min(dur(), 120);       // volle Breite = max. 2 Minuten
        g.target = clamp(g.startTime + (dx / r.width) * range, 0, dur());
        const delta = g.target - g.startTime;
        showIndicator(`${fmt(g.target)}  (${delta >= 0 ? '+' : '−'}${Math.round(Math.abs(delta))}s)`, true);
      } else if (g.mode === 'vol') {
        setVolume(g.startVol - (dy / r.height) * 1.2);
      }
    });

    const endGesture = (e, cancelled) => {
      if (!g || e.pointerId !== g.id) return;
      clearTimeout(g.lp);
      const s = g;
      g = null;
      lastTouchEnd = performance.now();
      if (s.long) {
        video.playbackRate = speed;
        badge.style.opacity = '0';
      } else if (s.mode === 'seek') {
        if (!cancelled) seekTo(s.target);
        hideIndicator();
      } else if (s.mode === 'vol') {
        hideIndicator();
      } else if (!cancelled) {
        handleTap(e);
      }
    };
    layer.addEventListener('pointerup', (e) => endGesture(e, false));
    layer.addEventListener('pointercancel', (e) => endGesture(e, true));
    layer.addEventListener('lostpointercapture', (e) => endGesture(e, true));
    layer.addEventListener('contextmenu', (e) => e.preventDefault());

    layer.addEventListener('click', () => {
      if (performance.now() - lastTouchEnd < 600) return;   // Touch-Nachklick ignorieren
      togglePlay();
    });
    layer.addEventListener('dblclick', () => {
      if (performance.now() - lastTouchEnd < 600) return;
      toggleFullscreen();
    });
    overlay.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') showUI(); });

    // Buttons
    playBtn.addEventListener('click', togglePlay);
    centerPlay.addEventListener('click', togglePlay);
    backBtn.addEventListener('click', () => { seekBy(-10); showIndicator('« 10s'); });
    fwdBtn.addEventListener('click', () => { seekBy(10); showIndicator('10s »'); });
    centerBtn.addEventListener('pointerup', scheduleHide);
    prevBtn.addEventListener('click', () => stepFrame(-1));
    nextBtn.addEventListener('click', () => stepFrame(1));
    muteBtn.addEventListener('click', toggleMute);
    fsBtn.addEventListener('click', toggleFullscreen);
    // Bedienung der Leiste hält sie sichtbar
    bar.addEventListener('pointerdown', () => { clearTimeout(hideTimer); });
    centerBtn.addEventListener('pointerdown', () => { clearTimeout(hideTimer); });
    bar.addEventListener('pointerup', scheduleHide);

    // -------------------------------------------------------------------
    // Tastatur
    // -------------------------------------------------------------------
    const handleKeyDown = (e) => {
      const tag = document.activeElement && document.activeElement.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      let handled = true;
      switch (e.key) {
        case ' ': case 'k': case 'K': togglePlay(); break;
        case 'f': case 'F': toggleFullscreen(); break;
        case 'm': case 'M': toggleMute(); break;
        case 'ArrowLeft': seekBy(-5); showIndicator('« 5s'); break;
        case 'ArrowRight': seekBy(5); showIndicator('5s »'); break;
        case 'j': case 'J': seekBy(-10); showIndicator('« 10s'); break;
        case 'l': case 'L': seekBy(10); showIndicator('10s »'); break;
        case 'ArrowUp': setVolume(video.volume + 0.05); break;
        case 'ArrowDown': setVolume(video.volume - 0.05); break;
        case ',': case '<': stepFrame(-1); break;
        case '.': case '>': stepFrame(1); break;
        case 'Home': seekTo(0); break;
        case 'Escape': if (!document.fullscreenElement) closePlayer(); else handled = false; break;
        default: handled = false;
      }
      if (handled) { e.preventDefault(); e.stopPropagation(); showUI(); }
    };
    document.addEventListener('keydown', handleKeyDown, true);

    // -------------------------------------------------------------------
    // Schließen (auch per Android-Zurück-Taste)
    // -------------------------------------------------------------------
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    let closed = false;
    const onPop = () => closePlayer(true);
    function closePlayer(silent) {
      if (closed) return;
      closed = true;
      cancelAnimationFrame(raf);
      clearTimeout(hideTimer); clearTimeout(tapTimer); clearTimeout(indTimer); clearTimeout(accumTimer);
      if (g) clearTimeout(g.lp);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('fullscreenchange', onFsChange);
      window.removeEventListener('popstate', onPop);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      try { if (screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (_) {}
      video.pause();
      video.removeAttribute('src');
      video.load();                                 // Download/Stream wirklich beenden
      overlay.remove();
      document.documentElement.style.overflow = prevOverflow;
      if (silent !== true && history.state && history.state.betterMebis) history.back();
    }
    closeBtn.addEventListener('click', () => closePlayer());
    overlay._cleanup = closePlayer;

    try { history.pushState({ betterMebis: 1 }, ''); } catch (_) {}
    window.addEventListener('popstate', onPop);

    document.body.appendChild(overlay);
    video.play().catch(() => {});
    syncPlayState();
    showUI();
  }
function openCenteredVideoPlayerOld(videoUrl) {
  // 1. Existierenden Player aufräumen
  const existingPlayer = document.getElementById('mini-video-overlay');
  if (existingPlayer) {
    if (existingPlayer._cleanup) existingPlayer._cleanup();
    existingPlayer.remove();
  }

  // 2. Haupt-Overlay Container
  const overlay = document.createElement('div');
  overlay.id = 'mini-video-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '20px', left: '20px', right: '20px', bottom: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
    borderRadius: '12px',
    overflow: 'hidden',
    zIndex: '999999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  });

  // 3. Player Wrapper
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'relative',
    width: '100%', height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  // 4. Video Element
  const video = document.createElement('video');
  video.src = videoUrl;
  video.controls = false;
  video.autoplay = true;
  Object.assign(video.style, {
    maxWidth: '100%', maxHeight: '100%',
    width: 'auto', height: 'auto',
    outline: 'none', cursor: 'pointer'
  });

  // 5. Overlay Feedback (z.B. Play/Pause, +5s, Frame-Step, Speed)
  const indicator = document.createElement('div');
  Object.assign(indicator.style, {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    padding: '16px 28px',
    borderRadius: '32px',
    fontSize: '24px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    opacity: '0',
    transition: 'opacity 0.2s ease',
    zIndex: '20'
  });
  let indicatorTimeout;
  const showIndicator = (text) => {
    indicator.innerText = text;
    indicator.style.opacity = '1';
    clearTimeout(indicatorTimeout);
    indicatorTimeout = setTimeout(() => {
      indicator.style.opacity = '0';
    }, 600);
  };

  // 6. Schließen-Button (Oben Rechts)
  const closeBtn = document.createElement('button');
  closeBtn.innerText = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute', top: '15px', right: '15px',
    background: 'rgba(255, 255, 255, 0.2)', color: '#fff',
    border: 'none', borderRadius: '50%',
    width: '36px', height: '36px', cursor: 'pointer',
    fontSize: '16px', fontWeight: 'bold', zIndex: '30'
  });

  // 7. Custom Controls Bar unten
  const controlsBar = document.createElement('div');
  Object.assign(controlsBar.style, {
    position: 'absolute', bottom: '0', left: '0', right: '0',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
    padding: '12px 20px',
    display: 'flex', flexDirection: 'column', gap: '8px',
    zIndex: '30'
  });

  // Fortschrittsbalken
  const progressContainer = document.createElement('input');
  progressContainer.type = 'range';
  progressContainer.min = '0';
  progressContainer.max = '100';
  progressContainer.value = '0';
  Object.assign(progressContainer.style, {
    width: '100%', cursor: 'pointer', accentColor: '#ff0000'
  });

  // Untere Button-Zeile
  const buttonsRow = document.createElement('div');
  Object.assign(buttonsRow.style, {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  });

  const leftControls = document.createElement('div');
  Object.assign(leftControls.style, { display: 'flex', alignItems: 'center', gap: '12px' });

  // Play / Pause Button
  const playBtn = document.createElement('button');
  playBtn.innerText = '►';
  Object.assign(playBtn.style, {
    background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer'
  });

  // Zeit-Anzeige
  const timeDisplay = document.createElement('span');
  timeDisplay.innerText = '0:00 / 0:00';
  timeDisplay.style.color = '#ccc';
  timeDisplay.style.fontSize = '13px';

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Frame Stepping Buttons
  const createControlBtn = (text, title, onClick) => {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.title = title;
    Object.assign(btn.style, {
      background: 'rgba(255,255,255,0.15)', color: '#fff',
      border: 'none', borderRadius: '4px', padding: '4px 8px',
      fontSize: '12px', cursor: 'pointer'
    });
    btn.onclick = onClick;
    return btn;
  };

  const prevFrameBtn = createControlBtn('‹ Frame', '1 Frame zurück (,)', () => stepFrame(-1));
  const nextFrameBtn = createControlBtn('Frame ›', '1 Frame vor (.)', () => stepFrame(1));

  leftControls.appendChild(playBtn);
  leftControls.appendChild(prevFrameBtn);
  leftControls.appendChild(nextFrameBtn);
  leftControls.appendChild(timeDisplay);

  const rightControls = document.createElement('div');
  Object.assign(rightControls.style, { display: 'flex', alignItems: 'center', gap: '12px' });

  // Geschwindigkeits-Regler
  const speedContainer = document.createElement('div');
  Object.assign(speedContainer.style, {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.15)',
    padding: '4px 10px',
    borderRadius: '6px'
  });

  const speedLabel = document.createElement('span');
  speedLabel.innerText = '1x';
  Object.assign(speedLabel.style, {
    color: '#fff',
    fontSize: '12px',
    minWidth: '32px',
    textAlign: 'center',
    userSelect: 'none'
  });

  const speedSlider = document.createElement('input');
  speedSlider.type = 'range';
  speedSlider.min = '0.25';
  speedSlider.max = '2.5';
  speedSlider.step = '0.25';
  speedSlider.value = '1';
  Object.assign(speedSlider.style, {
    width: '80px',
    cursor: 'pointer',
    accentColor: '#ff0000'
  });

  const setSpeed = (newSpeed) => {
    const clamped = Math.min(2.5, Math.max(0.25, Math.round(newSpeed * 100) / 100));
    video.playbackRate = clamped;
    speedSlider.value = clamped;
    speedLabel.innerText = `${clamped}x`;
    showIndicator(`Tempo: ${clamped}x`);
  };

  speedSlider.oninput = (e) => {
    setSpeed(parseFloat(e.target.value));
  };

  speedContainer.appendChild(speedSlider);
  speedContainer.appendChild(speedLabel);

  // Vollbild Button (Fullscreen)
  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.innerText = '⛶';
  fullscreenBtn.title = 'Vollbild (F)';
  Object.assign(fullscreenBtn.style, {
    background: 'rgba(255,255,255,0.15)', color: '#fff',
    border: 'none', borderRadius: '4px', padding: '4px 8px',
    fontSize: '14px', cursor: 'pointer'
  });

  rightControls.appendChild(speedContainer);
  rightControls.appendChild(fullscreenBtn);

  // 8. Logik & Steuerung
  const togglePlay = () => {
    if (video.paused) {
      video.play();
      playBtn.innerText = '❚❚';
      showIndicator('►');
    } else {
      video.pause();
      playBtn.innerText = '►';
      showIndicator('❚❚');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      overlay.requestFullscreen().catch(err => {
        console.error(`Fehler beim Aktivieren von Vollbild: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const FPS = 30; // Standard 30fps
  const stepFrame = (direction) => {
    video.pause();
    playBtn.innerText = '►';
    const frameTime = 1 / FPS;
    video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + (direction * frameTime)));
    showIndicator(direction > 0 ? '› 1 Frame' : '‹ 1 Frame');
  };

  const seekRelative = (seconds) => {
    video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + seconds));
    showIndicator(seconds > 0 ? `+${seconds}s »` : `« ${Math.abs(seconds)}s`);
  };

  // Klick- & Doppel-Klick-Logik auf dem Video (Zone-basiert)
  let clickTimeout = null;
  video.onclick = (e) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;

      const rect = video.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const ratio = clickX / rect.width;

      if (ratio < 0.35) {
        seekRelative(-5);
      } else if (ratio > 0.65) {
        seekRelative(5);
      } else {
        togglePlay();
      }
    } else {
      clickTimeout = setTimeout(() => {
        clickTimeout = null;
        togglePlay();
      }, 250);
    }
  };

  playBtn.onclick = togglePlay;
  fullscreenBtn.onclick = toggleFullscreen;

  video.ontimeupdate = () => {
    if (!isNaN(video.duration)) {
      progressContainer.value = (video.currentTime / video.duration) * 100;
      timeDisplay.innerText = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    }
  };

  progressContainer.oninput = (e) => {
    if (!isNaN(video.duration)) {
      video.currentTime = (e.target.value / 100) * video.duration;
    }
  };

  // Globales Keyboard Handling
  const handleKeyDown = (e) => {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;
      case 'f':
      case 'F':
        e.preventDefault();
        toggleFullscreen();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        seekRelative(-5);
        break;
      case 'ArrowRight':
        e.preventDefault();
        seekRelative(5);
        break;
      case ',':
      case '<':
        e.preventDefault();
        stepFrame(-1);
        break;
      case '.':
      case '>':
        e.preventDefault();
        stepFrame(1);
        break;
      case '[':
        e.preventDefault();
        setSpeed(video.playbackRate - 0.25);
        break;
      case ']':
        e.preventDefault();
        setSpeed(video.playbackRate + 0.25);
        break;
      case 'Escape':
        if (!document.fullscreenElement) {
          closePlayer();
        }
        break;
    }
  };

  const closePlayer = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    document.removeEventListener('keydown', handleKeyDown);
    overlay.remove();
  };

  closeBtn.onclick = closePlayer;
  overlay._cleanup = closePlayer;
  document.addEventListener('keydown', handleKeyDown);

  // 9. Komponenten zusammenbauen
  buttonsRow.appendChild(leftControls);
  buttonsRow.appendChild(rightControls);
  controlsBar.appendChild(progressContainer);
  controlsBar.appendChild(buttonsRow);

  wrapper.appendChild(video);
  wrapper.appendChild(indicator);
  wrapper.appendChild(closeBtn);
  wrapper.appendChild(controlsBar);
  overlay.appendChild(wrapper);

  document.body.appendChild(overlay);
}
function addCopyHtmlButton() {
  if (document.getElementById('quick-copy-html-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'quick-copy-html-btn';
  btn.innerText = 'HTML';
  btn.title = 'HTML der aktuellen Seite kopieren';

  Object.assign(btn.style, {
    position: 'fixed',
    bottom: '6px',
    right: '6px',
    zIndex: '99998',
    padding: '2px 5px',
    fontSize: '10px',
    fontFamily: 'monospace',
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '3px',
    cursor: 'pointer',
    opacity: '0.4',
    transition: 'opacity 0.15s ease, background-color 0.15s ease',
    userSelect: 'none',
    lineHeight: '1'
  });

  btn.onmouseenter = () => {
    btn.style.opacity = '1';
    btn.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  };
  btn.onmouseleave = () => {
    btn.style.opacity = '0.4';
    btn.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
  };

  btn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(document.documentElement.outerHTML);
      btn.innerText = '✓';
      btn.style.backgroundColor = '#1b7a3e';
      btn.style.opacity = '1';

      setTimeout(() => {
        btn.innerText = 'HTML';
        btn.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
        btn.style.opacity = '0.4';
      }, 1200);
    } catch (err) {
      console.error('Fehler beim Kopieren des HTMLs:', err);
      btn.innerText = '✗';
      setTimeout(() => {
        btn.innerText = 'HTML';
      }, 1200);
    }
  };

  document.body.appendChild(btn);
}
// -----------------------------------------------------------------------
// FORUM-POSTS ALS PDF SPEICHERN
// -----------------------------------------------------------------------
function printForumPostAsPdf(postElement) {
  const subjectEl = postElement.querySelector('[data-region-content="forum-post-core-subject"]');
  const subject = subjectEl ? subjectEl.innerText.trim() : 'Forum-Beitrag';

  // Autor & Datum auslesen
  const headerEl = postElement.querySelector('header');
  let metaHtml = '';
  if (headerEl) {
    const metaContainer = headerEl.querySelector('.d-flex.flex-column > div');
    if (metaContainer) {
      metaHtml = metaContainer.innerHTML;
    }
  }

  // Beitragsinhalt finden (ignoriert die Aktionen/Buttons)
  const contentEl = postElement.querySelector('[id^="post-content-"]') || postElement.querySelector('.post-content-container');
  if (!contentEl) {
    alert('Beitragsinhalt konnte nicht gefunden werden.');
    return;
  }

  // Unsichtbaren iFrame für den Druck erstellen
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0'
  });
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="utf-8">
      <title>${subject.replace(/[<>"]/g, '')}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm 20mm 15mm;
        }
        body {
          font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #212529;
          margin: 0;
          padding: 0;
        }
        .pdf-header {
          border-bottom: 2px solid #005691;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .pdf-title {
          font-size: 18pt;
          font-weight: bold;
          margin: 0 0 6px 0;
          color: #003366;
        }
        .pdf-meta {
          font-size: 9.5pt;
          color: #666;
        }
        .pdf-content {
          width: 100%;
        }
        h1 { font-size: 15pt; margin-top: 20px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
        h2 { font-size: 13pt; margin-top: 16px; }
        h3 { font-size: 11.5pt; margin-top: 12px; }
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 14px 0;
          page-break-inside: auto;
        }
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        th, td {
          border: 1px solid #bbb;
          padding: 6px 10px;
          text-align: left;
          vertical-align: top;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        a {
          color: #005691;
          text-decoration: underline;
        }
        hr {
          border: 0;
          border-top: 1px solid #ddd;
          margin: 16px 0;
        }
      </style>
    </head>
    <body>
      <div class="pdf-header">
        <h1 class="pdf-title">${subject}</h1>
        <div class="pdf-meta">${metaHtml}</div>
      </div>
      <div class="pdf-content">
        ${contentEl.innerHTML}
      </div>
    </body>
    </html>
  `);
  doc.close();

  // Warten bis der Inhalt geladen ist, dann Druckdialog öffnen
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove(), 2000);
  }, 350);
}

function addPdfButtonsToForumPosts() {
  const actionBars = document.querySelectorAll('[data-region="post-actions-container"]');

  actionBars.forEach(bar => {
    if (bar.querySelector('.mbs-pdf-export-btn')) return;

    const postContainer = bar.closest('article.forum-post-container') || bar.closest('[data-region="post"]');
    if (!postContainer) return;

    const pdfBtn = document.createElement('a');
    pdfBtn.className = 'btn btn-link mbs-pdf-export-btn';
    pdfBtn.href = '#';
    pdfBtn.role = 'menuitem';
    pdfBtn.tabIndex = 0;
    pdfBtn.title = 'Diesen Beitrag als PDF speichern';
    pdfBtn.innerText = 'PDF';

    pdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      printForumPostAsPdf(postContainer);
    });

    // Neben Dauerlink / Antworten einhängen
    bar.appendChild(pdfBtn);
  });
}
function openForumPostInNewTab(postElement) {
  const subjectEl = postElement.querySelector('[data-region-content="forum-post-core-subject"]');
  const subject = subjectEl ? subjectEl.innerText.trim() : 'Forum-Beitrag';

  const headerEl = postElement.querySelector('header');
  let metaHtml = '';
  if (headerEl) {
    const metaContainer = headerEl.querySelector('.d-flex.flex-column > div');
    if (metaContainer) {
      metaHtml = metaContainer.innerHTML;
    }
  }

  const contentEl = postElement.querySelector('[id^="post-content-"]') || postElement.querySelector('.post-content-container');
  if (!contentEl) {
    alert('Beitragsinhalt konnte nicht gefunden werden.');
    return;
  }

  const pageHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>${subject.replace(/[<>"']/g, '')}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #212529;
      max-width: 820px;
      margin: 24px auto;
      padding: 0 20px;
      background: #fff;
    }
    .post-header {
      border-bottom: 2px solid #005691;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .post-title {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 6px 0;
      color: #003366;
    }
    .post-meta {
      font-size: 10pt;
      color: #555;
    }
    .post-meta a {
      color: inherit;
      text-decoration: none;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 14px 0;
    }
    th, td {
      border: 1px solid #bbb;
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #005691;
    }
    @media print {
      body {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="post-header">
    <h1 class="post-title">${subject}</h1>
    <div class="post-meta">${metaHtml}</div>
  </div>
  <div class="post-content">
    ${contentEl.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([pageHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

function addPdfNTabButtonsToForumPosts() {
  const actionBars = document.querySelectorAll('[data-region="post-actions-container"]');

  actionBars.forEach(bar => {
    if (bar.querySelector('.mbs-pdf-export-btn')) return;

    const postContainer = bar.closest('article.forum-post-container') || bar.closest('[data-region="post"]');
    if (!postContainer) return;

    const pdfBtn = document.createElement('a');
    pdfBtn.className = 'btn btn-link mbs-pdf-export-btn';
    pdfBtn.href = '#';
    pdfBtn.role = 'menuitem';
    pdfBtn.tabIndex = 0;
    pdfBtn.title = 'Diesen Beitrag in einem neuen Tab öffnen';
    pdfBtn.innerText = 'PDF';

    pdfBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openForumPostInNewTab(postContainer);
    });

    bar.appendChild(pdfBtn);
  });
}
// -----------------------------------------------------------------------
// KURSSEITE ALS REINE HTML-ANSICHT IM NEUEN TAB ÖFFNEN
// -----------------------------------------------------------------------
function openCoursePageInNewTab() {
  // 1. Titel ermitteln
  const headingEl = document.querySelector('.page-header-headings h1') || document.querySelector('header h1') || document.querySelector('h1');
  const subject = headingEl ? headingEl.innerText.trim() : document.title.split('|')[0].trim();

  // 2. Breadcrumbs / Kurs-Hierarchie als Metadaten auslesen
  const breadcrumbEl = document.querySelector('#page-navbar .breadcrumb');
  let metaHtml = '';
  if (breadcrumbEl) {
    const crumbs = Array.from(breadcrumbEl.querySelectorAll('.breadcrumb-item'))
      .map(item => item.innerText.trim())
      .filter(Boolean);
    if (crumbs.length > 0) {
      metaHtml = crumbs.join(' &rsaquo; ');
    }
  }

  // 3. Den eigentlichen Inhaltsblock finden
  const contentBox = document.querySelector('div[role="main"] .generalbox') ||
                     document.querySelector('div[role="main"] .no-overflow') ||
                     document.querySelector('div[role="main"]');

  if (!contentBox) {
    alert('Der Inhalt der Kursseite konnte nicht gefunden werden.');
    return;
  }

  // Kopie erstellen und störende Script-Tags / Konfigurationen entfernen
  const clone = contentBox.cloneNode(true);
  clone.querySelectorAll('script, style, #mbseasyforms_config').forEach(el => el.remove());

  // 4. Sauberes HTML für den neuen Tab zusammenstellen
  const pageHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <title>${subject.replace(/[<>"']/g, '')}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 20mm 15mm;
    }
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #212529;
      max-width: 860px;
      margin: 24px auto;
      padding: 0 20px;
      background: #fff;
    }
    .page-header {
      border-bottom: 2px solid #005691;
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .page-title {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 6px 0;
      color: #003366;
    }
    .page-meta {
      font-size: 9.5pt;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #bbb;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }
    th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    p {
      margin: 0 0 10px 0;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    a {
      color: #005691;
    }
    @media print {
      body {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      tr {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page-header">
    <h1 class="page-title">${subject}</h1>
    ${metaHtml ? `<div class="page-meta">${metaHtml}</div>` : ''}
  </div>
  <div class="page-content">
    ${clone.innerHTML}
  </div>
</body>
</html>`;

  // 5. Als Blob in neuem Tab öffnen
  const blob = new Blob([pageHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

// -----------------------------------------------------------------------
// BUTTON IN DIE KURSSEITE EINFÜGEN
// -----------------------------------------------------------------------
function addCoursePageOpenButton() {
  if (document.getElementById('mbs-course-page-export-btn')) return;

  // Prüfen, ob wir auf einer Inhaltsseite mit Inhaltsbox sind
  const hasContent = document.querySelector('div[role="main"] .generalbox') ||
                     document.querySelector('body.path-mod-page div[role="main"]');
  if (!hasContent) return;

  // Header-Aktionsbereich suchen (neben "Als erledigt kennzeichnen")
  const actionContainer = document.querySelector('[data-region="header-actions-container"]');
  if (!actionContainer) return;

  const wrap = document.createElement('div');
  wrap.className = 'header-action ms-2';

  const btn = document.createElement('button');
  btn.id = 'mbs-course-page-export-btn';
  btn.className = 'btn btn-subtle-body btn-sm text-nowrap';
  btn.title = 'Nur diesen Inhalt in einem neuen Tab öffnen / drucken';
  btn.innerText = '📄 In neuem Tab';

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCoursePageInNewTab();
  });

  wrap.appendChild(btn);
  actionContainer.appendChild(wrap);
}

function onInitHtml(){
    addCopyHtmlButton();
    addCoursePageOpenButton();
}
// -----------------------------------------------------------------------
// ALLE 100ms NACH .MP4-LINKS SUCHEN UND MIT DEM PLAYER VERKNÜPFEN
// -----------------------------------------------------------------------
setInterval(() => {
  // Sucht alle Link-Elemente (a), deren href mit .mp4 endet (auch mit Query-Parametern)
  const mp4Links = document.querySelectorAll('a[href*=".mp4"]');

  mp4Links.forEach(link => {
    // Nur unberührte Links anpassen
    if (!link.dataset.customPlayerBound) {
      link.dataset.customPlayerBound = 'true';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCenteredVideoPlayer(link.href);
      });
    }
  });
  addPdfNTabButtonsToForumPosts();
    addCoursePageOpenButton();
}, 100);
// alert("Better Mebis wurde geladen");
if (document.body) {
  onInitHtml();
} else {
  window.addEventListener('DOMContentLoaded', onInitHtml());
}

})();
