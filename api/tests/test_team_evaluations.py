from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

FULL_ANSWERS = [
    {"question_key": "delivery_results", "score": 4},
    {"question_key": "execution_quality", "score": 3},
    {"question_key": "learning_development", "score": 4},
    {"question_key": "problem_solving", "score": 3},
    {"question_key": "collaboration_leadership", "score": 4},
    {"question_key": "strategic_vision", "score": 3},
]

LOW_ANSWERS = [
    {"question_key": "delivery_results", "score": 1},
    {"question_key": "execution_quality", "score": 1},
    {"question_key": "learning_development", "score": 1},
    {"question_key": "problem_solving", "score": 1},
    {"question_key": "collaboration_leadership", "score": 1},
    {"question_key": "strategic_vision", "score": 1},
]


def create_evaluation(leader_id: int, employee_id: int, answers=FULL_ANSWERS):
    return client.post(
        f"/employees/{employee_id}/evaluations",
        json={"leader_id": leader_id, "answers": answers},
    )


def test_team_evaluations_prioritizes_top_of_hierarchy(clean_evaluations):
    """Henry (8) avalia James (10) com notas baixas.
    David (4), líder de Henry e mais próximo do topo, avalia James também, com notas altas.
    No time do Bob (2), a avaliação vigente de James precisa ser a do David."""
    create_evaluation(leader_id=8, employee_id=10, answers=LOW_ANSWERS)
    create_evaluation(leader_id=4, employee_id=10, answers=FULL_ANSWERS)

    response = client.get("/employees/2/team/evaluations")

    assert response.status_code == 200
    james = next(member for member in response.json() if member["id"] == 10)
    assert james["evaluation_leader_id"] == 4
    assert james["weighted_score"] == 88.75


def test_team_evaluations_includes_pending_members(clean_evaluations):
    """Funcionário sem avaliação nesta semana aparece na lista com campos
    nulos, não é omitido da resposta."""
    response = client.get("/employees/2/team/evaluations")

    assert response.status_code == 200
    grace = next(member for member in response.json() if member["id"] == 7)
    assert grace["evaluation_id"] is None
    assert grace["weighted_score"] is None


def test_team_evaluations_scoped_to_subordinates(clean_evaluations):
    """O time do Frank (6) não inclui alguém fora da própria hierarquia dele,
    mesmo que essa pessoa tenha avaliação vigente em outro time."""
    create_evaluation(leader_id=2, employee_id=8, answers=FULL_ANSWERS)

    response = client.get("/employees/6/team/evaluations")

    assert response.status_code == 200
    ids = [member["id"] for member in response.json()]
    assert 8 not in ids


def test_team_evaluations_404_for_nonexistent_leader(clean_evaluations):
    response = client.get("/employees/9999/team/evaluations")
    assert response.status_code == 404


def test_team_evaluations_empty_when_no_subordinates(clean_evaluations):
    """Funcionário sem ninguém abaixo na hierarquia recebe lista vazia,
    não erro."""
    response = client.get("/employees/11/team/evaluations")

    assert response.status_code == 200
    assert response.json() == []
