"use client";

import { useState } from "react";
import {
  useHealthCheckHealthGet,
  useTriggerHelloTaskTasksHelloPost,
} from "@/api";

function formatError(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function BackendTest() {
  const [taskName, setTaskName] = useState("Frontend");

  const {
    data: healthData,
    error: healthError,
    isLoading: healthLoading,
    mutate: refetchHealth,
  } = useHealthCheckHealthGet();

  const {
    trigger: triggerTask,
    data: taskData,
    error: taskError,
    isMutating: taskLoading,
  } = useTriggerHelloTaskTasksHelloPost({ name: taskName });

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Backend Connection Test
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Using Orval-generated SWR hooks
        </p>

        <div className="space-y-6">
          {/* Health Check Section */}
          <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Health Check (GET /health)
            </h2>
            <button
              onClick={() => refetchHealth()}
              disabled={healthLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {healthLoading ? "Loading..." : "Check Health"}
            </button>

            {healthError !== undefined && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Error: {formatError(healthError)}
                </p>
              </div>
            )}

            {healthData && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <pre className="text-sm text-zinc-700 dark:text-zinc-300">
                  {JSON.stringify(healthData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Task Trigger Section */}
          <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
              Trigger Task (POST /tasks/hello)
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter name"
                className="px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
              <button
                onClick={() => triggerTask()}
                disabled={taskLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {taskLoading ? "Triggering..." : "Trigger Task"}
              </button>
            </div>

            {taskError !== undefined && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm">
                  Error: {formatError(taskError)}
                </p>
              </div>
            )}

            {taskData && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <pre className="text-sm text-zinc-700 dark:text-zinc-300">
                  {JSON.stringify(taskData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
