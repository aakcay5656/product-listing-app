from pydantic import BaseModel, ConfigDict
from typing import Dict


class ProductImages(BaseModel):
    yellow: str
    rose: str
    white: str


class Product(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    popularityScore: float
    weight: float
    images: ProductImages


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    popularityScore: float
    weight: float
    images: ProductImages
    price: float
    popularity_out_of_5: float
    popularity_percentage: float
