import { generateSet } from "./designs.js";

const form = document.querySelector("#idea-form");
const ideaInput = document.querySelector("#idea");
const charCount = document.querySelector("#char-count");
const results = document.querySelector("#results");
const grid = document.querySelector("#design-grid");
const subtitle = document.querySelector("#results-subtitle");
const downloadButton = document.querySelector("#download-button");
let currentSet;

const svgNamespace = "http://www.w3.org/2000/svg";

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  return element;
}

function makePreview(piece) {
  const svg = svgElement("svg", { viewBox: "0 0 160 180", role: "img", "aria-label": `${piece.motif} earring concept` });
  svg.append(svgElement("path", { d: "M80 8c-13 0-23 10-23 23 0 12 10 22 23 22s23-10 23-22C103 18 93 8 80 8Z", fill: "none", stroke: "#2c302c", "stroke-width": "3" }));
  svg.append(svgElement("path", { d: "M80 53v12", stroke: "#2c302c", "stroke-width": "3", "stroke-linecap": "round" }));
  const centerX = 80;
  const centerY = 112;
  let shape;
  switch (piece.motif) {
    case "flower":
      shape = svgElement("g", { fill: piece.color });
      for (let i = 0; i < 6; i += 1) shape.append(svgElement("ellipse", { cx: centerX, cy: centerY - 23, rx: 12, ry: 19, transform: `rotate(${i * 60} ${centerX} ${centerY})` }));
      shape.append(svgElement("circle", { cx: centerX, cy: centerY, r: 12, fill: piece.accent }));
      break;
    case "star":
      shape = svgElement("polygon", { points: "80,70 91,99 122,100 98,119 106,149 80,132 54,149 62,119 38,100 69,99", fill: piece.color });
      break;
    case "heart":
      shape = svgElement("path", { d: "M80 145C64 132 42 116 42 96a21 21 0 0 1 38-12 21 21 0 0 1 38 12c0 20-22 36-38 49Z", fill: piece.color });
      break;
    case "moon":
      shape = svgElement("path", { d: "M102 75a43 43 0 1 0 1 73A35 35 0 0 1 102 75Z", fill: piece.color });
      break;
    case "leaf":
      shape = svgElement("path", { d: "M44 139c-2-45 26-72 77-75 0 49-27 79-77 75Z", fill: piece.color });
      shape.append(svgElement("path", { d: "M53 133 105 85", stroke: piece.accent, "stroke-width": "5", "stroke-linecap": "round" }));
      break;
    case "shell":
      shape = svgElement("path", { d: "M41 137a39 39 0 1 1 78 0c-13-8-24-8-39 0-15-8-26-8-39 0Z", fill: piece.color, stroke: piece.accent, "stroke-width": "3" });
      for (let i = 0; i < 5; i += 1) shape.append(svgElement("path", { d: `M80 135 Q${53 + i * 13} 108 ${47 + i * 13} 95`, fill: "none", stroke: piece.accent, "stroke-width": "2" }));
      break;
    case "sun":
      shape = svgElement("g");
      shape.append(svgElement("circle", { cx: centerX, cy: centerY + 4, r: 27, fill: piece.color }));
      for (let i = 0; i < 8; i += 1) shape.append(svgElement("path", { d: "M80 69v-9", stroke: piece.accent, "stroke-width": "5", "stroke-linecap": "round", transform: `rotate(${i * 45} 80 112)` }));
      break;
    default:
      shape = svgElement("path", { d: "M44 121c0-11 9-20 21-20 5-15 29-19 38-2 16-3 27 8 27 21 0 12-10 21-23 21H66c-13 0-22-8-22-20Z", fill: piece.color });
  }
  svg.append(shape);
  return svg;
}

function renderSet(set) {
  grid.replaceChildren();
  for (const piece of set.pieces) {
    const card = document.createElement("article");
    card.className = "design-card";
    const art = document.createElement("div");
    art.className = "design-art";
    art.append(makePreview(piece));
    const details = document.createElement("div");
    details.className = "design-details";
    const title = document.createElement("h3");
    title.textContent = piece.name;
    const description = document.createElement("p");
    description.textContent = `${piece.dimensionsMm.width} × ${piece.dimensionsMm.height} × ${piece.dimensionsMm.thickness} mm · ${set.palette}`;
    details.append(title, description);
    card.append(art, details);
    grid.append(card);
  }
  subtitle.textContent = `Inspired by “${set.idea}” · ${set.pieces.length} ${set.pieces.length === 1 ? "piece" : "pieces"} · ${set.style}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  try {
    currentSet = generateSet({
      idea: ideaInput.value,
      count: Number(data.get("count")),
      style: data.get("style"),
    });
    renderSet(currentSet);
    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    ideaInput.setCustomValidity(error.message);
    ideaInput.reportValidity();
  }
});

ideaInput.addEventListener("input", () => {
  ideaInput.setCustomValidity("");
  charCount.textContent = `${ideaInput.value.length} / 240`;
});

downloadButton.addEventListener("click", () => {
  if (!currentSet) return;
  const contents = JSON.stringify({ ...currentSet, exportNote: "Concept brief only; this file is not a printable STL." }, null, 2);
  const url = URL.createObjectURL(new Blob([contents], { type: "application/json" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "oddly-yours-design-brief.json";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#try-again").addEventListener("click", () => {
  form.requestSubmit();
});
