import pytest

from app.database import get_connection

TEST_EMPLOYEE_IDS = (15, 18, 19)  # Olivia, Rachel, Samuel: reservados pros testes


@pytest.fixture
def conn():
    """Conexão de banco usada pelos testes."""
    with get_connection() as connection:
        yield connection


@pytest.fixture
def clean_evaluations(conn):
    """Remove avaliações dos funcionários reservados pra teste, antes e depois,
    pra suíte poder rodar quantas vezes for preciso sem esbarrar na constraint semanal."""
    def _clean():
        conn.execute(
            "DELETE FROM evaluation WHERE employee_id = ANY(%(ids)s)",
            {"ids": list(TEST_EMPLOYEE_IDS)},
        )
        conn.commit()

    _clean()
    yield
    _clean()