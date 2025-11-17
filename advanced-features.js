// ===================================
// ADVANCED FEATURES MODULE
// Ultra-Enhanced Product Catalog
// ===================================

// ===================================
// GLOBAL STATE & CONFIGURATION
// ===================================

const CatalogState = {
    favorites: JSON.parse(localStorage.getItem('favorites')) || [],
    comparison: [],
    cart: [],
    searchHistory: [],
    viewMode: localStorage.getItem('viewMode') || 'grid',
    sortBy: 'default',
    filterBy: {
        priceRange: [0, 1000],
        category: 'all',
        rating: 0
    },
    currency: localStorage.getItem('currency') || 'USD',
    language: localStorage.getItem('language') || 'en',
    soundEnabled: localStorage.getItem('soundEnabled') !== 'false',
    tourCompleted: localStorage.getItem('tourCompleted') === 'true'
};

const CURRENCIES = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    JPY: { symbol: '¥', rate: 149.50 },
    CAD: { symbol: 'C$', rate: 1.36 }
};

// ===================================
// SEARCH & FILTER SYSTEM
// ===================================

class SearchSystem {
    constructor() {
        this.searchIndex = [];
        this.initializeSearch();
    }

    initializeSearch() {
        const searchInput = document.getElementById('catalogSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }

        // Build search index
        this.buildSearchIndex();
    }

    buildSearchIndex() {
        const products = document.querySelectorAll('[data-product-id]');
        products.forEach(product => {
            const sku = product.getAttribute('data-product-id');
            const title = product.querySelector('.product-desc')?.textContent || '';
            const price = product.querySelector('.product-price')?.textContent || '';

            this.searchIndex.push({
                element: product,
                sku,
                title: title.toLowerCase(),
                price,
                keywords: `${sku} ${title} ${price}`.toLowerCase()
            });
        });
    }

    performSearch(query) {
        const normalizedQuery = query.toLowerCase().trim();

        if (normalizedQuery.length === 0) {
            this.showAllProducts();
            return;
        }

        let matches = 0;
        this.searchIndex.forEach(item => {
            if (item.keywords.includes(normalizedQuery)) {
                item.element.style.display = '';
                item.element.classList.add('search-match');
                matches++;
            } else {
                item.element.style.display = 'none';
                item.element.classList.remove('search-match');
            }
        });

        this.updateSearchResults(matches, query);
        this.saveSearchHistory(query);
    }

    showAllProducts() {
        this.searchIndex.forEach(item => {
            item.element.style.display = '';
            item.element.classList.remove('search-match');
        });
    }

    updateSearchResults(count, query) {
        const resultsEl = document.getElementById('searchResults');
        if (resultsEl) {
            resultsEl.textContent = `Found ${count} products matching "${query}"`;
            resultsEl.style.display = count > 0 ? 'block' : 'none';
        }
    }

    saveSearchHistory(query) {
        if (!CatalogState.searchHistory.includes(query)) {
            CatalogState.searchHistory.unshift(query);
            CatalogState.searchHistory = CatalogState.searchHistory.slice(0, 10);
        }
    }
}

// ===================================
// FAVORITES/WISHLIST SYSTEM
// ===================================

class FavoritesSystem {
    addToFavorites(productId) {
        if (!CatalogState.favorites.includes(productId)) {
            CatalogState.favorites.push(productId);
            this.saveFavorites();
            this.updateFavoriteButton(productId, true);
            this.showNotification('Added to favorites!', 'success');
            playSound('favorite');
        }
    }

    removeFromFavorites(productId) {
        CatalogState.favorites = CatalogState.favorites.filter(id => id !== productId);
        this.saveFavorites();
        this.updateFavoriteButton(productId, false);
        this.showNotification('Removed from favorites', 'info');
    }

