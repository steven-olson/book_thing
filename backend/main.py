import sys

from config import RunMode, get_settings


def run_rest_api() -> None:
    import uvicorn

    from rest_api.run_rest_api import app

    settings = get_settings()
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
    )


def run_worker() -> None:
    from task_api.celery_app import celery_app

    celery_app.worker_main(["worker", "--loglevel=info"])


def main() -> None:
    settings = get_settings()

    if settings.run_mode == RunMode.REST:
        run_rest_api()
    elif settings.run_mode == RunMode.WORKER:
        run_worker()
    else:
        print(f"Unknown run mode: {settings.run_mode}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
