"use client";

import type { RedisStatus } from "@/api";
import { StatusBadge } from "./StatusBadge";
import { StatCard } from "./StatCard";
import { KeysList } from "./KeysList";
import { formatUptime } from "./utils";

interface RedisStatusDisplayProps {
  status: RedisStatus | undefined;
  error: unknown;
  isLoading: boolean;
  onRefresh: () => void;
}

export const RedisStatusDisplay = ({
  status,
  error,
  isLoading,
  onRefresh,
}: RedisStatusDisplayProps) => {

  const clickRefresh = (() => {
    console.log("clicked")
    onRefresh()
  })


  return (
    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
          Redis Status
        </h2>
        <button
          onClick={clickRefresh}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error !== undefined && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="text-red-700 dark:text-red-300 text-sm">
            Failed to fetch Redis status
          </p>
        </div>
      )}

      {status && (
        <div className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-3">
            <StatusBadge connected={status.connected} />
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              {status.url}
            </span>
          </div>

          {status.error && (
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                {status.error}
              </p>
            </div>
          )}

          {/* Stats Grid */}
          {status.connected && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {status.server && (
                  <>
                    <StatCard label="Version" value={status.server.version} />
                    <StatCard
                      label="Uptime"
                      value={formatUptime(status.server.uptime_seconds)}
                    />
                  </>
                )}
                {status.clients && (
                  <StatCard
                    label="Clients"
                    value={status.clients.connected}
                    subValue="connected"
                  />
                )}
                {status.celery && status.celery.queues.length > 0 && (
                  <StatCard
                    label="Queue"
                    value={status.celery.queues.reduce((sum, q) => sum + q.length, 0)}
                    subValue="pending tasks"
                  />
                )}
              </div>

              {/* Memory */}
              {status.memory && (
                <div className="grid grid-cols-2 gap-3">
                  <StatCard
                    label="Memory Used"
                    value={status.memory.used}
                    subValue={`Peak: ${status.memory.peak}`}
                  />
                  {status.keys && (
                    <StatCard label="Total Keys" value={status.keys.total} />
                  )}
                </div>
              )}

              {/* Keys List */}
              {status.keys && status.keys.keys.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Keys ({status.keys.total})
                  </h3>
                  <KeysList keys={status.keys} />
                </div>
              )}

              {/* Celery Tasks */}
              {status.celery && status.celery.registered_tasks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Celery Tasks ({status.celery.registered_tasks.length})
                  </h3>
                  <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-3 space-y-2">
                    {status.celery.queues.map((queue) => (
                      <div key={queue.name} className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            Queue: {queue.name}
                          </span>
                          <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded">
                            {queue.length} pending
                          </span>
                        </div>
                        <ul className="ml-3 space-y-0.5">
                          {queue.tasks.map((task) => (
                            <li
                              key={task}
                              className="text-xs font-mono text-zinc-600 dark:text-zinc-400"
                            >
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
