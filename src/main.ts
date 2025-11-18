import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

// Simple upgrades implementation with requestAnimationFrame-based auto-increment
type Upgrade = {
  id: string;
  name: string;
  description?: string;
  cost: number; // integer cost in pizzas
  perSecond: number; // how many pizzas per second this provides
  purchased: boolean;
};

const upgrades: Upgrade[] = [
  {
    id: "oven",
    name: "Better Oven",
    description: "+0.5 / s",
    cost: 10,
    perSecond: 0.5,
    purchased: false,
  },
  {
    id: "delivery",
    name: "Delivery Route",
    description: "+2 / s",
    cost: 50,
    perSecond: 2,
    purchased: false,
  },
  {
    id: "factory",
    name: "Pizza Factory",
    description: "+10 / s",
    cost: 200,
    perSecond: 10,
    purchased: false,
  },
];

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

const counterDiv = document.createElement("div");
const perSecondDiv = document.createElement("div");
const upgradesContainer = document.createElement("div");

let counter = 0; // integer pizzas
let perSecond = 0; // total pizzas per second from upgrades
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

function createUpgradeElement(u: Upgrade) {
  const wrap = document.createElement("div");
  wrap.style.marginBottom = "0.5rem";

  const label = document.createElement("span");
  label.textContent = `${u.name} (${u.description ?? ""}) - Cost: ${u.cost}`;
  label.style.marginRight = "1rem";

  const buyBtn = document.createElement("button");
  buyBtn.textContent = u.purchased ? "Purchased" : "Buy";
  buyBtn.disabled = u.purchased || counter < u.cost;

  buyBtn.addEventListener("click", () => {
    if (!u.purchased && counter >= u.cost) {
      counter -= u.cost;
      u.purchased = true;
      perSecond += u.perSecond;
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
