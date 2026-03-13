from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:123456@localhost:5432/mb_assignment"
    environment: str = "development"

    model_config = ConfigDict(env_file=".env")


settings = Settings()
