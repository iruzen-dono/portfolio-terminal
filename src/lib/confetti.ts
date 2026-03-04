/* ─────────────────────────────────────────────────────
   Confetti – lightweight confetti burst utility.
   Creates CSS-animated confetti pieces in the DOM.
   ───────────────────────────────────────────────────── */

const COLORS = [
  "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff",
  "#9b59b6", "#00d4ff", "#ff8c00", "#ff79c6",
  "#50fa7b", "#f1fa8c", "#ff5555", "#bd93f9",
];

export function launchConfetti(count = 60) {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left = Math.random() * 100;
    const size = Math.random() * 8 + 6;
    const duration = Math.random() * 2 + 2;
    const delay = Math.random() * 0.8;
    const shape = Math.random() > 0.5 ? "50%" : "0";

    piece.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${shape};
      --fall-duration: ${duration}s;
      --fall-delay: ${delay}s;
    `;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 5000);
}
