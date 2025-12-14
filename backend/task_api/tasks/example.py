import logging
import time
from task_api.celery_app import celery_app

logger = logging.getLogger(__name__)


@celery_app.task
def hello_world_task(name: str = "World") -> str:
    """Simple hello world task for testing."""
    logger.info("STARTED")
    time.sleep(30)
    message = f"Hello, {name}!"
    logger.info(message)
    return message
