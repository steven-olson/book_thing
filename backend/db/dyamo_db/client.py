from functools import lru_cache
from typing import Any

import boto3
from mypy_boto3_dynamodb import DynamoDBClient, DynamoDBServiceResource

from config import get_settings


def _get_boto_kwargs() -> dict[str, Any]:
    """Build kwargs for boto3 client/resource based on settings."""
    settings = get_settings()
    kwargs: dict[str, Any] = {
        "region_name": settings.dynamodb.region_name,
    }

    # Add endpoint URL for local development (DynamoDB Local)
    if settings.dynamodb.endpoint_url:
        kwargs["endpoint_url"] = settings.dynamodb.endpoint_url

    # Add explicit credentials if provided
    if settings.dynamodb.aws_access_key_id:
        kwargs["aws_access_key_id"] = settings.dynamodb.aws_access_key_id
    if settings.dynamodb.aws_secret_access_key:
        kwargs["aws_secret_access_key"] = settings.dynamodb.aws_secret_access_key

    return kwargs


@lru_cache
def get_dynamodb_client() -> DynamoDBClient:
    """
    Get a DynamoDB client (low-level API).

    Use this for direct API calls like batch operations,
    transactions, or when you need fine-grained control.
    """
    return boto3.client("dynamodb", **_get_boto_kwargs())


@lru_cache
def get_dynamodb_resource() -> DynamoDBServiceResource:
    """
    Get a DynamoDB resource (high-level API).

    Use this for simpler table operations with a more
    Pythonic interface (Table.put_item, Table.get_item, etc.).
    """
    return boto3.resource("dynamodb", **_get_boto_kwargs())
