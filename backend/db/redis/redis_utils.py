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


class RedisCeleryInfo(BaseModel):
    queue_length: int


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

        status.celery = RedisCeleryInfo(
            queue_length=client.llen("celery"),
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
