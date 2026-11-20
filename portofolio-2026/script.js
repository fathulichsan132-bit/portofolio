document.addEventListener("DOMContentLoaded", () => {
  const slots = document.querySelectorAll(".photo-slot");
  const zoomableCards = document.querySelectorAll(".zoomable-card");

  // Modal & Tombol Kontrol
  const optionsModal = document.getElementById("optionsModal");
  const exitModal = document.getElementById("exitModal");
  const lightboxModal = document.getElementById("lightboxModal");
  const goodbyeScreen = document.getElementById("goodbyeScreen");

  const btnStart = document.getElementById("btnStart");
  const btnOptions = document.getElementById("btnOptions");
  const btnExit = document.getElementById("btnExit");

  const toggleSfx = document.getElementById("toggleSfx");
  const confirmExitBtn = document.getElementById("confirmExitBtn");
  const restartPortfolioBtn = document.getElementById("restartPortfolioBtn");

  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTitle = document.getElementById("lightboxTitle");

  let sfxEnabled = true;

  // Efek suara klik ringan (Web Audio API, tanpa file MP3 tambahan)
  function playClickSound(freq = 560) {
    if (!sfxEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (_) {
      // Abaikan jika browser memblokir audio konteks
    }
  }

  // ==================== TOMBOL MENU UTAMA (START, OPTIONS, EXIT) ====================
  if (btnStart) {
    btnStart.addEventListener("click", () => {
      playClickSound(680);
      document.getElementById("profil")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (btnOptions) {
    btnOptions.addEventListener("click", () => {
      playClickSound(540);
      optionsModal?.classList.remove("hidden");
    });
  }

  if (btnExit) {
    btnExit.addEventListener("click", () => {
      playClickSound(420);
      exitModal?.classList.remove("hidden");
    });
  }

  // Pengaturan di dalam OPTIONS
  if (toggleSfx) {
    toggleSfx.addEventListener("change", (e) => {
      sfxEnabled = e.target.checked;
      if (sfxEnabled) playClickSound(720);
    });
  }

  // ==================== TEMA WARNA & SUASANA ====================
  const THEME_DATA = {
    cyan: { name: "CYAN NAVY", drop: "186, 230, 253", bolt: "224, 242, 254", glow: "56, 189, 248" },
    crimson: { name: "CRIMSON DARK", drop: "254, 205, 211", bolt: "255, 228, 230", glow: "244, 63, 94" },
    emerald: { name: "EMERALD MATRIX", drop: "167, 243, 208", bolt: "209, 250, 229", glow: "16, 185, 129" },
    purple: { name: "PURPLE NEBULA", drop: "233, 213, 255", bolt: "243, 232, 255", glow: "168, 85, 247" },
    amber: { name: "AMBER GOLD", drop: "254, 240, 138", bolt: "254, 249, 195", glow: "245, 158, 11" },
  };

  const themeSwatches = document.querySelectorAll(".theme-swatch");
  const currentThemeName = document.getElementById("currentThemeName");
  let currentTheme = localStorage.getItem("portfolio_theme") || "cyan";

  function applyTheme(themeKey, playSound = false) {
    if (!THEME_DATA[themeKey]) themeKey = "cyan";
    currentTheme = themeKey;

    // Bersihkan kelas tema lama & pasang yang baru
    Object.keys(THEME_DATA).forEach((k) => document.body.classList.remove(`theme-${k}`));
    document.body.classList.add(`theme-${themeKey}`);

    // Update active swatch
    themeSwatches.forEach((swatch) => {
      swatch.classList.toggle("active", swatch.dataset.theme === themeKey);
    });

    // Update teks nama tema
    if (currentThemeName) {
      currentThemeName.textContent = THEME_DATA[themeKey].name;
    }

    // Simpan preferensi pengguna
    try {
      localStorage.setItem("portfolio_theme", themeKey);
    } catch (_) {}

    if (playSound) playClickSound(640);
  }

  themeSwatches.forEach((swatch) => {
    swatch.addEventListener("click", () => {
      applyTheme(swatch.dataset.theme, true);
    });
  });

  // Terapkan tema tersimpan
  applyTheme(currentTheme, false);

  // Konfirmasi EXIT & Restart
  if (confirmExitBtn) {
    confirmExitBtn.addEventListener("click", () => {
      playClickSound(320);
      exitModal?.classList.add("hidden");
      goodbyeScreen?.classList.remove("hidden");
    });
  }

  if (restartPortfolioBtn) {
    restartPortfolioBtn.addEventListener("click", () => {
      playClickSound(740);
      goodbyeScreen?.classList.add("hidden");
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Tutup Modal
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => {
      playClickSound(480);
      const targetModal = document.getElementById(btn.dataset.close);
      if (targetModal) targetModal.classList.add("hidden");
    });
  });

  [optionsModal, exitModal, lightboxModal].forEach((overlay) => {
    if (!overlay) return;
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.add("hidden");
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      optionsModal?.classList.add("hidden");
      exitModal?.classList.add("hidden");
      lightboxModal?.classList.add("hidden");
    }
  });

  // ==================== INTERAKSI FOTO & LIGHTBOX ZOOM ====================
  slots.forEach((slot) => {
    const img = slot.querySelector("img");
    if (!img) return;

    img.addEventListener("error", () => {
      slot.classList.add("is-missing");
      img.style.display = "none";
    });

    img.addEventListener("load", () => {
      slot.classList.remove("is-missing");
      img.style.display = "block";
    });
  });

  zoomableCards.forEach((card) => {
    card.addEventListener("click", () => {
      const img = card.querySelector("img");
      if (!img || card.classList.contains("is-missing")) return;
      playClickSound(580);
      if (lightboxTitle) lightboxTitle.textContent = card.dataset.title || "PROJECT PREVIEW";
      if (lightboxImg) lightboxImg.src = img.src;
      lightboxModal?.classList.remove("hidden");
    });
  });

  // ==================== AUTO-HIGHLIGHT PILL NAV SAAT SCROLL ====================
  const sections = document.querySelectorAll("section[id]");
  const pillLinks = document.querySelectorAll(".pill-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          pillLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.section === id);
          });
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach((sec) => observer.observe(sec));

  // ==================== RAIN & LIGHTNING EFFECT (CANVAS) ====================
  const rainCanvas = document.getElementById("rainCanvas");
  const toggleRain = document.getElementById("toggleRain");
  let rainActive = true;
  let rainAnimationId = null;
  let lightningTimer = null;
  let flashOpacity = 0;
  let activeBolt = null;
  let boltLife = 0;

  if (rainCanvas) {
    const ctx = rainCanvas.getContext("2d");
    let width = 0;
    let height = 0;
    let drops = [];
    let splashes = [];

    function resizeRain() {
      width = rainCanvas.width = window.innerWidth;
      height = rainCanvas.height = window.innerHeight;
      initDrops();
    }

    function initDrops() {
      const dropCount = Math.floor(Math.min(width, 1920) / 9);
      drops = [];
      for (let i = 0; i < dropCount; i++) {
        drops.push({
          x: Math.random() * (width + 200) - 100,
          y: Math.random() * height,
          length: 14 + Math.random() * 20,
          speed: 12 + Math.random() * 14,
          opacity: 0.12 + Math.random() * 0.32,
          thickness: 0.8 + Math.random() * 1.1,
          wind: -1.2,
        });
      }
    }

    function createSplash(x, y) {
      if (splashes.length > 60) return;
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.PI + (Math.random() - 0.5) * Math.PI * 0.8;
        const spd = 1.5 + Math.random() * 3;
        splashes.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          radius: 0.6 + Math.random() * 0.8,
          alpha: 0.5,
          life: 1,
        });
      }
    }

    // Generator sambaran petir tipis bercabang
    function generateThinBolt(startX, startY, maxDepth = 15) {
      const branches = [];
      const mainBranch = [{ x: startX, y: startY }];
      let curX = startX;
      let curY = startY;

      for (let i = 0; i < maxDepth; i++) {
        curX += (Math.random() - 0.48) * 30;
        curY += 15 + Math.random() * 22;
        mainBranch.push({ x: curX, y: curY });

        // Cabang kecil tipis
        if (Math.random() < 0.28 && i > 2 && i < maxDepth - 3) {
          const subBranch = [{ x: curX, y: curY }];
          let subX = curX;
          let subY = curY;
          const subLen = 3 + Math.floor(Math.random() * 4);
          const subDir = Math.random() < 0.5 ? -1 : 1;
          for (let s = 0; s < subLen; s++) {
            subX += subDir * (10 + Math.random() * 16);
            subY += 12 + Math.random() * 16;
            subBranch.push({ x: subX, y: subY });
          }
          branches.push(subBranch);
        }
      }
      branches.unshift(mainBranch);
      return branches;
    }

    // Suara gemuruh petir lembut / jauh
    function playDistantThunder() {
      if (!sfxEnabled) return;
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(52, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(26, ctx.currentTime + 1.3);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.3);
      } catch (_) {}
    }

    function triggerLightning() {
      if (!rainActive) return;

      // Kilatan cahaya lembut (tipis)
      flashOpacity = 0.08 + Math.random() * 0.07;

      // Buat sambaran garis petir tipis
      const startX = width * (0.15 + Math.random() * 0.7);
      activeBolt = generateThinBolt(startX, 0, 12 + Math.floor(Math.random() * 8));
      boltLife = 4; // Aktif sebentar (~60ms)

      playDistantThunder();

      // Kedipan susulan singkat ala petir alami
      setTimeout(() => {
        if (!rainActive) return;
        flashOpacity = 0.12 + Math.random() * 0.08;
      }, 75);

      scheduleNextLightning();
    }

    function scheduleNextLightning() {
      clearTimeout(lightningTimer);
      if (!rainActive) return;
      // Interval acak antara 6 sampai 13 detik
      const delay = 6000 + Math.random() * 7000;
      lightningTimer = setTimeout(triggerLightning, delay);
    }

    function updateRain() {
      if (!rainActive) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const tColors = THEME_DATA[currentTheme] || THEME_DATA.cyan;

      // Render kilatan petir tipis di latar
      if (flashOpacity > 0.003) {
        ctx.fillStyle = `rgba(${tColors.drop}, ${flashOpacity})`;
        ctx.fillRect(0, 0, width, height);
        flashOpacity *= 0.86;
      }

      // Render sambaran petir tipis
      if (activeBolt && boltLife > 0) {
        ctx.save();
        ctx.strokeStyle = `rgba(${tColors.bolt}, ${Math.min(1, boltLife * 0.4)})`;
        ctx.lineWidth = 1.1;
        ctx.shadowColor = `rgba(${tColors.glow}, 0.8)`;
        ctx.shadowBlur = 8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (const branch of activeBolt) {
          if (branch.length < 2) continue;
          ctx.beginPath();
          ctx.moveTo(branch[0].x, branch[0].y);
          for (let b = 1; b < branch.length; b++) {
            ctx.lineTo(branch[b].x, branch[b].y);
          }
          ctx.stroke();
        }
        ctx.restore();
        boltLife--;
        if (boltLife <= 0) activeBolt = null;
      }

      // Render rintik hujan
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];

        ctx.beginPath();
        ctx.strokeStyle = `rgba(${tColors.drop}, ${d.opacity})`;
        ctx.lineWidth = d.thickness;
        ctx.lineCap = "round";
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * (d.length / 10), d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x += d.wind;

        if (d.y > height - 10 && Math.random() < 0.2) {
          createSplash(d.x, height - 4);
        }

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + 200) - 100;
        }
        if (d.x < -100) {
          d.x = width + 50;
        }
      }

      // Render cipratan hujan
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${tColors.drop}, ${s.alpha * s.life})`;
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();

        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.18;
        s.life -= 0.05;

        if (s.life <= 0) {
          splashes.splice(i, 1);
        }
      }

      rainAnimationId = requestAnimationFrame(updateRain);
    }

    window.addEventListener("resize", resizeRain);
    resizeRain();
    updateRain();
    scheduleNextLightning();

    if (toggleRain) {
      toggleRain.addEventListener("change", (e) => {
        rainActive = e.target.checked;
        if (rainActive) {
          playClickSound(660);
          cancelAnimationFrame(rainAnimationId);
          updateRain();
          scheduleNextLightning();
        } else {
          playClickSound(440);
          clearTimeout(lightningTimer);
          cancelAnimationFrame(rainAnimationId);
          flashOpacity = 0;
          activeBolt = null;
          ctx.clearRect(0, 0, width, height);
        }
      });
    }
  }
});
