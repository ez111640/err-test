const motifs = ["flower", "star", "heart", "moon", "leaf", "shell", "sun", "cloud"];

const motifKeywords = [
  [["flower", "garden", "bloom", "petal", "plant", "gnome"], "flower"],
  [["star", "space", "galaxy", "cosmic"], "star"],
  [["heart", "love", "romance"], "heart"],
  [["moon", "night", "lunar", "dream"], "moon"],
  [["leaf", "forest", "tree", "nature"], "leaf"],
  [["shell", "ocean", "beach", "sea"], "shell"],
  [["sun", "sunshine", "summer", "sunset"], "sun"],
  [["cloud", "sky", "rain", "weather"], "cloud"],
];

const palettes = [
  { name: "Peachy keen", colors: ["#e79a7b", "#f4c86b", "#a9b5a0"] },
  { name: "After hours", colors: ["#79648c", "#e7b6ac", "#c5a960"] },
  { name: "Garden party", colors: ["#799578", "#e9c078", "#cf8f83"] },
  { name: "Blue day", colors: ["#7298a8", "#e7c7a2", "#db9380"] },
];

function hashText(text) {
  let hash = 0;
  for (const character of text.toLowerCase()) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function chooseMotif(idea) {
  const lowerIdea = idea.toLowerCase();
  const firstMention = motifKeywords
    .map(([words, motif]) => ({
      motif,
      index: Math.min(...words.map((word) => lowerIdea.indexOf(word)).filter((index) => index >= 0)),
    }))
    .filter(({ index }) => Number.isFinite(index))
    .sort((left, right) => left.index - right.index)[0];
  return firstMention?.motif ?? motifs[hashText(idea) % motifs.length];
}

function randomIndex(random, length) {
  return Math.min(length - 1, Math.floor(random() * length));
}

export function generateSet({ idea, count, style, random = Math.random }) {
  const cleanedIdea = idea.trim();
  if (!cleanedIdea) throw new Error("Add an idea before making a set.");
  if (!Number.isInteger(count) || count < 1 || count > 6) throw new RangeError("Choose between 1 and 6 pieces.");
  if (style !== "matched" && style !== "mismatched") throw new Error("Choose a matched or mismatched set.");

  const baseMotif = chooseMotif(cleanedIdea);
  const motifStart = motifs.indexOf(baseMotif);
  const palette = palettes[(hashText(cleanedIdea) + randomIndex(random, palettes.length)) % palettes.length];
  const pieces = Array.from({ length: count }, (_, index) => {
    const motif = style === "matched" ? baseMotif : motifs[(motifStart + index) % motifs.length];
    return {
      number: index + 1,
      motif,
      name: `${motif[0].toUpperCase()}${motif.slice(1)} ${String(index + 1).padStart(2, "0")}`,
      color: palette.colors[index % palette.colors.length],
      accent: palette.colors[(index + 1) % palette.colors.length],
      dimensionsMm: { width: 18 + (index % 3) * 2, height: 24 + (index % 2) * 4, thickness: 3 },
    };
  });

  return {
    idea: cleanedIdea,
    style,
    palette: palette.name,
    pieces,
    printNotes: [
      "Concept dimensions are approximate and should be checked in your modeling workflow.",
      "Confirm wall thickness, earring finding fit, supports, resin compatibility, and post-cure before printing.",
    ],
  };
}
