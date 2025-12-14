"use client";

interface TaskTriggerProps {
  taskName: string;
  onTaskNameChange: (name: string) => void;
  data: unknown;
  error: unknown;
  isLoading: boolean;
  onTrigger: () => void;
}

const formatError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const TaskTrigger = ({
  taskName,
  onTaskNameChange,
  data,
  error,
  isLoading,
  onTrigger,
}: TaskTriggerProps) => {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
        Trigger Task (POST /tasks/hello)
      </h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={taskName}
          onChange={(e) => onTaskNameChange(e.target.value)}
          placeholder="Enter name"
          className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
        />
        <button
          onClick={onTrigger}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Triggering..." : "Trigger Task"}
        </button>
      </div>

      {error !== undefined && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">
            Error: {formatError(error)}
          </p>
        </div>
      )}

      {data !== undefined && (
        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
          <pre className="text-sm text-zinc-700 dark:text-zinc-300">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
