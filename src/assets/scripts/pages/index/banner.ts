const canvas = document.getElementById('iconCanvas') as HTMLCanvasElement;

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width: number, height: number;
    let mouse = { x: -1000, y: -1000 };

    // Lista de símbolos de ferramentas (Unicode / Fontes de Ícones)
    const icons = ['🛠️', '⚙️', '🔍', '💻', '⚡', '📐', '🔧', '📦', '🚀', '🎨', '🔒', '📊', '🕘'];

    interface IconParticle {
      x: number;
      y: number;
      char: string;
      size: number;
      vx: number;
      vy: number;
      baseAlpha: number;
      currentAlpha: number;
    }

    let particles: IconParticle[] = [];

    function resize() {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initParticles();
    }

    function initParticles() {
      particles = [];
      const count = Math.floor((width * height) / 18000); // Densidade adaptativa
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          char: icons[Math.floor(Math.random() * icons.length)],
          size: Math.random() * 12 + 18, // Tamanho dos ícones
          vx: (Math.random() - 0.5) * 0.6, // Velocidade horizontal
          vy: (Math.random() - 0.5) * 0.6, // Velocidade vertical
          baseAlpha: Math.random() * 0.2 + 0.1, // Opacidade baixa de fundo
          currentAlpha: 0.1
        });
      }
    }

    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    resize();

    function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, width, height);

  const fadeZone = 80; // Distância em pixels das bordas onde começa a esvanecer

  particles.forEach((p) => {
    // Movimento
    p.x += p.vx;
    p.y += p.vy;

    // Rebatimento
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    // --- CÁLCULO DE FADE NAS BORDAS ---
    // Calcula o quão perto está da borda esquerda, direita, topo e base
    const distLeft = p.x;
    const distRight = width - p.x;
    const distTop = p.y;
    const distBottom = height - p.y;

    // Pega a menor distância de qualquer uma das 4 bordas
    const minDist = Math.min(distLeft, distRight, distTop, distBottom);

    // Fator de transparência baseado nas bordas (1 no centro, 0 colado na borda)
    let borderAlphaFactor = 1;
    if (minDist < fadeZone) {
      borderAlphaFactor = minDist / fadeZone;
    }

    // Interação com o Mouse
    const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    const maxDistMouse = 150;

    if (distMouse < maxDistMouse) {
      p.currentAlpha = Math.min(0.9, p.baseAlpha + (1 - distMouse / maxDistMouse) * 0.7);
      ctx.shadowColor = '#60a5fa';
      ctx.shadowBlur = 12;
    } else {
      p.currentAlpha += (p.baseAlpha - p.currentAlpha) * 0.05;
      ctx.shadowBlur = 0;
    }

    // Aplica a transparência final multiplicando pelo fator da borda
    const finalAlpha = Math.max(0, p.currentAlpha * borderAlphaFactor);

    ctx.font = `${p.size}px sans-serif`;
    ctx.fillStyle = `rgba(148, 163, 184, ${finalAlpha})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.char, p.x, p.y);
  });

  requestAnimationFrame(draw);
}

    draw();
  }