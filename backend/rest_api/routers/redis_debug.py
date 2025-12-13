from fastapi import APIRouter

from db.redis.redis_utils import get_redis_status, RedisStatus
from task_api.tasks.example import hello_world_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/hello")
async def trigger_hello_task(name: str = "World"):
    """Trigger a hello world task."""
    result = hello_world_task.delay(name)
    return {"task_id": result.id, "status": "queued"}


@router.get("/stats")
async def get_redis_stats() -> RedisStatus:
    stats = get_redis_status()
    return stats
