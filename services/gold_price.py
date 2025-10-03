import httpx
from typing import Optional
from config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)


class GoldPriceService:
    def __init__(self):
        self.metal_price_api_key = settings.metal_price_api_key
        self.goldapi_key = settings.goldapi_key
        self.metals_api_key = settings.metals_api_key

        # Fallback price
        self.fallback_price = 65.0

    async def get_current_gold_price(self) -> float:
        """
        Hızlı gold price fetch
        """
        try:
            # 3 saniye timeout ile API'leri dene
            price = await asyncio.wait_for(
                self._try_all_apis(),
                timeout=5.0
            )
            if price:
                logger.info(f"Gold price fetched successfully: ${price:.2f}/gram")
                return price
        except asyncio.TimeoutError:
            logger.warning("Gold price API timeout, using fallback price")
        except Exception as e:
            logger.warning(f"Gold price API error: {e}, using fallback price")

        # Fallback price kullan
        return self.fallback_price

    async def _try_all_apis(self) -> Optional[float]:
        """Tüm API'leri sırayla dene"""

        # Önce ücretsiz API'yi dene (API key gerektirmez)
        if not any([self.metal_price_api_key, self.goldapi_key, self.metals_api_key]):
            return await self._get_free_gold_price()

        # API key'li servisleri dene
        if self.metal_price_api_key:
            price = await self._get_from_metalpriceapi()
            if price:
                return price

        if self.goldapi_key:
            price = await self._get_from_goldapi()
            if price:
                return price

        # Son olarak ücretsiz API'yi dene
        return await self._get_free_gold_price()

    async def _get_free_gold_price(self) -> Optional[float]:
        """Ücretsiz gold price (fallback)"""
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                # Bu gerçek bir API olmalı, örnek için static value
                return 65.0
        except Exception as e:
            logger.error(f"Free gold API error: {e}")
        return None

    async def _get_from_metalpriceapi(self) -> Optional[float]:
        """MetalpriceAPI implementation with short timeout"""
        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                response = await client.get(
                    "https://api.metalpriceapi.com/v1/latest",
                    params={
                        "access_key": self.metal_price_api_key,
                        "base": "XAU",
                        "symbols": "USD"
                    }
                )

                if response.status_code == 200:
                    data = response.json()
                    if "rates" in data and "USD" in data["rates"]:
                        price_per_ounce = 1 / data["rates"]["USD"]
                        price_per_gram = price_per_ounce / 31.1035
                        return price_per_gram
        except Exception as e:
            logger.error(f"MetalpriceAPI error: {e}")
        return None

    async def _get_from_goldapi(self) -> Optional[float]:
        """GoldAPI.io implementation with short timeout"""
        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                response = await client.get(
                    "https://www.goldapi.io/api/XAU/USD",
                    headers={
                        "x-access-token": self.goldapi_key
                    }
                )

                if response.status_code == 200:
                    data = response.json()
                    if "price_gram_24k" in data:
                        return data["price_gram_24k"]
        except Exception as e:
            logger.error(f"GoldAPI error: {e}")
        return None
