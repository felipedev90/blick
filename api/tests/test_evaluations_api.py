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


def test_create_evaluation_succeeds(clean_evaluations):
    """Frank (6) é líder direto de Olivia (15)."""
    response = create_evaluation(leader_id=6, employee_id=15)
    assert response.status_code == 201
    assert "id" in response.json()


def test_weekly_constraint_blocks_second_evaluation(clean_evaluations):
    """Mesmo par líder-funcionário não pode ser avaliado duas vezes na mesma semana."""
    create_evaluation(leader_id=6, employee_id=15)
    response = create_evaluation(leader_id=6, employee_id=15)
    assert response.status_code == 409


def test_self_evaluation_is_rejected(clean_evaluations):
    response = create_evaluation(leader_id=15, employee_id=15)
    assert response.status_code == 403


def test_non_subordinate_evaluation_is_rejected(clean_evaluations):
    """Samuel (19, Finanças) não lidera Olivia (15, QA)."""
    response = create_evaluation(leader_id=19, employee_id=15)
    assert response.status_code == 403


def test_incomplete_answers_are_rejected(clean_evaluations):
    response = create_evaluation(leader_id=6, employee_id=15, answers=[FULL_ANSWERS[0]])
    assert response.status_code == 422


def test_employee_not_found_returns_404(clean_evaluations):
    response = create_evaluation(leader_id=6, employee_id=9999)
    assert response.status_code == 404


def test_current_evaluation_prioritizes_top_of_hierarchy(clean_evaluations):
    """Alice (1, CEO) e Frank (6) avaliam Olivia (15) na mesma semana.
    Frank é o líder direto, Alice está mais alta na hierarquia geral,
    então a avaliação vigente precisa ser a da Alice."""
    create_evaluation(leader_id=6, employee_id=15)
    create_evaluation(leader_id=1, employee_id=15)

    response = client.get("/employees/15/evaluations/current?viewer_id=6")

    assert response.status_code == 200
    assert response.json()["leader_id"] == 1


def test_current_evaluation_404_when_none_exists(clean_evaluations):
    response = client.get("/employees/15/evaluations/current?viewer_id=6")
    assert response.status_code == 404


def test_history_lists_all_evaluations(clean_evaluations):
    create_evaluation(leader_id=6, employee_id=15)

    response = client.get("/employees/15/evaluations/history?viewer_id=6")

    assert response.status_code == 200
    assert len(response.json()) == 1


def test_get_team_404_for_nonexistent_leader(clean_evaluations):
    response = client.get("/employees/9999/team")
    assert response.status_code == 404


def test_indirect_leader_can_evaluate_even_if_subordinate_already_did(
    clean_evaluations,
):
    """Henry (8) é líder direto de James (10) e avalia ele primeiro.
    David (4), avô do James (líder do Henry) e líder indireto do James,
    também pode avaliar, mesmo o próprio subordinado (Henry) já tendo
    avaliado dentro do período. As duas avaliações devem coexistir."""
    henry_response = create_evaluation(leader_id=8, employee_id=10)
    assert henry_response.status_code == 201

    david_response = create_evaluation(leader_id=4, employee_id=10)
    assert david_response.status_code == 201

    assert henry_response.json()["id"] != david_response.json()["id"]

    history_response = client.get("/employees/10/evaluations/history?viewer_id=4")
    assert history_response.status_code == 200
    leader_ids = {entry["leader_id"] for entry in history_response.json()}
    assert leader_ids == {8, 4}
