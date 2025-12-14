from enum import Enum
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class RunMode(str, Enum):
    REST = "rest"
    WORKER = "worker"


class DynamoDBSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="DYNAMODB_")

    region_name: str = "us-east-1"
    endpoint_url: str | None = None  # For local development (e.g., DynamoDB Local)
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None


class CelerySettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="CELERY_")

    broker_url: str = "redis://localhost:6379/0"
    result_backend: str = "redis://localhost:6379/0"
    task_serializer: str = "json"
    result_serializer: str = "json"
    accept_content: list[str] = ["json"]
    timezone: str = "UTC"
    enable_utc: bool = True
    task_track_started: bool = True
    task_time_limit: int = 30 * 60  # 30 minutes
    worker_prefetch_multiplier: int = 1


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Backend API"
    debug: bool = False
    run_mode: RunMode = RunMode.REST

    celery: CelerySettings = CelerySettings()
    dynamodb: DynamoDBSettings = DynamoDBSettings()


@lru_cache
def get_settings() -> Settings:
    return Settings()
