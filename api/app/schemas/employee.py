from pydantic import BaseModel


class EmployeeOut(BaseModel):
    """Formato de funcionário devolvido pela API."""

    id: int
    name: str
    position_name: str


class TeamMemberOut(BaseModel):
    """Funcionário liderado, com a distância hierárquica até o líder consultado."""

    id: int
    name: str
    position_name: str
    depth: int
