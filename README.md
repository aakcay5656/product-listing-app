# Product Listing Application

A modern product listing application with FastAPI backend and responsive frontend featuring engagement rings with dynamic pricing.

## Features

- **FastAPI Backend**: RESTful API with automatic documentation
- **Real-time Gold Pricing**: Dynamic price calculation based on current gold prices
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Carousel**: Touch/swipe support with smooth animations
- **Color Variants**: Dynamic image switching with color picker (Yellow, Rose, White Gold)
- **Advanced Filtering**: Price range and popularity filters
- **Custom Typography**: Avenir and Montserrat fonts
- **CORS Enabled**: Cross-origin resource sharing configured
- **Error Handling**: Graceful fallbacks with sample data

## Technology Stack

**Backend:**
- FastAPI (Python web framework)
- Pydantic (data validation)
- httpx (HTTP client for API calls)
- Uvicorn (ASGI server)

**Frontend:**
- Vanilla JavaScript (ES6+)
- CSS3 with custom fonts
- Responsive design
- Touch/swipe gestures

## Installation

### Prerequisites
- Python 3.8+
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd product-listing-app/backend
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Environment setup**
```bash
cp ../.env.example .env
# Edit .env file with your API keys (optional)
```

4. **Run the backend**
```bash
python main.py
```

Backend will be available at: http://localhost:8000

### Frontend Access

**Option 1: Via Backend (Recommended)**
- Open: http://localhost:8000/static/index.html

**Option 2: Separate Server**
```bash
cd frontend
python -m http.server 3000
# Open: http://localhost:3000
```

## API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **API Endpoints**:
  - `GET /api/products` - List all products with optional filtering
  - `GET /api/products/{id}` - Get specific product
  - `GET /api/gold-price` - Current gold price per gram

### Filtering Parameters
- `min_price` (float): Minimum price filter
- `max_price` (float): Maximum price filter  
- `min_popularity` (float): Minimum popularity percentage (0-100)
- `max_popularity` (float): Maximum popularity percentage (0-100)

## Configuration

### API Keys (Optional)

Get free API keys for real-time gold prices:
- **MetalpriceAPI**: https://metalpriceapi.com/ (100 requests/month)
- **GoldAPI**: https://www.goldapi.io/ (1000 requests/month)

### Environment Variables

