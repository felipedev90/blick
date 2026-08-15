from fastapi import APIRouter

from app.core.hierarchy import ensure_employee_exists
from app.core.questions import QUESTION_WEIGHTS
from app.database import get_connection
from app.schemas.employee import (
    EmployeeOut,
    TeamMemberEvaluationOut,
    TeamMemberOut,
)

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeOut])
def list_employees() -> list[EmployeeOut]:
    """Lista todos os funcionários, usada no seletor de líder."""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, position_name FROM employee ORDER BY name"
        ).fetchall()
    return rows


@router.get("/{leader_id}/team", response_model=list[TeamMemberOut])
def get_team(leader_id: int) -> list[TeamMemberOut]:
    """Retorna todos os liderados diretos e indiretos de um líder."""
    with get_connection() as conn:
        ensure_employee_exists(conn, leader_id)
        query = """
            WITH RECURSIVE subordinates AS (
                SELECT lead_id, leader_id AS parent_id, 1 AS depth
                FROM leader_lead
                WHERE leader_id = %(leader_id)s

                UNION ALL

                SELECT ll.lead_id, ll.leader_id AS parent_id, s.depth + 1
                FROM leader_lead ll
                INNER JOIN subordinates s ON ll.leader_id = s.lead_id
            )
            SELECT e.id, e.name, e.position_name, s.depth, s.parent_id
            FROM subordinates s
            INNER JOIN employee e ON e.id = s.lead_id
            ORDER BY s.depth, e.name
        """
        rows = conn.execute(query, {"leader_id": leader_id}).fetchall()
    return rows


@router.get(
    "/{leader_id}/team/evaluations",
    response_model=list[TeamMemberEvaluationOut],
)
def get_team_evaluations(leader_id: int) -> list[TeamMemberEvaluationOut]:
    """Time completo do líder com a avaliação vigente de cada membro na semana atual."""
    with get_connection() as conn:
        ensure_employee_exists(conn, leader_id)
        query = """
            WITH RECURSIVE subordinates AS (
                SELECT lead_id, leader_id AS parent_id, 1 AS depth
                FROM leader_lead
                WHERE leader_id = %(leader_id)s

                UNION ALL

                SELECT ll.lead_id, ll.leader_id AS parent_id, s.depth + 1
                FROM leader_lead ll
                INNER JOIN subordinates s ON ll.leader_id = s.lead_id
            ),
            depth_tree AS (
                SELECT e.id AS employee_id, 0 AS depth_from_top
                FROM employee e
                WHERE NOT EXISTS (
                    SELECT 1 FROM leader_lead ll WHERE ll.lead_id = e.id
                )

                UNION ALL

                SELECT ll.lead_id, dt.depth_from_top + 1
                FROM leader_lead ll
                INNER JOIN depth_tree dt ON ll.leader_id = dt.employee_id
            ),
            weights (question_key, weight) AS (
                SELECT * FROM unnest(
                    %(question_keys)s::text[],
                    %(weight_values)s::int[]
                )
            ),
            scored AS (
                SELECT
                    ev.id AS evaluation_id,
                    ROUND(
                        (SUM(ans.score * w.weight)::numeric
                         / (4 * SUM(w.weight))) * 100,
                        2
                    ) AS weighted_score
                FROM evaluation ev
                INNER JOIN evaluation_answer ans ON ans.evaluation_id = ev.id
                INNER JOIN weights w ON w.question_key = ans.question_key
                WHERE ev.week_key = TO_CHAR(CURRENT_DATE, 'IYYY-IW')
                GROUP BY ev.id
            ),
            current_week AS (
                SELECT DISTINCT ON (ev.employee_id)
                    ev.employee_id,
                    ev.id AS evaluation_id,
                    ev.leader_id,
                    ev.week_key,
                    sc.weighted_score
                FROM evaluation ev
                INNER JOIN depth_tree dt ON dt.employee_id = ev.leader_id
                INNER JOIN scored sc ON sc.evaluation_id = ev.id
                WHERE ev.week_key = TO_CHAR(CURRENT_DATE, 'IYYY-IW')
                ORDER BY ev.employee_id, dt.depth_from_top ASC, ev.id DESC
            )
            SELECT
                e.id,
                e.name,
                e.position_name,
                s.depth,
                s.parent_id,
                cw.evaluation_id,
                cw.leader_id AS evaluation_leader_id,
                leader.name AS evaluation_leader_name,
                cw.week_key,
                cw.weighted_score
            FROM subordinates s
            INNER JOIN employee e ON e.id = s.lead_id
            LEFT JOIN current_week cw ON cw.employee_id = e.id
            LEFT JOIN employee leader ON leader.id = cw.leader_id
            ORDER BY s.depth, e.name
        """
        rows = conn.execute(
            query,
            {
                "leader_id": leader_id,
                "question_keys": list(QUESTION_WEIGHTS.keys()),
                "weight_values": list(QUESTION_WEIGHTS.values()),
            },
        ).fetchall()
    return rows
