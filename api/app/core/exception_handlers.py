from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.hierarchy import NotSubordinateError, SelfEvaluationError


def register_exception_handlers(app: FastAPI) -> None:
    """Centraliza a tradução de exceções de domínio em respostas HTTP."""

    @app.exception_handler(SelfEvaluationError)
    def handle_self_evaluation(request: Request, exc: SelfEvaluationError) -> JSONResponse:
        return JSONResponse(status_code=403, content={"detail": "Não é possível se autoavaliar."})

    @app.exception_handler(NotSubordinateError)
    def handle_not_subordinate(request: Request, exc: NotSubordinateError) -> JSONResponse:
        return JSONResponse(status_code=403, content={"detail": "Funcionário fora da sua hierarquia."})