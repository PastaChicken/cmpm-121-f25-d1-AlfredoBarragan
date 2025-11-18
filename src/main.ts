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
    costMultiplier: 1.12,
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
    costMultiplier: 1.2,
    level: 0,
    perLevel: 50,
  },
];
let counter = 0; // integer pizzas
let perSecond = upgrades.reduce((s, u) => s + u.level * u.perLevel, 0); // total pizzas per second from upgrades
let accumulator = 0; // fractional accumulator for perSecond over frames

// === UI CONSTRUCTION ===
const title = document.createElement("h1");
title.textContent = "Cool Pizza Clicker";
title.style.marginBottom = "0.5rem";
title.style.textAlign = "center";

const counterDiv = document.createElement("div");
const perSecondDiv = document.createElement("div");
const upgradesContainer = document.createElement("div");

counterDiv.textContent = `${counter} Pizza's`;
perSecondDiv.textContent = `${perSecond.toFixed(2)} / s`;

document.body.appendChild(counterDiv);
document.body.appendChild(perSecondDiv);

// Create click button (emoji-only, larger, transparent background)
const button = document.createElement("button");
button.textContent = "🍕";
button.style.fontSize = "5rem"; // bigger pizza
button.style.margin = "0.5rem";
button.style.background = "transparent";
button.style.border = "none";
button.style.padding = "0";
button.style.cursor = "pointer";
button.style.lineHeight = "1";
button.setAttribute("aria-label", "Click pizza");
document.body.appendChild(title);
document.body.appendChild(button);

upgradesContainer.style.marginTop = "1rem";
document.body.appendChild(upgradesContainer);
// === EVENT HANDLERS ===
// (your button.click listener and createUpgradeElement)
button.addEventListener("click", () => {
  counter++;
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

  const label = document.createElement("span");
  const currentCost = costForLevel(u);
  label.textContent = `${u.name} (${
    u.description ?? ""
  }) — Level: ${u.level} — Next: ${currentCost}`;
  label.style.marginRight = "1rem";

  const buyBtn = document.createElement("button");
  buyBtn.textContent = `Buy (${currentCost})`;
  buyBtn.disabled = counter < currentCost;

  buyBtn.addEventListener("click", () => {
    if (counter >= currentCost) {
      counter -= currentCost;
      u.level += 1;
      perSecond += u.perLevel;
      commitState();
    }
  });

  wrap.appendChild(label);
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
      commitState();
    }
  }

  requestAnimationFrame(animate);
}
// === GAME LOOP ===
requestAnimationFrame(animate);
