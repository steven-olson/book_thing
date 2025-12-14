"use client";

import { useState } from "react";
import {
  useHealthCheckHealthGet,
  useTriggerHelloTaskTasksHelloPost,
  useGetRedisStatus,
} from "@/api";
import { HealthCheck } from "../debug/HealthCheck";
import { TaskTrigger } from "../debug/TaskTrigger";
import { RedisStatusDisplay } from "../debug/redis/RedisStatus";

export const DebugPage = () => {
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

  const {
    data: redisData,
    error: redisError,
    isLoading: redisLoading,
    mutate: refetchRedis,
  } = useGetRedisStatus();

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
          <HealthCheck
            data={healthData}
            error={healthError}
            isLoading={healthLoading}
            onRefresh={() => refetchHealth()}
          />

          <TaskTrigger
            taskName={taskName}
            onTaskNameChange={setTaskName}
            data={taskData}
            error={taskError}
            isLoading={taskLoading}
            onTrigger={() => triggerTask()}
          />

          <RedisStatusDisplay
            status={redisData?.data}
            error={redisError}
            isLoading={redisLoading}
            onRefresh={() => refetchRedis()}
          />
        </div>
      </div>
    </div>
  );
};
