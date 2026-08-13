""" Endpoint /health, faz um SELECT 1 no banco pra testar a conexão """

from fastapi import FastAPI

from app.database import get_connection
from app.routers.employees import router as employees_router

app = FastAPI(title="Blick API")
app.include_router(employees_router)

@app.get("/health")
def health() -> dict[str, str]:
    with get_connection() as conn:
        conn.execute("SELECT 1")
    return {"status": "ok"}