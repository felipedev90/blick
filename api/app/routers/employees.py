from fastapi import APIRouter

from app.database import get_connection
from app.schemas.employee import EmployeeOut, TeamMemberOut

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
    query = """
        WITH RECURSIVE subordinates AS (
            SELECT lead_id, 1 AS depth
            FROM leader_lead
            WHERE leader_id = %(leader_id)s

            UNION ALL

            SELECT ll.lead_id, s.depth + 1
            FROM leader_lead ll
            INNER JOIN subordinates s ON ll.leader_id = s.lead_id
        )
        SELECT e.id, e.name, e.position_name, s.depth
        FROM subordinates s
        INNER JOIN employee e ON e.id = s.lead_id
        ORDER BY s.depth, e.name
    """
    with get_connection() as conn:
        rows = conn.execute(query, {"leader_id": leader_id}).fetchall()
    return rows