```env
METAL_PRICE_API_KEY=your_key_here
DEBUG=True
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## Project Structure

```
product-listing-app/
├── backend/                 # FastAPI application
│   ├── main.py             # Main application file
│   ├── config.py           # Configuration settings
│   ├── models/             # Pydantic models
│   │   └── product.py      # Product data models
│   ├── services/           # Business logic
│   │   └── gold_price.py   # Gold price service
│   ├── data/               # JSON data files
│   │   └── products.json   # Product database
│   └── requirements.txt    # Python dependencies
├── frontend/               # Static frontend files
│   ├── index.html          # Main HTML file
│   ├── style.css           # Styles with custom fonts
│   ├── script.js           # JavaScript carousel logic
│   └── assets/             # Font files
│       └── fonts/
│           ├── avenir/     # Avenir font family
│           └── montserrat/ # Montserrat font family
└── README.md
```

## Typography

- **Product Titles**: Montserrat Medium 15px
- **Prices**: Montserrat Regular 15px
- **Ratings**: Avenir Book 14px
- **Main Heading**: Avenir Light 45px

## Deployment

### Render (Recommended)
1. Push code to GitHub
2. Connect repository to Render
3. Deploy automatically

### Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy with one click


## Product Data Format

```json
{
  "id": 1,
  "name": "Engagement Ring 1",
  "popularityScore": 0.85,
  "weight": 2.1,
  "images": {
    "yellow": "image_url",
    "rose": "image_url", 
    "white": "image_url"
  }
}
```

## Price Calculation

Price = (popularityScore * 100 + 1) * weight * goldPrice

Where:
- popularityScore: 0-1 range (0.85 = 85%)
- weight: grams (decimal values)
- goldPrice: current gold price per gram in USD

## Browser Support

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

---

# Ürün Listeleme Uygulaması

Dinamik fiyatlandırma özellikli nişan yüzükleri sunan FastAPI backend ve responsive frontend ile modern bir ürün listeleme uygulaması.

## Özellikler

- **FastAPI Backend**: Otomatik dokümantasyon ile RESTful API
- **Gerçek Zamanlı Altın Fiyatı**: Güncel altın fiyatlarına dayalı dinamik fiyat hesaplama
- **Responsive Tasarım**: Masaüstü, tablet ve mobil cihazlarda sorunsuz çalışma
- **İnteraktif Carousel**: Dokunma/kaydırma desteği ile akıcı animasyonlar
- **Renk Seçenekleri**: Renk seçici ile dinamik görsel değiştirme (Sarı, Pembe, Beyaz Altın)
- **Gelişmiş Filtreleme**: Fiyat aralığı ve popülerlik filtreleri
- **Özel Tipografi**: Avenir ve Montserrat fontları
- **CORS Desteği**: Cross-origin kaynak paylaşımı yapılandırılmış
- **Hata Yönetimi**: Örnek veriler ile zarif geri dönüşler

## Teknoloji Yığını

**Backend:**
- FastAPI (Python web framework)
- Pydantic (veri doğrulama)
- httpx (API çağrıları için HTTP istemci)
- Uvicorn (ASGI sunucu)

**Frontend:**
- Vanilla JavaScript (ES6+)
- Özel fontlar ile CSS3
- Responsive tasarım
- Dokunma/kaydırma hareketleri

## Kurulum

### Gereksinimler
- Python 3.8+
- Git

### Backend Kurulumu

1. **Repository'yi klonlayın**
```bash
git clone <repository-url>
cd product-listing-app/backend
```

2. **Bağımlılıkları yükleyin**
```bash
pip install -r requirements.txt
```

3. **Ortam ayarları**
```bash
cp ../.env.example .env
# .env dosyasını API anahtarlarınızla düzenleyin (opsiyonel)
```

4. **Backend'i çalıştırın**
```bash
python main.py
```

Backend şu adreste erişilebilir olacak: http://localhost:8000

### Frontend Erişimi

**Seçenek 1: Backend Üzerinden (Önerilen)**
- Açın: http://localhost:8000/static/index.html

**Seçenek 2: Ayrı Sunucu**
```bash
cd frontend
python -m http.server 3000
# Açın: http://localhost:3000
```

## API Dokümantasyonu

- **Swagger UI**: http://localhost:8000/docs
- **API Uç Noktaları**:
  - `GET /api/products` - Opsiyonel filtreleme ile tüm ürünleri listele
  - `GET /api/products/{id}` - Belirli ürünü getir
  - `GET /api/gold-price` - Gram başına güncel altın fiyatı

### Filtreleme Parametreleri
- `min_price` (float): Minimum fiyat filtresi
- `max_price` (float): Maksimum fiyat filtresi
- `min_popularity` (float): Minimum popülerlik yüzdesi (0-100)
- `max_popularity` (float): Maksimum popülerlik yüzdesi (0-100)

## Yapılandırma

### API Anahtarları (Opsiyonel)

Gerçek zamanlı altın fiyatları için ücretsiz API anahtarları alın:
- **MetalpriceAPI**: https://metalpriceapi.com/ (ayda 100 istek)
- **GoldAPI**: https://www.goldapi.io/ (ayda 1000 istek)

## Dağıtım

### Render (Önerilen)
1. Kodu GitHub'a gönderin
2. Repository'yi Render'a bağlayın
3. Otomatik olarak dağıtın

### Railway
1. GitHub repository'sini bağlayın
2. Ortam değişkenlerini ayarlayın
3. Tek tıkla dağıtın

## Ürün Veri Formatı

```json
{
  "id": 1,
  "name": "Engagement Ring 1",
  "popularityScore": 0.85,
  "weight": 2.1,
  "images": {
    "yellow": "image_url",
    "rose": "image_url", 
    "white": "image_url"
  }
}
```

## Fiyat Hesaplama

Fiyat = (popülerlikSkoru * 100 + 1) * ağırlık * altınFiyatı

Burada:
- popülerlikSkoru: 0-1 aralığı (0.85 = 85%)
- ağırlık: gram cinsinden (ondalık değerler)
- altınFiyatı: USD cinsinden gram başına güncel altın fiyatı

## Tarayıcı Desteği

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+

## Katkıda Bulunma

1. Repository'yi fork edin
2. Özellik dalı oluşturun
3. Değişikliklerinizi yapın
4. Pull request gönderin

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır.
