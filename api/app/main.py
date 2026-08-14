"""Endpoint /health, faz um SELECT 1 no banco pra testar a conexão."""

from fastapi import FastAPI

from app.core.exception_handlers import register_exception_handlers
from app.database import get_connection
from app.routers.employees import router as employees_router
from app.routers.evaluations import router as evaluations_router

app = FastAPI(title="Blick API")
register_exception_handlers(app)
app.include_router(employees_router)
app.include_router(evaluations_router)


@app.get("/health")
def health() -> dict[str, str]:
    with get_connection() as conn:
        conn.execute("SELECT 1")
    return {"status": "ok"}