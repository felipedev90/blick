from fastapi import APIRouter, HTTPException, status
from psycopg.errors import UniqueViolation

from app.core.hierarchy import (
    NotSubordinateError,
    SelfEvaluationError,
    ensure_can_evaluate,
)
from app.core.questions import QUESTION_WEIGHTS
from app.database import get_connection
from app.schemas.evaluation import EvaluationIn

router = APIRouter(prefix="/employees", tags=["evaluations"])


@router.post("/{employee_id}/evaluations", status_code=status.HTTP_201_CREATED)
def create_evaluation(employee_id: int, payload: EvaluationIn) -> dict[str, int]:
    """Cria uma avaliação. Falha se o avaliado não for subordinado do líder,
    se faltar ou sobrar pergunta, ou se já existir avaliação desse par nesta semana."""
    answered_keys = {a.question_key for a in payload.answers}
    if answered_keys != set(QUESTION_WEIGHTS.keys()):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Todas as perguntas precisam ser respondidas, sem repetição.",
        )

    with get_connection() as conn:
        try:
            ensure_can_evaluate(conn, payload.leader_id, employee_id)
        except SelfEvaluationError:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Não é possível se autoavaliar.")
        except NotSubordinateError:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Funcionário fora da sua hierarquia.")

        try:
            evaluation_id = conn.execute(
                """
                INSERT INTO evaluation (leader_id, employee_id, week_key)
                VALUES (%(leader_id)s, %(employee_id)s, TO_CHAR(now(), 'IYYY-IW'))
                RETURNING id
                """,
                {"leader_id": payload.leader_id, "employee_id": employee_id},
            ).fetchone()["id"]

            for answer in payload.answers:
                conn.execute(
                    """
                    INSERT INTO evaluation_answer (evaluation_id, question_key, score)
                    VALUES (%(evaluation_id)s, %(question_key)s, %(score)s)
                    """,
                    {
                        "evaluation_id": evaluation_id,
                        "question_key": answer.question_key,
                        "score": answer.score,
                    },
                )
        except UniqueViolation:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "Este funcionário já foi avaliado por você nesta semana.",
            )

    return {"id": evaluation_id}