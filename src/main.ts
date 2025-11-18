import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

// Simple upgrades implementation with requestAnimationFrame-based auto-increment
type Upgrade = {
  id: string;
  name: string;
  description?: string;
  baseCost: number; // initial cost for level 0 -> 1
  costMultiplier?: number; // multiplier per level (default 1.15)
  level: number; // how many times purchased
  perLevel: number; // how much perSecond each level provides
};

const upgrades: Upgrade[] = [
  {
    id: "oven",
    name: "Better Oven",
    description: "+0.5 / s",
    baseCost: 10,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 0.5,
  },
  {
    id: "delivery",
    name: "Delivery Route",
    description: "+2 / s",
    baseCost: 50,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 2,
  },
  {
    id: "factory",
    name: "Pizza Factory",
    description: "+10 / s",
    baseCost: 200,
    costMultiplier: 1.15,
    level: 0,
    perLevel: 10,
  },
];

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

const counterDiv = document.createElement("div");
const perSecondDiv = document.createElement("div");
const upgradesContainer = document.createElement("div");

let counter = 0; // integer pizzas
let perSecond = upgrades.reduce((s, u) => s + u.level * u.perLevel, 0); // total pizzas per second from upgrades
let accumulator = 0; // fractional accumulator for perSecond over frames

counterDiv.textContent = `${counter} Pizza's`;
perSecondDiv.textContent = `${perSecond.toFixed(2)} / s`;

document.body.appendChild(counterDiv);
document.body.appendChild(perSecondDiv);

// Create click button
const button = document.createElement("button");
button.textContent = "🍕";
button.style.fontSize = "2rem";
button.style.margin = "0.5rem";
document.body.appendChild(button);

// Upgrades section
upgradesContainer.style.marginTop = "1rem";
document.body.appendChild(upgradesContainer);

button.addEventListener("click", () => {
  counter++;
  updateDisplays();
  refreshUpgradesUI();
});

function updateDisplays() {
  counterDiv.textContent = `${counter} Pizza's`;
  perSecondDiv.textContent = `${perSecond.toFixed(2)} / s`;
}

function costForLevel(u: Upgrade) {
  const multiplier = u.costMultiplier ?? 1.15;
  // cost to buy the next level (level -> level + 1)
  return Math.ceil(u.baseCost * Math.pow(multiplier, u.level));
}

function createUpgradeElement(u: Upgrade) {
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
      updateDisplays();
      refreshUpgradesUI();
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

refreshUpgradesUI();

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
      updateDisplays();
      refreshUpgradesUI();
    }
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
