from fastapi import APIRouter

from task_api.tasks.example import hello_world_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("/hello")
async def trigger_hello_task(name: str = "World"):
    """Trigger a hello world task."""
    result = hello_world_task.delay(name)
    return {"task_id": result.id, "status": "queued"}
