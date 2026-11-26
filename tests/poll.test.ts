import assert from "node:assert/strict";
import test from "node:test";
import { POLL, getResults, getVote, pollStorageKey, vote } from "../lib/poll";
import type { VoteStorage } from "../lib/poll";

function memoryStorage(): VoteStorage {
  const values = new Map<string, string>();
  return { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => { values.set(key, value); } };
}

test("one choice adds one vote on every read without mutating the baseline", () => {
  const before = JSON.stringify(POLL);
  for (let visit = 0; visit < 3; visit++) {
    const results = getResults("practice");
    assert.equal(results.find((entry) => entry.id === "practice")!.votes, 239);
    assert.equal(results.reduce((sum, entry) => sum + entry.votes, 0), 1071);
  }
  assert.equal(JSON.stringify(POLL), before);
});

test("storage restores poll/version/option only and replacement removes the previous addition", () => {
  const storage = memoryStorage();
  vote("teachers", storage);
  assert.deepEqual(getVote(storage), { choice: "teachers", persistent: true });
  assert.deepEqual(JSON.parse(storage.getItem(pollStorageKey)!), { pollId: "university-choice", version: 1, optionId: "teachers" });
  vote("practice", storage); vote("practice", storage);
  const result = getResults(getVote(storage).choice);
  assert.equal(result.find((entry) => entry.id === "teachers")!.votes, 185);
  assert.equal(result.find((entry) => entry.id === "practice")!.votes, 239);
});

test("corrupt, expired and unknown stored choices are ignored", () => {
  const storage = memoryStorage();
  for (const raw of ["broken", "null", JSON.stringify({ pollId: POLL.id, version: 0, optionId: "teachers" }), JSON.stringify({ pollId: POLL.id, version: 1, optionId: "missing" })]) {
    storage.setItem(pollStorageKey, raw); assert.deepEqual(getVote(storage), { choice: null, persistent: true });
  }
});

test("denied storage still returns an in-memory vote", () => {
  const denied = { getItem() { throw new Error("denied"); }, setItem() { throw new Error("denied"); } };
  assert.deepEqual(getVote(denied), { choice: null, persistent: false });
  assert.deepEqual(vote("practice", denied), { choice: "practice", persistent: false });
  assert.deepEqual(vote("practice", null), { choice: "practice", persistent: false });
});

test("integer percentages total 100 for ties and tiny counts, and remain finite for zero totals", () => {
  const poll = { id: "small", version: 1, options: ["a", "b", "c"].map((id) => ({ id, label: id, votes: 1 })) };
  assert.deepEqual(getResults(null, poll).map((entry) => entry.percentage), [34, 33, 33]);
  assert.equal(getResults("b", poll).reduce((sum, entry) => sum + entry.percentage, 0), 100);
  const zero = { ...poll, options: poll.options.map((entry) => ({ ...entry, votes: 0 })) };
  assert.deepEqual(getResults(null, zero).map((entry) => entry.percentage), [0, 0, 0]);
  assert.deepEqual(getResults("c", zero).map((entry) => entry.percentage), [0, 0, 100]);
});
