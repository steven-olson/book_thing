"use client";

interface HealthCheckProps {
  data: unknown;
  error: unknown;
  isLoading: boolean;
  onRefresh: () => void;
}

const formatError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

export const HealthCheck = ({
  data,
  error,
  isLoading,
  onRefresh,
}: HealthCheckProps) => {
  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
      <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
        Health Check (GET /health)
      </h2>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Loading..." : "Check Health"}
      </button>

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