    toggleFavorite(productId) {
        if (CatalogState.favorites.includes(productId)) {
            this.removeFromFavorites(productId);
        } else {
            this.addToFavorites(productId);
        }
    }

    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(CatalogState.favorites));
        this.updateFavoritesCount();
    }

    updateFavoritesCount() {
        const badge = document.querySelector('.favorites-count');
        if (badge) {
            badge.textContent = CatalogState.favorites.length;
            badge.style.display = CatalogState.favorites.length > 0 ? 'flex' : 'none';
        }
    }

    updateFavoriteButton(productId, isFavorite) {
        const btn = document.querySelector(`[data-favorite="${productId}"]`);
        if (btn) {
            btn.classList.toggle('active', isFavorite);
            btn.innerHTML = isFavorite ? '❤️' : '🤍';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ===================================
// COMPARISON SYSTEM
// ===================================

class ComparisonSystem {
    addToComparison(productId, productData) {
        if (CatalogState.comparison.length >= 4) {
            new FavoritesSystem().showNotification('Maximum 4 products can be compared', 'warning');
            return;
        }

        if (!CatalogState.comparison.find(p => p.id === productId)) {
            CatalogState.comparison.push({
                id: productId,
                ...productData
            });
            this.updateComparisonBar();
            playSound('add');
        }
    }

    removeFromComparison(productId) {
        CatalogState.comparison = CatalogState.comparison.filter(p => p.id !== productId);
        this.updateComparisonBar();
    }

    updateComparisonBar() {
        const bar = document.getElementById('comparisonBar');
        const count = document.getElementById('comparisonCount');

        if (bar && count) {
            count.textContent = CatalogState.comparison.length;
            bar.style.display = CatalogState.comparison.length > 0 ? 'flex' : 'none';
        }
    }

    showComparisonTable() {
        const modal = document.getElementById('comparisonModal');
        if (modal) {
            this.renderComparisonTable();
            modal.classList.add('active');
        }
    }

    renderComparisonTable() {
        const container = document.getElementById('comparisonTableContainer');
        if (!container) return;

        let html = `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${CatalogState.comparison.map(p => `
                            <th>
                                ${p.title || p.id}
                                <button onclick="comparison.removeFromComparison('${p.id}')" class="remove-btn">✕</button>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>SKU</strong></td>
                        ${CatalogState.comparison.map(p => `<td>${p.id}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Price</strong></td>
                        ${CatalogState.comparison.map(p => `<td>${p.price || 'N/A'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Rating</strong></td>
                        ${CatalogState.comparison.map(p => `<td>${p.rating || '★★★★☆'}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Description</strong></td>
                        ${CatalogState.comparison.map(p => `<td>${p.description || 'No description'}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        container.innerHTML = html;
    }
}

// ===================================
// BULK ORDER CALCULATOR
// ===================================

class BulkCalculator {
    calculate(unitPrice, quantity) {
        let discount = 0;

        if (quantity >= 100) discount = 0.20;
        else if (quantity >= 50) discount = 0.15;
        else if (quantity >= 25) discount = 0.10;
        else if (quantity >= 10) discount = 0.05;

        const subtotal = unitPrice * quantity;
        const discountAmount = subtotal * discount;
        const total = subtotal - discountAmount;

        return {
            quantity,
            unitPrice,
            subtotal,
            discount: discount * 100,
            discountAmount,
            total
        };
    }

    showCalculator(productId, unitPrice) {
        const modal = document.getElementById('bulkCalculatorModal');
        if (!modal) return;

        const input = modal.querySelector('#bulkQuantity');
        const updateBtn = modal.querySelector('#calculateBulk');

        const updateCalculation = () => {
            const qty = parseInt(input.value) || 1;
            const result = this.calculate(unitPrice, qty);
            this.displayResult(result);
        };

        input.addEventListener('input', updateCalculation);
        updateBtn.addEventListener('click', updateCalculation);

        updateCalculation();
        modal.classList.add('active');
    }

    displayResult(result) {
        const container = document.getElementById('bulkResult');
        if (!container) return;

        container.innerHTML = `
            <div class="bulk-breakdown">
                <div class="bulk-row">
                    <span>Unit Price:</span>
                    <span>${formatCurrency(result.unitPrice)}</span>
                </div>
                <div class="bulk-row">
                    <span>Quantity:</span>
                    <span>${result.quantity}</span>
                </div>
                <div class="bulk-row">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(result.subtotal)}</span>
                </div>
                <div class="bulk-row discount-row">
                    <span>Discount (${result.discount}%):</span>
                    <span>-${formatCurrency(result.discountAmount)}</span>
                </div>
                <div class="bulk-row total-row">
                    <span><strong>Total:</strong></span>
                    <span><strong>${formatCurrency(result.total)}</strong></span>
                </div>
            </div>
            <div class="bulk-savings">
                You save ${formatCurrency(result.discountAmount)}!
            </div>
        `;
    }
}

// ===================================
// CURRENCY CONVERTER
// ===================================

function convertCurrency(amount, targetCurrency) {
    const rate = CURRENCIES[targetCurrency]?.rate || 1;
    return amount * rate;
}

function formatCurrency(amount) {
    const currency = CURRENCIES[CatalogState.currency];
    return `${currency.symbol}${amount.toFixed(2)}`;
}

function updateAllPrices() {
    document.querySelectorAll('[data-price]').forEach(el => {
        const basePrice = parseFloat(el.getAttribute('data-price'));
        const converted = convertCurrency(basePrice, CatalogState.currency);
        el.textContent = formatCurrency(converted);
    });
}

function changeCurrency(newCurrency) {
    CatalogState.currency = newCurrency;
    localStorage.setItem('currency', newCurrency);
    updateAllPrices();
    new FavoritesSystem().showNotification(`Currency changed to ${newCurrency}`, 'success');
}

// ===================================
// SOUND EFFECTS
// ===================================

const SOUNDS = {
    click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGJ0fPTgjMGHm7A7OihUhELTKXh8bllHAU2jdXzzn0vBSl+zPLaizsIGGS56+mjUBAMUKrj8LdnHwU7k9n0yoU0Bx5qwOvnm08SC0yk4PG3Yh0FO47Y88yAMAYeb8Hq5Z1QEgxMp+Lwt2MeBTuO2PPMgC8GHm/B6uSaUBQMTKjh8LdjHgU7j9j0zH8vBR5uwOrkmlATDEyo4fC4Yh4FO4/Y9Mx/LwYeb8Dq5JlQFAxMqOHwuGMeBTuP2PTMfy8GHm/A6uOZURUMTKjh8LhjHgU7j9j0zH8vBh5vwOrimVEVDEyo4fC4Yx4FO4/Y9Mx/LwYeb8Dq4plRFQxMqOHwuGMeBTuP2PTMfy8GHm/A6uKZURUMTKjh8LhjHgU7j9j0zH8vBh5vwOrimVEVDEyo4fC4Yx4FO4/Y9Mx/LwYeb8Dq4plRFQxMqOHwuGMeBTuP2PTMfy8GHm/A6uKZURUMTKjh8LhjHgU7j9j0zH8vBh5vwOrimVEVDEyo4fC4Yx4FO4/Y9Mx/LwYeb8Dq4plRFQxMqOHwuGMeBTuP2PTMfy8GHm/A6uKZURUMTKjh8LhjHgU7j9j0zH8vBh5vwOrimVEVDEyo4fC4Yx4FO4/Y9Mx/LwYeb8Dq',
    favorite: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA',
    add: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA',
    success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA'
};

function playSound(soundName) {
    if (!CatalogState.soundEnabled) return;

    try {
        const audio = new Audio(SOUNDS[soundName] || SOUNDS.click);
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore errors
    } catch (e) {
        // Silently fail if sound doesn't work
    }
}

function toggleSound() {
    CatalogState.soundEnabled = !CatalogState.soundEnabled;
    localStorage.setItem('soundEnabled', CatalogState.soundEnabled);

    const btn = document.getElementById('soundToggle');
    if (btn) {
        btn.textContent = CatalogState.soundEnabled ? '🔊' : '🔇';
    }

    new FavoritesSystem().showNotification(
        `Sound ${CatalogState.soundEnabled ? 'enabled' : 'disabled'}`,
        'info'
    );
}

// ===================================
// ONBOARDING TOUR
// ===================================

class OnboardingTour {
    constructor() {
        this.steps = [
            { element: '#catalogSearch', message: 'Search for products instantly!' },
            { element: '.nav-controls', message: 'Navigate between pages with these controls' },
            { element: '#darkModeToggle', message: 'Toggle dark mode for comfortable viewing' },
            { element: '.product-cell', message: 'Click any product for details' },
            { element: '#favoritesBtn', message: 'Save your favorite products here' },
            { element: '#comparisonBtn', message: 'Compare up to 4 products' }
        ];
        this.currentStep = 0;
    }

    start() {
        if (CatalogState.tourCompleted) {
            return;
        }

        this.showStep(0);
    }

    showStep(index) {
        if (index >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[index];
        const element = document.querySelector(step.element);

        if (!element) {
            this.showStep(index + 1);
            return;
        }

        const tooltip = this.createTooltip(step.message, element);

        const nextBtn = tooltip.querySelector('.tour-next');
        const skipBtn = tooltip.querySelector('.tour-skip');

        nextBtn.onclick = () => {
            tooltip.remove();
            this.showStep(index + 1);
        };

        skipBtn.onclick = () => {
            tooltip.remove();
            this.complete();
        };
    }

    createTooltip(message, targetElement) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.innerHTML = `
            <div class="tour-content">
                <p>${message}</p>
                <div class="tour-actions">
                    <button class="tour-next">Next</button>
                    <button class="tour-skip">Skip Tour</button>
                </div>
            </div>
        `;

        document.body.appendChild(tooltip);
        this.positionTooltip(tooltip, targetElement);

        return tooltip;
    }

    positionTooltip(tooltip, target) {
        const rect = target.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left}px`;
    }

    complete() {
        CatalogState.tourCompleted = true;
        localStorage.setItem('tourCompleted', 'true');
        new FavoritesSystem().showNotification('Tour completed! Enjoy exploring!', 'success');
    }
}

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;

    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
}

// ===================================
// FULLSCREEN MODE
// ===================================

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        playSound('success');
    } else {
        document.exitFullscreen();
    }
}

// ===================================
// VIEW MODE TOGGLE
// ===================================

function toggleViewMode() {
    const grids = document.querySelectorAll('.product-grid');
    CatalogState.viewMode = CatalogState.viewMode === 'grid' ? 'list' : 'grid';

    grids.forEach(grid => {
        grid.classList.toggle('list-view', CatalogState.viewMode === 'list');
    });

    localStorage.setItem('viewMode', CatalogState.viewMode);

    const btn = document.getElementById('viewModeToggle');
    if (btn) {
        btn.textContent = CatalogState.viewMode === 'grid' ? '☰' : '▦';
    }
}

// ===================================
// SHARE FUNCTIONALITY
// ===================================

async function shareProduct(productId, productName) {
    const shareData = {
        title: productName,
        text: `Check out ${productName} in our catalog!`,
        url: `${window.location.href}#${productId}`
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
            new FavoritesSystem().showNotification('Shared successfully!', 'success');
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareData.url);
            new FavoritesSystem().showNotification('Link copied to clipboard!', 'success');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
}

// ===================================
// KEYBOARD SHORTCUTS
// ===================================

function showKeyboardShortcuts() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) {
        modal.classList.add('active');
    }
}

const shortcuts = {
    '?': showKeyboardShortcuts,
    '/': () => document.getElementById('catalogSearch')?.focus(),
    'f': () => toggleFullscreen(),
    'd': () => document.getElementById('darkModeToggle')?.click(),
    's': () => toggleSound(),
    'v': () => toggleViewMode(),
    'h': () => new OnboardingTour().start()
};

document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const key = e.key.toLowerCase();
    if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
    }
});

// ===================================
// INITIALIZE ALL SYSTEMS
// ===================================

let searchSystem, favoritesSystem, comparisonSystem, bulkCalculator;

document.addEventListener('DOMContentLoaded', () => {
    searchSystem = new SearchSystem();
    favoritesSystem = new FavoritesSystem();
    comparisonSystem = new ComparisonSystem();
    bulkCalculator = new BulkCalculator();

    // Initialize scroll progress
    window.addEventListener('scroll', updateScrollProgress);

    // Initialize favorites count
    favoritesSystem.updateFavoritesCount();

    // Start tour for new users
    if (!CatalogState.tourCompleted) {
        setTimeout(() => new OnboardingTour().start(), 2000);
    }

    // Initialize view mode
    if (CatalogState.viewMode === 'list') {
        toggleViewMode();
    }

    console.log('Advanced features initialized! ✨');
});

// Export to window for global access
window.searchSystem = searchSystem;
window.favoritesSystem = favoritesSystem;
window.comparison = comparisonSystem;
window.bulkCalculator = bulkCalculator;
window.changeCurrency = changeCurrency;
window.toggleSound = toggleSound;
window.toggleFullscreen = toggleFullscreen;
window.toggleViewMode = toggleViewMode;
window.shareProduct = shareProduct;
window.playSound = playSound;
