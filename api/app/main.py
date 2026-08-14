import logging
import time

from fastapi import FastAPI, Request

from app.core.exception_handlers import register_exception_handlers
from app.core.logging import configure_logging
from app.database import get_connection
from app.routers.employees import router as employees_router
from app.routers.evaluations import router as evaluations_router

configure_logging()
logger = logging.getLogger(__name__)

app = FastAPI(title="Blick API")
register_exception_handlers(app)
app.include_router(employees_router)
app.include_router(evaluations_router)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Registra método, path, status e tempo de resposta de cada requisição."""
    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s -> %s (%.1fms)",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


@app.get("/health")
def health() -> dict[str, str]:
    with get_connection() as conn:
        conn.execute("SELECT 1")
    return {"status": "ok"}
