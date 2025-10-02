from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    # API Keys
    metal_price_api_key: str = ""
    goldapi_key: str = ""
    metals_api_key: str = ""

    # Application Settings
    debug: bool = False
    api_title: str = "Product Listing API"
    api_version: str = "1.0.0"

    # CORS Settings
    allowed_origins: str = "http://localhost:3000"

    # Database Settings
    database_url: str = "sqlite:///./products.db"

    # Server Settings
    host: str = "0.0.0.0"
    port: int = 8000

    # Pydantic v2 style configuration
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra='ignore'
    )

    @property
    def allowed_origins_list(self) -> List[str]:
        """CORS origins'i liste olarak döndür"""
        return [origin.strip() for origin in self.allowed_origins.split(",")]


# Global settings instance
settings = Settings()
