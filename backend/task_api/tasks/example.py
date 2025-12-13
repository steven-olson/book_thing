import logging

from task_api.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task
def hello_world_task(name: str = "World") -> str:
    """Simple hello world task for testing."""
    message = f"Hello, {name}!"
    logger.info(message)
    return message
