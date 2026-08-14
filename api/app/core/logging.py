import logging


def configure_logging() -> None:
    """Configura o formato padrão de log da aplicação."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )