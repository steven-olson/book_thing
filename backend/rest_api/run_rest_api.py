from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rest_api.routers import health, redis_debug

app = FastAPI(
    title="API",
    description="FastAPI Backend",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(redis_debug.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the API"}
