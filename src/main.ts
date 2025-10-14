import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;



const counterDiv = document.createElement("div");
let counter = 0;

counterDiv.textContent = `${counter} Pizza's`;

document.body.appendChild(counterDiv);

const button = document.createElement("button");
button.textContent = "🍕";
document.body.appendChild(button);

button.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter} Pizza's`;
});

