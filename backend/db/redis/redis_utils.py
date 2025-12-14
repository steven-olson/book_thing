import redis
from pydantic import BaseModel

from config import get_settings


class RedisKeyInfo(BaseModel):
    name: str
    type: str


class RedisServerInfo(BaseModel):
    version: str
    uptime_seconds: int


class RedisClientsInfo(BaseModel):
    connected: int


class RedisMemoryInfo(BaseModel):
    used: str
    peak: str


class RedisKeysInfo(BaseModel):
    total: int
    keys: list[RedisKeyInfo]


class CeleryTaskInfo(BaseModel):
    name: str
    queue: str


class CeleryQueueInfo(BaseModel):
    name: str
    length: int
    tasks: list[str]


class RedisCeleryInfo(BaseModel):
    default_queue: str
    queues: list[CeleryQueueInfo]
    registered_tasks: list[CeleryTaskInfo]


class RedisStatus(BaseModel):
    url: str
    connected: bool
    server: RedisServerInfo | None = None
    clients: RedisClientsInfo | None = None
    memory: RedisMemoryInfo | None = None
    keys: RedisKeysInfo | None = None
    celery: RedisCeleryInfo | None = None
    error: str | None = None


def get_redis_client() -> redis.Redis:
    """Get a Redis client connected to the Celery broker."""
    settings = get_settings()
    return redis.from_url(settings.celery.broker_url)


def get_redis_status() -> RedisStatus:
    """Return the current status of the Redis instance used by Celery."""
    settings = get_settings()
    client = get_redis_client()

    status = RedisStatus(
        url=settings.celery.broker_url,
        connected=False,
    )

    try:
        if client.ping():
            status.connected = True

        info = client.info()

        status.server = RedisServerInfo(
            version=info.get("redis_version", "N/A"),
            uptime_seconds=info.get("uptime_in_seconds", 0),
        )

        status.clients = RedisClientsInfo(
            connected=info.get("connected_clients", 0),
        )

        status.memory = RedisMemoryInfo(
            used=info.get("used_memory_human", "N/A"),
            peak=info.get("used_memory_peak_human", "N/A"),
        )

        keys = client.keys("*")
        key_infos = []
        for key in keys[:20]:
            key_type = client.type(key)
            key_type = key_type.decode() if isinstance(key_type, bytes) else key_type
            key_name = key.decode() if isinstance(key, bytes) else key
            key_infos.append(RedisKeyInfo(name=key_name, type=key_type))

        status.keys = RedisKeysInfo(
            total=client.dbsize(),
            keys=key_infos,
        )

        # Get Celery task and queue information
        from task_api.celery_app import celery_app

        default_queue = celery_app.conf.task_default_queue or "celery"

        # Get registered tasks and their queues
        registered_tasks: list[CeleryTaskInfo] = []
        task_queues: dict[str, list[str]] = {}

        for task_name, task in celery_app.tasks.items():
            # Skip built-in celery tasks
            if task_name.startswith("celery."):
                continue

            # Get the queue for this task (from task options or default)
            task_queue = getattr(task, "queue", None) or default_queue
            registered_tasks.append(
                CeleryTaskInfo(name=task_name, queue=task_queue)
            )

            # Group tasks by queue
            if task_queue not in task_queues:
                task_queues[task_queue] = []
            task_queues[task_queue].append(task_name)

        # Get queue lengths from Redis
        queues: list[CeleryQueueInfo] = []
        for queue_name, queue_tasks in task_queues.items():
            queue_length = client.llen(queue_name)
            queues.append(
                CeleryQueueInfo(
                    name=queue_name,
                    length=queue_length,
                    tasks=queue_tasks,
                )
            )

        status.celery = RedisCeleryInfo(
            default_queue=default_queue,
            queues=queues,
            registered_tasks=registered_tasks,
        )

    except redis.ConnectionError as e:
        status.error = f"Connection Error: {e}"
    except Exception as e:
        status.error = f"Error: {e}"
    finally:
        client.close()

    return status


if __name__ == "__main__":
    status = get_redis_status()
    print(status.model_dump_json(indent=2))
