from psycopg import Connection


def is_subordinate(conn: Connection, leader_id: int, employee_id: int) -> bool:
    """Verifica se employee_id está na hierarquia de subordinados de leader_id,
    direta ou indiretamente."""
    query = """
        WITH RECURSIVE subordinates AS (
            SELECT lead_id
            FROM leader_lead
            WHERE leader_id = %(leader_id)s

            UNION ALL

            SELECT ll.lead_id
            FROM leader_lead ll
            INNER JOIN subordinates s ON ll.leader_id = s.lead_id
        )
        SELECT 1 FROM subordinates WHERE lead_id = %(employee_id)s
    """
    result = conn.execute(
        query, {"leader_id": leader_id, "employee_id": employee_id}
    ).fetchone()
    return result is not None

class SelfEvaluationError(Exception):
    """Levantado quando um líder tenta avaliar a si mesmo."""

class NotSubordinateError(Exception):
    """Levantado quando o avaliado não está na hierarquia do líder."""


def ensure_can_evaluate(conn: Connection, leader_id: int, employee_id: int) -> None:
    """Valida se leader_id pode avaliar employee_id. Levanta exceção se não puder."""
    if leader_id == employee_id:
        raise SelfEvaluationError()
    if not is_subordinate(conn, leader_id, employee_id):
        raise NotSubordinateError()