from fastapi import APIRouter

from app.database import get_connection
from app.schemas.employee import EmployeeOut

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeOut])
def list_employees() -> list[EmployeeOut]:
    """Lista todos os funcionários, usada no seletor de líder."""
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT id, name, position_name FROM employee ORDER BY name"
        ).fetchall()
    return rows