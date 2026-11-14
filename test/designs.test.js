import test from "node:test";
import assert from "node:assert/strict";
import { generateSet } from "../designs.js";

test("generates the requested number of pieces and carries through the idea", () => {
  const set = generateSet({ idea: "A moonlit garden", count: 4, style: "matched", random: () => 0 });
  assert.equal(set.idea, "A moonlit garden");
  assert.equal(set.pieces.length, 4);
  assert.ok(set.pieces.every((piece) => piece.motif === "moon"));
  assert.deepEqual(set.pieces[0].dimensionsMm, { width: 18, height: 24, thickness: 3 });
});

test("mismatched sets cycle through distinct motifs", () => {
  const set = generateSet({ idea: "A tiny moon", count: 3, style: "mismatched", random: () => 0 });
  assert.deepEqual(set.pieces.map((piece) => piece.motif), ["moon", "leaf", "shell"]);
});

test("rejects empty ideas and piece counts outside the supported range", () => {
  assert.throws(() => generateSet({ idea: "   ", count: 2, style: "matched" }), /idea/i);
  assert.throws(() => generateSet({ idea: "A star", count: 7, style: "matched" }), /1 and 6/);
});

test("requires a supported style", () => {
  assert.throws(() => generateSet({ idea: "A star", count: 2, style: "random" }), /matched or mismatched/i);
});
