document.addEventListener("DOMContentLoaded", () => {

  // =================================
  // BACKGROUND MUSIC
  // =================================

  const music = document.getElementById("bgMusic");
  const beginButton = document.getElementById("beginSurpriseButton");

  if (music) {
    music.loop = true;
    music.volume = 0.7;
  }

  if (music && beginButton) {
    beginButton.addEventListener("click", () => {
      if (music.paused) {
        music.play().catch(error => {
          console.error("Music could not play:", error);
        });
      }
    });
  }


  // =================================
  // PAGE NAVIGATION
  // =================================

  const pages = document.querySelectorAll(".page");
  const heartContainer = document.getElementById("floatingHearts");

  function restartAnimation(elements) {
    elements.forEach(element => {
      element.style.animation = "none";
      void element.offsetWidth;
      element.style.animation = "";
    });
  }

  function openPage(pageId) {
    const target = document.getElementById(pageId);

    if (!target) {
      console.error("Page not found:", pageId);
      return;
    }

    pages.forEach(page => page.classList.remove("active"));
    target.classList.add("active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    if (heartContainer) {
      heartContainer.style.opacity =
        (pageId === "home" || pageId === "final") ? "1" : "0";
    }

    // Replay rockets on celebration page
    if (pageId === "celebration") {
      const rockets = document.querySelectorAll(
        "#rocketScene .rocket"
      );

      restartAnimation(rockets);
    }

    // Replay rose on surprise page
    if (pageId === "surprise") {
      const rose = document.querySelectorAll(
        "#flowerScene .rose"
      );

      restartAnimation(rose);
    }

    // Fireworks on final page
    if (pageId === "final") {
      startFireworks();
    } else {
      stopFireworks();
    }
  }

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      openPage(button.dataset.go);
    });
  });


  // =================================
  // SUBTLE FLOATING HEARTS
  // =================================

  if (heartContainer) {
    const symbols = ["♥", "♡", "✦"];

    for (let i = 0; i < 9; i++) {
      const heart = document.createElement("span");

      heart.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      heart.style.left = Math.random() * 100 + "%";

      heart.style.animationDuration =
        (10 + Math.random() * 9) + "s";

      heart.style.animationDelay =
        (Math.random() * 10) + "s";

      heart.style.fontSize =
        (11 + Math.random() * 9) + "px";

      heartContainer.appendChild(heart);
    }
  }


  // =================================
  // FIREWORKS
  // =================================

  const canvas = document.getElementById("fireworks");
  const ctx = canvas ? canvas.getContext("2d") : null;

  let particles = [];
  let animationRunning = false;
  let fireworksUntil = 0;
  let animationFrame = null;

  function resizeCanvas() {
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  if (canvas && ctx) {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  }

  function createFirework(x, y) {
    if (!ctx) return;

    const colors = [
      "#ffd166",
      "#ff7b9c",
      "#ffffff",
      "#d9a7ff",
      "#ff9f43"
    ];

    const color =
      colors[Math.floor(Math.random() * colors.length)];

    const count = 55;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 1 + Math.random() * 4;

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        radius: 1 + Math.random() * 2,
        color,
        gravity: 0.035
      });
    }
  }

  function animateFireworks() {
    if (!ctx) return;

    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    particles = particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.alpha -= 0.012;

      if (particle.alpha <= 0) return false;

      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 12;
      ctx.shadowColor = particle.color;

      ctx.beginPath();
      ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
      );

      ctx.fill();

      return true;
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (Date.now() < fireworksUntil) {
      if (Math.random() < 0.08) {
        createFirework(
          40 + Math.random() * (window.innerWidth - 80),
          50 + Math.random() * (window.innerHeight * 0.55)
        );
      }
    }

    if (particles.length > 0 || Date.now() < fireworksUntil) {
      animationFrame = requestAnimationFrame(animateFireworks);
    } else {
      animationRunning = false;
      animationFrame = null;

      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );
    }
  }

  function startFireworks() {
    if (!ctx) return;

    fireworksUntil = Date.now() + 5000;

    createFirework(
      window.innerWidth * 0.3,
      window.innerHeight * 0.3
    );

    createFirework(
      window.innerWidth * 0.7,
      window.innerHeight * 0.25
    );

    if (!animationRunning) {
      animationRunning = true;
      animateFireworks();
    }
  }

  function stopFireworks() {
    fireworksUntil = 0;
    particles = [];

    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    animationRunning = false;

    if (ctx && canvas) {
      ctx.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
      );
    }
  }


  // =================================
  // CELEBRATE AGAIN BUTTON
  // =================================

  const fireworkButton =
    document.getElementById("fireworkButton");

  if (fireworkButton) {
    fireworkButton.addEventListener("click", startFireworks);
  }


  // =================================
  // START WEBSITE
  // =================================

  openPage("home");

});
