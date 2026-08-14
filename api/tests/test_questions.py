from app.core.questions import calculate_weighted_score


def test_max_score_is_100():
    answers = [
        {"question_key": "delivery_results", "score": 4},
        {"question_key": "execution_quality", "score": 4},
        {"question_key": "learning_development", "score": 4},
        {"question_key": "problem_solving", "score": 4},
        {"question_key": "collaboration_leadership", "score": 4},
        {"question_key": "strategic_vision", "score": 4},
    ]
    assert calculate_weighted_score(answers) == 100.0


def test_all_score_two_is_fifty():
    """Mesmo cenário validado manualmente na avaliação do Bob para o Henry."""
    answers = [
        {"question_key": "delivery_results", "score": 2},
        {"question_key": "execution_quality", "score": 2},
        {"question_key": "learning_development", "score": 2},
        {"question_key": "problem_solving", "score": 2},
        {"question_key": "collaboration_leadership", "score": 2},
        {"question_key": "strategic_vision", "score": 2},
    ]
    assert calculate_weighted_score(answers) == 50.0


def test_mixed_scores_matches_manual_validation():
    """Mesmo cenário validado manualmente na avaliação do David para o Henry."""
    answers = [
        {"question_key": "delivery_results", "score": 4},
        {"question_key": "execution_quality", "score": 3},
        {"question_key": "learning_development", "score": 4},
        {"question_key": "problem_solving", "score": 3},
        {"question_key": "collaboration_leadership", "score": 4},
        {"question_key": "strategic_vision", "score": 3},
    ]
    assert calculate_weighted_score(answers) == 88.75