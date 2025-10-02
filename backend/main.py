from fastapi import FastAPI, HTTPException, Query
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import json
from typing import List, Optional
from models.product import Product, ProductResponse, ProductImages
from services.gold_price import GoldPriceService
from config import settings
import logging
import os

# Logging configuration
logging.basicConfig(level=logging.INFO if settings.debug else logging.WARNING)
logger = logging.getLogger(__name__)

# FastAPI app with settings
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    debug=settings.debug
)

# CORS configuration - MUTLAKA İLK SIRADA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production'da settings.allowed_origins_list kullan
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files için frontend klasörünü serve et
if os.path.exists("../frontend"):
    app.mount("/static", StaticFiles(directory="../frontend"), name="static")

# Initialize services
gold_service = GoldPriceService()

# Load product data
try:
    with open("data/products.json", "r", encoding="utf-8") as f:
        products_data = json.load(f)
    logger.info("Product data loaded successfully")
except Exception as e:
    logger.error(f"Failed to load product data: {e}")
    products_data = []


def calculate_price(popularity_score: float, weight: float, gold_price: float) -> float:
    """
    Calculate product price using the formula: (popularityScore + 1) * weight * goldPrice
    popularityScore is in 0-1 range, so we convert to percentage first
    """
    popularity_percentage = popularity_score * 100  # Convert 0.85 -> 85
    return (popularity_percentage + 1) * weight * gold_price


def convert_popularity_to_5_scale(popularity_score: float) -> float:
    """Convert popularity 0-1 range to 5-point scale with 1 decimal place"""
    return round(popularity_score * 5, 1)  # 0.85 -> 4.3


def convert_popularity_to_percentage(popularity_score: float) -> float:
    """Convert popularity 0-1 range to percentage"""
    return round(popularity_score * 100, 1)  # 0.85 -> 85.0


@app.on_event("startup")
async def startup_event():
    """Application startup event"""
    logger.info(f"Starting {settings.api_title} v{settings.api_version}")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info(f"CORS enabled for all origins")


@app.get("/")
async def root():
    """API ana sayfası"""
    logger.info("Root endpoint called")
    return {
        "title": settings.api_title,
        "version": settings.api_version,
        "status": "running",
        "cors": "enabled",
        "data_format": {
            "popularity_score": "0-1 range (0.85 = 85%)",
            "weight": "grams (decimal)",
            "images": "object with yellow, rose, white keys"
        },
        "endpoints": {
            "frontend": "http://localhost:8000/static/index.html",
            "docs": "http://localhost:8000/docs",
            "products": "http://localhost:8000/api/products",
            "gold_price": "http://localhost:8000/api/gold-price"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": "2025-10-02"}


@app.get("/api/test")
async def test_cors():
    """CORS test endpoint"""
    return {"cors": "working", "message": "CORS is configured correctly"}


@app.get("/api/products", response_model=List[ProductResponse])
async def get_products(
        min_price: Optional[float] = Query(None, description="Minimum price filter"),
        max_price: Optional[float] = Query(None, description="Maximum price filter"),
        min_popularity: Optional[float] = Query(None, description="Minimum popularity percentage (0-100)"),
        max_popularity: Optional[float] = Query(None, description="Maximum popularity percentage (0-100)")
):
    """Get all products with optional filtering"""
    logger.info("Products endpoint called")

    try:
        # Get current gold price
        gold_price = await gold_service.get_current_gold_price()
        logger.info(f"Current gold price: ${gold_price:.2f}/gram")

        products = []
        for product_data in products_data:
            # Calculate price
            price = calculate_price(
                product_data["popularityScore"],
                product_data["weight"],
                gold_price
            )

            # Convert popularity for filtering (0-1 -> 0-100)
            popularity_percentage = convert_popularity_to_percentage(product_data["popularityScore"])

            # Apply filters
            if min_price is not None and price < min_price:
                continue
            if max_price is not None and price > max_price:
                continue
            if min_popularity is not None and popularity_percentage < min_popularity:
                continue
            if max_popularity is not None and popularity_percentage > max_popularity:
                continue

            # Create product response
            product_response = ProductResponse(
                id=product_data["id"],
                name=product_data["name"],
                popularityScore=product_data["popularityScore"],  # Keep original 0-1 range
                weight=product_data["weight"],
                images=ProductImages(**product_data["images"]),
                price=round(price, 2),
                popularity_out_of_5=convert_popularity_to_5_scale(product_data["popularityScore"]),
                popularity_percentage=popularity_percentage
            )
            products.append(product_response)

        logger.info(f"Returning {len(products)} products")
        return products

    except Exception as e:
        logger.error(f"Error getting products: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int):
    """Get a specific product by ID"""
    try:
        # Find product
        product_data = next((p for p in products_data if p["id"] == product_id), None)
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")

        # Get current gold price and calculate
        gold_price = await gold_service.get_current_gold_price()
        price = calculate_price(
            product_data["popularityScore"],
            product_data["weight"],
            gold_price
        )

        return ProductResponse(
            id=product_data["id"],
            name=product_data["name"],
            popularityScore=product_data["popularityScore"],
            weight=product_data["weight"],
            images=ProductImages(**product_data["images"]),
            price=round(price, 2),
            popularity_out_of_5=convert_popularity_to_5_scale(product_data["popularityScore"]),
            popularity_percentage=convert_popularity_to_percentage(product_data["popularityScore"])
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting product {product_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/gold-price")
async def get_gold_price():
    """Get current gold price per gram"""
    try:
        price = await gold_service.get_current_gold_price()
        return {
            "gold_price_per_gram_usd": price,
            "last_updated": "real-time",
            "source": "multiple APIs with fallback"
        }
    except Exception as e:
        logger.error(f"Error getting gold price: {e}")
        raise HTTPException(status_code=500, detail="Failed to get gold price")



port = int(os.getenv("PORT", 8000))
host = os.getenv("HOST", "0.0.0.0")

if __name__ == "__main__":
    import uvicorn

    logger.info("Starting server...")
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=False
    )
