import pytest

from app.database import get_connection


@pytest.fixture
def conn():
    """Conexão de banco usada pelos testes."""
    with get_connection() as connection:
        yield connection