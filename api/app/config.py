""" lê DATABASE_URL do .env via Pydantic Settings"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str

    class Config:
        env_file = ".env"


settings = Settings()