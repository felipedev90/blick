import pytest

from app.core.hierarchy import (
    NotSubordinateError,
    SelfEvaluationError,
    ensure_can_evaluate,
    is_subordinate,
)


def test_direct_subordinate_is_allowed(conn):
    """David (4) é líder direto de Henry (8)."""
    assert is_subordinate(conn, leader_id=4, employee_id=8) is True


def test_indirect_subordinate_is_allowed(conn):
    """Bob (2) é líder indireto de James (10), via David e Henry."""
    assert is_subordinate(conn, leader_id=2, employee_id=10) is True


def test_peer_is_not_subordinate(conn):
    """Carol (3) não lidera Henry (8), são de áreas diferentes."""
    assert is_subordinate(conn, leader_id=3, employee_id=8) is False


def test_self_evaluation_is_blocked(conn):
    with pytest.raises(SelfEvaluationError):
        ensure_can_evaluate(conn, leader_id=4, employee_id=4)


def test_non_subordinate_evaluation_is_blocked(conn):
    with pytest.raises(NotSubordinateError):
        ensure_can_evaluate(conn, leader_id=3, employee_id=8)