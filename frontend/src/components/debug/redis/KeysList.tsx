"use client";

import type { RedisStatus } from "@/api";

interface KeysListProps {
  keys: RedisStatus["keys"];
}

export const KeysList = ({ keys }: KeysListProps) => {
  if (!keys || keys.keys.length === 0) {
    return (
      <p className="text-sm text-zinc-500 dark:text-zinc-400">No keys found</p>
    );
  }

  return (
    <div className="space-y-1">
      {keys.keys.map((key) => (
        <div
          key={key.name}
          className="flex items-center justify-between text-sm py-1 px-2 bg-zinc-50 dark:bg-zinc-800/50 rounded"
        >
          <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate">
            {key.name}
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 shrink-0">
            {key.type}
          </span>
        </div>
      ))}
    </div>
  );
};
