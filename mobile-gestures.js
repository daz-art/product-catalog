/* ===================================
   MOBILE GESTURES & TOUCH INTERACTIONS
   Product Catalog Template
   =================================== */

class MobileGestureHandler {
    constructor() {
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.touchStartTime = 0;
        this.minSwipeDistance = 50;
        this.maxSwipeTime = 300;
        this.isPinching = false;
        this.lastScale = 1;

        this.init();
    }

    init() {
        this.setupSwipeGestures();
        this.setupPullToRefresh();
        this.setupLongPress();
        this.setupDoubleTap();
        this.preventZoomOnDoubleTap();
        this.setupVibrationFeedback();
    }

    /* ===================================
       SWIPE GESTURES - Navigate Spreads
       =================================== */
    setupSwipeGestures() {
        const spreads = document.querySelectorAll('.spread');

        spreads.forEach(spread => {
            spread.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
                this.touchStartY = e.changedTouches[0].screenY;
                this.touchStartTime = Date.now();
            }, { passive: true });

            spread.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.touchEndY = e.changedTouches[0].screenY;

                this.handleSwipe();
            }, { passive: true });
        });
    }

    handleSwipe() {
        const swipeTime = Date.now() - this.touchStartTime;
        const xDiff = this.touchStartX - this.touchEndX;
        const yDiff = this.touchStartY - this.touchEndY;

        // Only trigger if swipe is fast enough and long enough
        if (swipeTime > this.maxSwipeTime) return;
        if (Math.abs(xDiff) < this.minSwipeDistance && Math.abs(yDiff) < this.minSwipeDistance) return;

        // Determine swipe direction
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            // Horizontal swipe
            if (xDiff > 0) {
                // Swipe left - next spread
                this.vibrate(10);
                this.navigateNext();
            } else {
                // Swipe right - previous spread
                this.vibrate(10);
                this.navigatePrevious();
            }
        } else {
            // Vertical swipe
            if (yDiff > 0) {
                // Swipe up
                this.showTopToolbar();
            } else {
                // Swipe down
                this.hideTopToolbar();
            }
        }
    }

    navigateNext() {
        const nextBtn = document.getElementById('nextSpread');
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.click();
            this.showNotification('Next Spread', 'info');
        }
    }

    navigatePrevious() {
        const prevBtn = document.getElementById('prevSpread');
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.click();
            this.showNotification('Previous Spread', 'info');
        }
    }

    /* ===================================
       PULL TO REFRESH
       =================================== */
    setupPullToRefresh() {
        let pullStartY = 0;
        let isPulling = false;
        const pullThreshold = 80;

        let pullIndicator = document.createElement('div');
        pullIndicator.className = 'pull-to-refresh-indicator';
        pullIndicator.innerHTML = `
            <div class="pull-spinner"></div>
            <p>Pull to refresh</p>
        `;
        pullIndicator.style.cssText = `
            position: fixed;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary-teal);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10005;
            transition: top 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        `;
        document.body.appendChild(pullIndicator);

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                pullStartY = e.touches[0].clientY;
                isPulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isPulling || window.scrollY > 0) return;

            const pullDistance = e.touches[0].clientY - pullStartY;

            if (pullDistance > 0 && pullDistance < pullThreshold * 2) {
                pullIndicator.style.top = `${Math.min(pullDistance - 50, 20)}px`;

                if (pullDistance > pullThreshold) {
                    pullIndicator.querySelector('p').textContent = 'Release to refresh';
                } else {
                    pullIndicator.querySelector('p').textContent = 'Pull to refresh';
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!isPulling) return;

            const pullDistance = e.changedTouches[0].clientY - pullStartY;

            if (pullDistance > pullThreshold) {
                this.triggerRefresh(pullIndicator);
            } else {
                pullIndicator.style.top = '-100px';
            }

            isPulling = false;
        }, { passive: true });
    }

    triggerRefresh(indicator) {
        indicator.querySelector('p').textContent = 'Refreshing...';
        indicator.style.top = '20px';
        this.vibrate([10, 50, 10]);

        // Simulate refresh
        setTimeout(() => {
            indicator.style.top = '-100px';
            this.showNotification('Catalog refreshed!', 'success');
        }, 1500);
    }

    /* ===================================
       LONG PRESS INTERACTION
       =================================== */
    setupLongPress() {
        const productCells = document.querySelectorAll('.product-cell');

        productCells.forEach(cell => {
            let pressTimer;

            cell.addEventListener('touchstart', (e) => {
                pressTimer = setTimeout(() => {
                    this.vibrate(20);
                    this.showProductActions(cell, e.touches[0]);
                }, 500);
            }, { passive: true });

            cell.addEventListener('touchend', () => {
                clearTimeout(pressTimer);
            }, { passive: true });

            cell.addEventListener('touchmove', () => {
                clearTimeout(pressTimer);
            }, { passive: true });
        });
    }

    showProductActions(cell, touch) {
        const productId = cell.dataset.productId || Math.random().toString(36).substr(2, 9);

        const actionMenu = document.createElement('div');
        actionMenu.className = 'quick-action-menu';
        actionMenu.style.cssText = `
            position: fixed;
            top: ${touch.clientY}px;
            left: ${touch.clientX}px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            padding: 10px;
            z-index: 10006;
            animation: scaleIn 0.2s ease;
            transform-origin: top left;
        `;

        actionMenu.innerHTML = `
            <button class="action-btn" onclick="addToFavorites('${productId}')">
                ❤️ Add to Favorites
            </button>
            <button class="action-btn" onclick="addToComparison('${productId}')">
                📊 Compare
            </button>
            <button class="action-btn" onclick="shareProduct('${productId}')">
                📤 Share
            </button>
        `;

        document.body.appendChild(actionMenu);

        // Add CSS for action buttons
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scaleIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            .quick-action-menu .action-btn {
                display: block;
                width: 100%;
                padding: 12px 20px;
                border: none;
                background: transparent;
                text-align: left;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.3s ease;
                font-size: 14px;
            }
            .quick-action-menu .action-btn:hover {
                background: var(--background-neutral);
            }
        `;
        document.head.appendChild(style);

        // Remove menu after interaction
        setTimeout(() => {
            document.addEventListener('touchstart', function removeMenu() {
                actionMenu.remove();
                document.removeEventListener('touchstart', removeMenu);
            }, { once: true });
        }, 100);
    }

    /* ===================================
       DOUBLE TAP TO ZOOM
       =================================== */
    setupDoubleTap() {
        const images = document.querySelectorAll('.product-image-placeholder, .detailed-image-placeholder');

        images.forEach(img => {
            let lastTap = 0;

            img.addEventListener('touchend', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;

                if (tapLength < 300 && tapLength > 0) {
                    // Double tap detected
                    this.vibrate(15);
                    this.zoomImage(img);
                    e.preventDefault();
                }

                lastTap = currentTime;
            });
        });
    }

    zoomImage(img) {
        // Create full-screen overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10007;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        `;

        const zoomedImg = img.cloneNode(true);
        zoomedImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            width: auto;
            height: auto;
            border-radius: 12px;
            animation: zoomIn 0.3s ease;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            border: none;
            background: white;
            font-size: 32px;
            cursor: pointer;
            color: #333;
        `;

        closeBtn.onclick = () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => overlay.remove(), 300);
        };

        overlay.appendChild(zoomedImg);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);

        // Add zoom animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes zoomIn {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    /* ===================================
       PREVENT ZOOM ON DOUBLE TAP
       =================================== */
    preventZoomOnDoubleTap() {
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - this.lastTouchEnd <= 300) {
                e.preventDefault();
            }
            this.lastTouchEnd = now;
        }, { passive: false });
    }

    /* ===================================
       VIBRATION FEEDBACK
       =================================== */
    setupVibrationFeedback() {
        // Check if vibration is supported
        this.hasVibration = 'vibrate' in navigator;
    }

    vibrate(pattern) {
        if (this.hasVibration) {
            navigator.vibrate(pattern);
        }
    }

    /* ===================================
       TOOLBAR SHOW/HIDE
       =================================== */
    showTopToolbar() {
        const toolbar = document.querySelector('.top-toolbar');
        if (toolbar) {
            toolbar.style.transform = 'translateY(0)';
            toolbar.style.opacity = '1';
        }
    }

    hideTopToolbar() {
        const toolbar = document.querySelector('.top-toolbar');
        if (toolbar) {
            toolbar.style.transform = 'translateY(-100%)';
            toolbar.style.opacity = '0';
        }
    }

    /* ===================================
       NOTIFICATION HELPER
       =================================== */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `mobile-toast mobile-toast-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: var(--primary-teal);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 10008;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s ease;
        `;

        if (type === 'success') {
            notification.style.background = 'var(--success-green)';
        } else if (type === 'error') {
            notification.style.background = 'var(--error-red)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);

        // Remove after 2 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(-50%) translateY(100px)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

/* ===================================
   TOUCH-OPTIMIZED CAROUSEL
   =================================== */

class TouchCarousel {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) return;

        this.startX = 0;
        this.currentX = 0;
        this.isDragging = false;

        this.init();
    }

    init() {
        this.container.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.container.style.cursor = 'grabbing';
        }, { passive: true });

        this.container.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;

            this.currentX = e.touches[0].clientX;
            const diff = this.currentX - this.startX;

            this.container.style.transform = `translateX(${diff}px)`;
        }, { passive: true });

        this.container.addEventListener('touchend', () => {
            this.isDragging = false;
            this.container.style.cursor = 'grab';
            this.container.style.transform = 'translateX(0)';
        }, { passive: true });
    }
}

/* ===================================
   MOBILE PERFORMANCE OPTIMIZATIONS
   =================================== */

class MobilePerformance {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.optimizeScrolling();
        this.reduceAnimationsOnLowEnd();
        this.detectSlowConnection();
    }

    lazyLoadImages() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    optimizeScrolling() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Scroll-based optimizations here
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    reduceAnimationsOnLowEnd() {
        // Detect low-end device (rough heuristic)
        const isLowEnd = navigator.hardwareConcurrency <= 2 ||
                         navigator.deviceMemory <= 2;

        if (isLowEnd) {
            document.body.classList.add('reduce-animations');

            const style = document.createElement('style');
            style.textContent = `
                .reduce-animations * {
                    animation-duration: 0.1s !important;
                    transition-duration: 0.1s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    detectSlowConnection() {
        if ('connection' in navigator) {
            const connection = navigator.connection;

            if (connection.effectiveType === 'slow-2g' ||
                connection.effectiveType === '2g') {
                document.body.classList.add('slow-connection');
                console.log('Slow connection detected - reducing data usage');
            }
        }
    }
}

/* ===================================
   INITIALIZE MOBILE FEATURES
   =================================== */

// Only initialize on mobile devices
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize gesture handler
        window.mobileGestureHandler = new MobileGestureHandler();

        // Initialize performance optimizations
        window.mobilePerformance = new MobilePerformance();

        console.log('📱 Mobile gestures and optimizations enabled');
    });
}

/* ===================================
   EXPORT FOR USE IN OTHER FILES
   =================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MobileGestureHandler,
        TouchCarousel,
        MobilePerformance
    };
}
