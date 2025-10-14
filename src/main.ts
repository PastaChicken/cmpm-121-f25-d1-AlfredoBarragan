import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

const counterDiv = document.createElement("div");
const currentAutoUpgrades = document.createElement("div");
let counter = 0;
let cumulativecounter = 0;
counterDiv.textContent = `${counter} Pizza's`;

document.body.appendChild(counterDiv);

//Create click button
const button = document.createElement("button");
button.textContent = "🍕";
button.style.fontSize = "2rem";
button.style.margin = "0.5rem";
document.body.appendChild(button);

//Upgrade button
const upgrade = document.createElement("button");
upgrade.textContent = "Upgrade: Auto Pizza";
const upgradeText = document.createElement("span");
upgradeText.textContent = " (Cost: 10 Pizza's)";

//display texts
document.body.appendChild(upgrade);
document.body.appendChild(upgradeText);
document.body.appendChild(currentAutoUpgrades);

//add event listener to the button
button.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter} Pizza's`;
});

//add event listener to the upgrade button
upgrade.addEventListener("click", () => {
  if (counter >= 10) {
    counter = counter - 10;
    upgrade.textContent = "Auto Pizza Upgrade Purchased!";
    counterDiv.textContent = `${counter} Pizza's`;
    cumulativecounter += 1;
    currentAutoUpgrades.textContent =
      ` Current Auto clicks per Second: ${cumulativecounter}`;

    requestAnimationFrame(updateCounter);
  } else {
    upgrade.textContent = "Not enough Pizza's. required 10 Pizza's";
  }
});

let lastTime = performance.now();

function updateCounter(now: number) {
  if (now - lastTime >= 1000) {
    counter = counter + cumulativecounter;
    counterDiv.textContent = `${counter} Pizza's`;

    lastTime = now;
  }
  if (counter >= 10) {
    upgrade.textContent = "Upgrade: Auto Pizza (Available!)";
  }
  requestAnimationFrame(updateCounter);
}
