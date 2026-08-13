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