from fastapi import APIRouter, HTTPException, status
from psycopg.errors import UniqueViolation

from app.core.hierarchy import (
    NotSubordinateError,
    SelfEvaluationError,
    ensure_can_evaluate,
    get_depth_from_top
)
from app.core.questions import QUESTION_WEIGHTS, calculate_weighted_score
from app.database import get_connection
from app.schemas.evaluation import EvaluationIn, EvaluationHistoryOut, EvaluationSummaryOut

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

@router.get("/{employee_id}/evaluations/current", response_model=EvaluationSummaryOut | None)
def get_current_evaluation(employee_id: int, viewer_id: int):
    """Retorna a avaliação vigente da semana atual, priorizando o líder
    mais próximo do topo da hierarquia quando há mais de uma."""
    with get_connection() as conn:

        candidates = conn.execute(
            """
            SELECT e.id, e.leader_id, emp.name AS leader_name, e.week_key
            FROM evaluation e
            INNER JOIN employee emp ON emp.id = e.leader_id
            WHERE e.employee_id = %(employee_id)s
              AND e.week_key = TO_CHAR(now(), 'IYYY-IW')
            """,
            {"employee_id": employee_id},
        ).fetchall()

        if not candidates:
            return None

        ranked = sorted(
            candidates,
            key=lambda c: get_depth_from_top(conn, c["leader_id"]),
        )
        top = ranked[0]

        answers = conn.execute(
            "SELECT question_key, score FROM evaluation_answer WHERE evaluation_id = %(id)s",
            {"id": top["id"]},
        ).fetchall()

        return EvaluationSummaryOut(
            id=top["id"],
            leader_id=top["leader_id"],
            leader_name=top["leader_name"],
            week_key=top["week_key"],
            weighted_score=calculate_weighted_score(answers),
            answers=answers,
        )


@router.get("/{employee_id}/evaluations/history", response_model=list[EvaluationHistoryOut])
def get_evaluation_history(employee_id: int):
    """Lista todas as avaliações já recebidas por esse funcionário, mais recentes primeiro."""
    with get_connection() as conn:
        rows = conn.execute(
            """
            SELECT e.id, e.leader_id, emp.name AS leader_name, e.week_key
            FROM evaluation e
            INNER JOIN employee emp ON emp.id = e.leader_id
            WHERE e.employee_id = %(employee_id)s
            ORDER BY e.created_at DESC
            """,
            {"employee_id": employee_id},
        ).fetchall()

        result = []
        for row in rows:
            answers = conn.execute(
                "SELECT question_key, score FROM evaluation_answer WHERE evaluation_id = %(id)s",
                {"id": row["id"]},
            ).fetchall()
            result.append(
                EvaluationHistoryOut(
                    id=row["id"],
                    leader_id=row["leader_id"],
                    leader_name=row["leader_name"],
                    week_key=row["week_key"],
                    weighted_score=calculate_weighted_score(answers),
                )
            )
        return result