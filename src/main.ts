import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
`;

document.body.innerHTML = ` 
  <p> I make change </p>

`;

const button = document.createElement("button");
button.textContent = "🍕";
document.body.appendChild(button);
