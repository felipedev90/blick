import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.exceptions import (
    EmployeeNotFoundError,
    NoCurrentEvaluationError,
    NotSubordinateError,
    SelfEvaluationError,
)

logger = logging.getLogger(__name__)


def register_exception_handlers(app: FastAPI) -> None:
    """Centraliza a tradução de exceções de domínio em respostas HTTP."""

    @app.exception_handler(SelfEvaluationError)
    def handle_self_evaluation(request: Request, exc: SelfEvaluationError) -> JSONResponse:
        return JSONResponse(status_code=403, content={"detail": "Não é possível se autoavaliar."})

    @app.exception_handler(NotSubordinateError)
    def handle_not_subordinate(request: Request, exc: NotSubordinateError) -> JSONResponse:
        return JSONResponse(status_code=403, content={"detail": "Funcionário fora da sua hierarquia."})
    
    @app.exception_handler(EmployeeNotFoundError)
    def handle_employee_not_found(request: Request, exc: EmployeeNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": "Funcionário não encontrado."})
        
    @app.exception_handler(NoCurrentEvaluationError)
    def handle_no_current_evaluation(request: Request, exc: NoCurrentEvaluationError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": "Nenhuma avaliação encontrada para esta semana."})
    
    @app.exception_handler(Exception)
    def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
        """Captura qualquer erro não previsto, evitando vazar stack trace ao cliente."""
        logger.exception("Erro não tratado em %s %s", request.method, request.url.path)
        return JSONResponse(
            status_code=500,
            content={"detail": "Erro interno do servidor."},
        )