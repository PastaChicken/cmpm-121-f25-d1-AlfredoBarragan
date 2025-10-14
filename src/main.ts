import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

const counterDiv = document.createElement("div");
let counter = 0;
let cumulativecounter = 0;
//Initial text
counterDiv.textContent = `${counter} Pizza's`;

document.body.appendChild(counterDiv);

//Create a button
const button = document.createElement("button");
button.textContent = "🍕";
document.body.appendChild(button);

//Add event listener to the button
button.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter + cumulativecounter} Pizza's`;
});

let lastTime = performance.now();

function updateCounter(now: number) {
  if (now - lastTime >= 1000) {
    cumulativecounter += 1;
    counter++;
    counter = counter + cumulativecounter;
    counterDiv.textContent = `${counter} Pizza's`;

    lastTime = now;
  }
  requestAnimationFrame(updateCounter);
}
requestAnimationFrame(updateCounter);
