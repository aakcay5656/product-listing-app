class ProductCarousel {
    constructor() {
    // API Configuration
    const isDevelopment = window.location.hostname === 'localhost';
    this.apiBaseUrl = isDevelopment
        ? 'http://localhost:8000/api'
        : 'https://your-backend-name.onrender.com/api';

        // Carousel state
        this.currentSlide = 0;
        this.products = [];
        this.slideWidth = 345; // 320px + 25px gap
        this.slidesPerView = this.calculateSlidesPerView();

        // Sample products for fallback
        this.sampleProducts = [
            {
                id: 1,
                name: "Engagement Ring 1",
                popularityScore: 0.85,
                weight: 2.1,
                price: 145.35,
                popularity_out_of_5: 4.3,
                popularity_percentage: 85.0,
                images: {
                    yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-Y.jpg?v=1696588368",
                    rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-R.jpg?v=1696588406",
                    white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG085-100P-W.jpg?v=1696588402"
                }
            },
            {
                id: 2,
                name: "Engagement Ring 2",
                popularityScore: 0.51,
                weight: 3.4,
                price: 165.84,
                popularity_out_of_5: 2.6,
                popularity_percentage: 51.0,
                images: {
                    yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-Y.jpg?v=1707727068",
                    rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-R.jpg?v=1707727068",
                    white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG012-W.jpg?v=1707727068"
                }
            },
            {
                id: 3,
                name: "Engagement Ring 3",
                popularityScore: 0.92,
                weight: 3.8,
                price: 238.00,
                popularity_out_of_5: 4.6,
                popularity_percentage: 92.0,
                images: {
                    yellow: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-Y.jpg?v=1683534032",
                    rose: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-R.jpg?v=1683534032",
                    white: "https://cdn.shopify.com/s/files/1/0484/1429/4167/files/EG020-100P-W.jpg?v=1683534032"
                }
            }
        ];

        console.log('Initializing Product Carousel...');
        console.log(`API URL: ${this.apiBaseUrl}`);

        // Initialize DOM elements and event listeners
        this.initializeElements();
        this.attachEventListeners();

        // Load sample products first, then try API
        this.loadSampleProducts();
        this.testAndLoadAPI();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.slidesPerView = this.calculateSlidesPerView();
            this.updateCarousel();
        });
    }

   initializeElements() {
        this.carouselTrack = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.getElementById('indicators');

        this.loading = document.getElementById('loading');
        this.error = document.getElementById('error');
        this.apiStatus = document.getElementById('apiStatus');

        this.minPriceInput = document.getElementById('minPrice');
        this.maxPriceInput = document.getElementById('maxPrice');
        this.minPopularityInput = document.getElementById('minPopularity');
        this.applyFiltersBtn = document.getElementById('applyFilters');
        this.clearFiltersBtn = document.getElementById('clearFilters');
    }

    calculateSlidesPerView() {
        const containerWidth = window.innerWidth - 120;
        return Math.max(1, Math.floor(containerWidth / this.slideWidth));
    }

    attachEventListeners() {
        this.prevBtn?.addEventListener('click', () => this.previousSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());

        this.applyFiltersBtn?.addEventListener('click', () => this.applyFilters());
        this.clearFiltersBtn?.addEventListener('click', () => this.clearFilters());

        let startX, endX;

        this.carouselTrack?.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        this.carouselTrack?.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    async testAndLoadAPI() {
        console.log('Testing API connection...');
        this.updateStatus('Connecting to API...', 'warning');

        try {
            const corsResponse = await fetch(`${this.apiBaseUrl}/test`);

            if (corsResponse.ok) {
                const corsData = await corsResponse.json();
                console.log('CORS test successful:', corsData);
                await this.loadProducts();
            } else {
                throw new Error(`CORS test failed: ${corsResponse.status}`);
            }
        } catch (error) {
            console.warn('API connection failed:', error.message);
            this.updateStatus('API Unavailable - Using Sample Data', 'warning');
        }
    }

    async loadProducts(filters = {}) {
        console.log('Loading products from API...');

        try {
            const params = new URLSearchParams(filters);
            const url = `${this.apiBaseUrl}/products?${params}`;
            console.log(`Fetching: ${url}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const apiProducts = await response.json();
            console.log(`Loaded ${apiProducts.length} products from API`);

            if (apiProducts.length > 0) {
                this.products = apiProducts;
                this.renderProducts();
                this.renderIndicators();
                this.currentSlide = 0;
                this.updateCarousel();
                this.updateStatus(`${apiProducts.length} Products Loaded from API`, 'success');
            } else {
                this.updateStatus('No products found matching criteria', 'warning');
            }

        } catch (error) {
            console.error('API load failed:', error);
            this.updateStatus(`API Error: ${error.message}`, 'error');
        }
    }

    loadSampleProducts() {
        console.log('Loading sample products...');
        this.products = [...this.sampleProducts];
        this.renderProducts();
        this.renderIndicators();
        this.currentSlide = 0;
        this.updateCarousel();
        this.updateStatus('Sample Products Loaded', 'warning');
    }

    updateStatus(message, type) {
        if (this.apiStatus) {
            this.apiStatus.textContent = message;
            this.apiStatus.className = `api-status ${type}`;
        }
    }

    renderProducts() {
        if (!this.carouselTrack) return;

        this.carouselTrack.innerHTML = '';

        this.products.forEach((product, index) => {
            const productCard = this.createProductCard(product, index);
            this.carouselTrack.appendChild(productCard);
        });
    }

    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;

        const stars = this.generateStars(product.popularity_out_of_5);


        const imageKeys = Object.keys(product.images); // ['yellow', 'rose', 'white']
        const firstImageKey = imageKeys[0]; // 'yellow'
        const firstImageUrl = product.images[firstImageKey];

        card.innerHTML = `
            <div class="product-image-container">
                <img src="${firstImageUrl}"
                     alt="${product.name}"
                     class="product-image"
                     id="image-${product.id}"
                     loading="lazy">
                <div class="color-picker">
                    ${imageKeys.map((colorKey, imgIndex) => `
                        <div class="color-option ${colorKey} ${imgIndex === 0 ? 'active' : ''}"
                             data-product-id="${product.id}"
                             data-image-url="${product.images[colorKey]}"
                             data-color="${colorKey}"
                             title="${this.formatColorName(colorKey)}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-details">
                    <span class="product-weight">${product.weight}g</span>
                    <div class="popularity-score">
                        <span class="stars">${stars}</span>
                        <span class="rating-text">(${product.popularity_out_of_5})</span>
                    </div>
                </div>
            </div>
        `;

        this.attachColorPickerEvents(card);

        return card;
    }

    attachColorPickerEvents(card) {
        const colorOptions = card.querySelectorAll('.color-option');

        colorOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const productId = e.target.dataset.productId;
                const imageUrl = e.target.dataset.imageUrl;

                const productImage = document.getElementById(`image-${productId}`);
                if (productImage) {
                    productImage.style.opacity = '0.7';

                    setTimeout(() => {
                        productImage.src = imageUrl;
                        productImage.style.opacity = '1';
                    }, 150);
                }

                colorOptions.forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    formatColorName(color) {
        const colorNames = {
            yellow: 'Yellow Gold',
            rose: 'Rose Gold',
            white: 'White Gold'
        };
        return colorNames[color] || color.charAt(0).toUpperCase() + color.slice(1);
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }

        // Half star
        if (hasHalfStar) {
            stars += '☆';
        }

        // Empty stars
        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars += '☆';
        }

        return stars;
    }

    renderIndicators() {
        if (!this.indicators || this.products.length === 0) return;

        this.indicators.innerHTML = '';
        const totalSlides = Math.max(1, this.products.length - this.slidesPerView + 1);

        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = `indicator ${i === 0 ? 'active' : ''}`;
            indicator.setAttribute('aria-label', `Go to slide ${i + 1}`);

            indicator.addEventListener('click', () => {
                this.currentSlide = i;
                this.updateCarousel();
            });

            this.indicators.appendChild(indicator);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.updateCarousel();
        }
    }

    nextSlide() {
        const maxSlide = Math.max(0, this.products.length - this.slidesPerView);
        if (this.currentSlide < maxSlide) {
            this.currentSlide++;
            this.updateCarousel();
        }
    }

    updateCarousel() {
        if (!this.carouselTrack) return;

        const translateX = -this.currentSlide * this.slideWidth;
        this.carouselTrack.style.transform = `translateX(${translateX}px)`;

        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Update button states
        const maxSlide = Math.max(0, this.products.length - this.slidesPerView);

        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.currentSlide === 0 ? '0.5' : '1';
            this.prevBtn.disabled = this.currentSlide === 0;
        }

        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.currentSlide >= maxSlide ? '0.5' : '1';
            this.nextBtn.disabled = this.currentSlide >= maxSlide;
        }
    }

    applyFilters() {
        const filters = {};

        if (this.minPriceInput?.value) {
            filters.min_price = parseFloat(this.minPriceInput.value);
        }
        if (this.maxPriceInput?.value) {
            filters.max_price = parseFloat(this.maxPriceInput.value);
        }
        if (this.minPopularityInput?.value) {
            filters.min_popularity = parseFloat(this.minPopularityInput.value);
        }

        console.log('Applying filters:', filters);
        this.updateStatus('Applying filters...', 'warning');
        this.loadProducts(filters);
    }

    clearFilters() {
        if (this.minPriceInput) this.minPriceInput.value = '';
        if (this.maxPriceInput) this.maxPriceInput.value = '';
        if (this.minPopularityInput) this.minPopularityInput.value = '';

        console.log('Clearing filters...');
        this.updateStatus('Loading all products...', 'warning');
        this.loadProducts();
    }
}

// Initialize the carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing carousel...');
    new ProductCarousel();
});
