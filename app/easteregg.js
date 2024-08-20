// easteregg 1
// rana quote easter egg
const tips = [
    "ranayi cok seviom",
    "elmaadam31",
    "kalamari gotten",
    "enayi essek",
    "haha eastereggs",
    "salih usta sosuna süt katmuyur"
  ];
const ranaQuote = document.createElement("rana");
ranaQuote.textContent = tips[Math.floor(Math.random() * tips.length)];
document.querySelector(".tips").appendChild(ranaQuote);

// easteregg 2
// 