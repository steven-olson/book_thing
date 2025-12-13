"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TestPage() {
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [taskResult, setTaskResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setHealthStatus(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Health check failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/tasks/hello?name=Frontend`, {
        method: "POST",
      });
      const data = await response.json();
      setTaskResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(`Task trigger failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Backend Connection Test
        </h1>

        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={checkHealth}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Check Health
            </button>
            <button
              onClick={triggerTask}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trigger Task
            </button>
          </div>

          {loading && (
            <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
          )}

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {healthStatus && (
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Health Response:
              </h2>
              <pre className="text-sm text-zinc-700 dark:text-zinc-300">
                {healthStatus}
              </pre>
            </div>
          )}

          {taskResult && (
            <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                Task Response:
              </h2>
              <pre className="text-sm text-zinc-700 dark:text-zinc-300">
                {taskResult}
              </pre>
            </div>
          )}
        </div>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          API URL: {API_URL}
        </p>
      </div>
    </div>
  );
}
