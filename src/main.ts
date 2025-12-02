import "./style.css";

// === GAME DATA ===
type Boost = {
  id: string;
  name: string;
  description?: string;
  initialCost: number; // initial cost for level 0 -> 1
  costMultiplier?: number; // multiplier per level (default 1.15)
  level: number; // how many times purchased
  perLevel: number; // how much perSecond each level provides
  perClick?: number; // how many extra pizzas per click this upgrade gives per level
};

const upgrades: Boost[] = [
  {
    id: "oven",
    name: "Better Oven",
    description: "+0.5 / s",
    initialCost: 10,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 0.5,
  },
  {
    id: "marketing",
    name: "Marketing Campaign",
    description: "+1 / s",
    initialCost: 25,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 1,
  },
  {
    id: "delivery",
    name: "Delivery Route",
    description: "+2 / s",
    initialCost: 50,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 2,
  },
  {
    id: "factory",
    name: "Pizza Factory",
    description: "+10 / s",
    initialCost: 200,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 10,
  },
  {
    id: "robot",
    name: "Pizza Robot",
    description: "+50 / s",
    initialCost: 2000,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 50,
  },
  {
    id: "training",
    name: "Chef Training",
    description: "+1 click",
    initialCost: 100,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 0,
    perClick: 1,
  },
];
let counter = 0; // integer pizzas
let perSecond = upgrades.reduce((s, u) => s + u.level * u.perLevel, 0); // total pizzas per second from upgrades
let accumulator = 0; // fractional accumulator for perSecond over frames
let clickValue = 1; // pizzas gained per manual click (mutable as upgrades change it)

// === UI CONSTRUCTION ===
const title = document.createElement("h1");
title.textContent = "Cool Pizza Clicker";
title.className = "game-title";

const counterDiv = document.createElement("div");
counterDiv.className = "counter";
const perSecondDiv = document.createElement("div");
perSecondDiv.className = "per-second";
const upgradesContainer = document.createElement("div");
upgradesContainer.className = "upgrades";

counterDiv.textContent = `${counter} Pizza's`;
perSecondDiv.textContent = `${perSecond.toFixed(2)} / s`;

document.body.appendChild(counterDiv);
document.body.appendChild(perSecondDiv);
// apply app background class from CSS
document.body.classList.add("app-bg");

// Create click button (emoji-only, larger, transparent background)
const button = document.createElement("button");
button.textContent = "🍕";
button.className = "pizza-button";
button.style.fontSize = "20rem"; // still set here for large screens; CSS has responsive fallback
button.setAttribute("aria-label", "Click pizza");
document.body.appendChild(title);
document.body.appendChild(button);

upgradesContainer.style.marginTop = "1rem";
document.body.appendChild(upgradesContainer);
// === EVENT HANDLERS ===
// (your button.click listener and createUpgradeElement)
// (click handling replaced below to capture click coordinates)

// --- Falling pizza animation setup ---
// Inject CSS for the falling animation
// Falling pizza CSS moved into `style.css` — no runtime injection needed

function spawnFallingPizza(
  x: number,
  y: number,
  sizeRem = 1,
  durationSec = 1.2,
) {
  const el = document.createElement("div");
  el.className = "falling-pizza";
  el.textContent = "🍕";
  el.style.left = `${Math.round(x)}px`;
  el.style.top = `${Math.round(y)}px`;
  el.style.transform = "translateY(0)";
  el.style.fontSize = `${sizeRem}rem`;
  el.style.lineHeight = "1";
  el.style.animationDuration = `${durationSec}s`;
  // center the emoji visually (use transform to offset by half width/height)
  el.style.transformOrigin = "center";
  el.style.marginLeft = `-${(sizeRem * 8) / 2}px`;
  el.style.marginTop = `-${(sizeRem * 8) / 2}px`;

  document.body.appendChild(el);
  el.addEventListener("animationend", () => {
    el.remove();
  });
  return el;
}

// Update click handler to spawn a falling pizza at the click location
button.addEventListener("click", (ev) => {
  const e = ev as MouseEvent;
  // spawn slightly above the click point for better effect
  // spawn falling pizzas equal to click value
  for (let i = 0; i < clickValue; i++) {
    spawnFallingPizza(
      e.clientX + (i - (clickValue - 1) / 2) * 10,
      e.clientY - 10 - i * 6,
      2.0 - i * 0.08,
      0.9 + i * 0.05,
    );
  }
  counter += clickValue;
  commitState();
});

// Upgrades section
// === UPDATE LOGIC ===
function updateDisplays() {
  counterDiv.textContent = `${counter} Pizza's`;
  perSecondDiv.textContent = `${perSecond.toFixed(2)} / s`;
}

// Helper to apply UI updates in one place (reduces duplicate calls)
function commitState() {
  updateDisplays();
  refreshUpgradesUI();
}

// Cost scales exponentially: baseCost * multiplier^level
function costForLevel(u: Boost) {
  const multiplier = u.costMultiplier ?? 1.15;
  // cost to buy the next level (level -> level + 1)
  return Math.ceil(u.initialCost * Math.pow(multiplier, u.level));
}

function createUpgradeElement(u: Boost) {
  const wrap = document.createElement("div");
  wrap.style.marginBottom = "0.5rem";

  const currentCost = costForLevel(u);

  // Move upgrade text into the button itself
  const buyBtn = document.createElement("button");
  buyBtn.className = "buy-btn";
  buyBtn.textContent = `${u.name} ${
    u.description ?? ""
  } · Lv ${u.level} · ${currentCost}`;
  buyBtn.disabled = counter < currentCost;
  buyBtn.setAttribute(
    "aria-label",
    `${u.name} purchase, costs ${currentCost} pizzas`,
  );

  buyBtn.addEventListener("click", () => {
    if (counter >= currentCost) {
      counter -= currentCost;
      u.level += 1;
      perSecond += u.perLevel;
      commitState();
      clickValue += u.perClick ?? 0;
    }
  });

  wrap.appendChild(buyBtn);
  return wrap;
}

function refreshUpgradesUI() {
  upgradesContainer.innerHTML = "";
  upgrades.forEach((u) =>
    upgradesContainer.appendChild(createUpgradeElement(u))
  );
}

// initial UI paint
commitState();

// Animation loop using requestAnimationFrame. Accumulate fractional perSecond and only
// add whole pizzas to keep counter an integer (user-visible pizzas).
let lastTime = performance.now();
function animate(now: number) {
  const dt = (now - lastTime) / 1000; // seconds
  lastTime = now;

  if (perSecond > 0) {
    accumulator += perSecond * dt;
    if (accumulator >= 1) {
      const toAdd = Math.floor(accumulator);
      counter += toAdd;
      accumulator -= toAdd;
      // spawn small falling pizzas for each auto-generated pizza
      const titleRect = title.getBoundingClientRect();
      for (let i = 0; i < toAdd; i++) {
        const winW =
          (globalThis as unknown as { innerWidth?: number }).innerWidth ?? 800;
        const x = Math.random() * (winW * 0.8) + winW * 0.1;
        const y = titleRect.bottom || 10;
        // vary size and duration slightly for visual variety
        const size = Math.max(1, Math.min(3, 1.5 + Math.random() * 1.5));
        const dur = 0.9 + Math.random() * 0.8;
        spawnFallingPizza(x, y, size, dur);
      }
      commitState();
    }
  }

  requestAnimationFrame(animate);
}
// === GAME LOOP ===
requestAnimationFrame(animate);
