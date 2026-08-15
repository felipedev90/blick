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
    parent_id: int


class TeamMemberEvaluationOut(BaseModel):
    """Membro do time com a avaliação vigente, quando houver."""

    id: int
    name: str
    position_name: str
    depth: int
    parent_id: int
    evaluation_id: int | None
    evaluation_leader_id: int | None
    evaluation_leader_name: str | None
    week_key: str | None
    weighted_score: float | None
