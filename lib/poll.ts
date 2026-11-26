import data from "../data/poll.json";

export const POLL = data;
export const pollStorageKey = `knukim-poll-${POLL.id}`;
type Poll = { id: string; version: number; options: readonly { id: string; label: string; votes: number }[] };
export type VoteStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
export type VoteState = { choice: string | null; persistent: boolean };

export function getVote(storage: VoteStorage | null, poll: Poll = POLL): VoteState {
  if (!storage) return { choice: null, persistent: false };
  let raw: string | null;
  try { raw = storage.getItem(`knukim-poll-${poll.id}`); } catch { return { choice: null, persistent: false }; }
  if (!raw) return { choice: null, persistent: true };
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return { choice: null, persistent: true };
    const stored = value as Record<string, unknown>;
    const valid = stored.pollId === poll.id && stored.version === poll.version && poll.options.some((option) => option.id === stored.optionId);
    return { choice: valid ? stored.optionId as string : null, persistent: true };
  } catch { return { choice: null, persistent: true }; }
}

export function vote(optionId: string, storage: VoteStorage | null, poll: Poll = POLL): VoteState {
  if (!poll.options.some((option) => option.id === optionId)) return { choice: null, persistent: false };
  if (!storage) return { choice: optionId, persistent: false };
  try {
    storage.setItem(`knukim-poll-${poll.id}`, JSON.stringify({ pollId: poll.id, version: poll.version, optionId }));
    return { choice: optionId, persistent: true };
  } catch { return { choice: optionId, persistent: false }; }
}

export function getResults(choice: string | null, poll: Poll = POLL) {
  const counts = poll.options.map((option) => ({ ...option, votes: option.votes + Number(option.id === choice) }));
  const total = counts.reduce((sum, option) => sum + option.votes, 0);
  const fractions = counts.map((option, index) => ({ index, exact: total ? option.votes / total * 100 : 0 }));
  const percentages = fractions.map((entry) => Math.floor(entry.exact));
  const remaining = total ? 100 - percentages.reduce((sum, value) => sum + value, 0) : 0;
  const ranked = [...fractions].sort((a, b) => (b.exact % 1) - (a.exact % 1) || a.index - b.index);
  for (let index = 0; index < remaining; index++) percentages[ranked[index].index] += 1;
  return counts.map((option, index) => ({ ...option, percentage: percentages[index], selected: option.id === choice }));
}
