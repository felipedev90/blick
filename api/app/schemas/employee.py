from pydantic import BaseModel


class EmployeeOut(BaseModel):
    """Formato de funcionário devolvido pela API."""
    id: int
    name: str
    position_name: str