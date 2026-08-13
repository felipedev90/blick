from pydantic import BaseModel, Field


class AnswerIn(BaseModel):
    """Uma resposta individual dentro de uma avaliação."""
    question_key: str
    score: int = Field(ge=1, le=4)


class EvaluationIn(BaseModel):
    """Corpo da requisição pra criar uma avaliação."""
    leader_id: int
    answers: list[AnswerIn]
    
    
class EvaluationSummaryOut(BaseModel):
    """Avaliação vigente de um funcionário, já considerando a maior hierarquia."""
    id: int
    leader_id: int
    leader_name: str
    week_key: str
    weighted_score: float
    answers: list[AnswerIn]


class EvaluationHistoryOut(BaseModel):
    """Uma entrada no histórico de avaliações de um funcionário."""
    id: int
    leader_id: int
    leader_name: str
    week_key: str
    weighted_score: float