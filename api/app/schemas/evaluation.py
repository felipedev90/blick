from pydantic import BaseModel, Field


class AnswerIn(BaseModel):
    """Uma resposta individual dentro de uma avaliação."""
    question_key: str
    score: int = Field(ge=1, le=4)


class EvaluationIn(BaseModel):
    """Corpo da requisição pra criar uma avaliação."""
    leader_id: int
    answers: list[AnswerIn]