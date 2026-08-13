"""Perguntas da avaliação e seus pesos. Fonte única de verdade,
usada tanto pra validar respostas quanto pra calcular a nota final."""

QUESTION_WEIGHTS: dict[str, int] = {
    "delivery_results": 25,
    "execution_quality": 20,
    "learning_development": 20,
    "problem_solving": 15,
    "collaboration_leadership": 10,
    "strategic_vision": 10,
}

def calculate_weighted_score(answers: list[dict]) -> float:
    """Calcula a nota final ponderada a partir das respostas."""
    total = sum(a["score"] * QUESTION_WEIGHTS[a["question_key"]] for a in answers)
    max_possible = 4 * sum(QUESTION_WEIGHTS.values())
    return round((total / max_possible) * 100, 2)