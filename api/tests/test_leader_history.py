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


def create_evaluation(leader_id: int, employee_id: int, answers=FULL_ANSWERS):
    return client.post(
        f"/employees/{employee_id}/evaluations",
        json={"leader_id": leader_id, "answers": answers},
    )


def test_leader_history_lists_own_evaluations(clean_evaluations):
    """David (4) avalia Henry (8) e James (10, indireto). Ambas aparecem
    no histórico do David."""
    create_evaluation(leader_id=4, employee_id=8)
    create_evaluation(leader_id=4, employee_id=10)

    response = client.get("/employees/4/evaluations/given?viewer_id=4")

    assert response.status_code == 200
    employee_ids = {entry["employee_id"] for entry in response.json()}
    assert employee_ids == {8, 10}


def test_leader_history_rejects_unrelated_viewer(clean_evaluations):
    response = client.get("/employees/4/evaluations/given?viewer_id=3")
    assert response.status_code == 403


def test_leader_history_excludes_other_leaders(clean_evaluations):
    """Avaliação feita pelo Henry (8) não aparece no histórico do David (4),
    mesmo que Henry seja subordinado do David."""
    create_evaluation(leader_id=8, employee_id=10)

    response = client.get("/employees/4/evaluations/given?viewer_id=4")

    assert response.status_code == 200
    assert response.json() == []


def test_leader_history_empty_when_no_evaluations(clean_evaluations):
    response = client.get("/employees/12/evaluations/given?viewer_id=12")
    assert response.status_code == 200
    assert response.json() == []


def test_leader_history_404_for_nonexistent_leader(clean_evaluations):
    response = client.get("/employees/9999/evaluations/given?viewer_id=1")
    assert response.status_code == 404
