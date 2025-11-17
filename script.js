// ===================================
// PRODUCT CATALOG - INTERACTIVE JAVASCRIPT
// Enhanced Features & Animations
// ===================================

// Global State
let currentSpread = 1;
const totalSpreads = 7;
let isDarkMode = false;

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initializeLoading();
    initializeNavigation();
    initializeDarkMode();
    initializeTOC();
    initializeKeyboardNavigation();
    initializeScrollEffects();
    initializeNewsletterForm();

    // Hide loading screen after delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 1500);
});

// ===================================
// LOADING SCREEN
// ===================================

function initializeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '1';
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// ===================================
// NAVIGATION SYSTEM
// ===================================

function initializeNavigation() {
    const prevBtn = document.getElementById('prevSpread');
    const nextBtn = document.getElementById('nextSpread');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateToSpread(currentSpread - 1));
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateToSpread(currentSpread + 1));
    }

    updateNavigationState();
}

function navigateToSpread(spreadNum) {
    if (spreadNum < 1 || spreadNum > totalSpreads) return;

    currentSpread = spreadNum;
    const spreads = document.querySelectorAll('.spread');
    const targetSpread = document.querySelector(`.spread[data-spread="${spreadNum}"]`);

    if (targetSpread) {
        // Smooth scroll to spread
        targetSpread.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });

        // Update indicator
        document.getElementById('currentSpreadNum').textContent = spreadNum;

        // Add active class with animation
        spreads.forEach(s => s.classList.remove('active'));
        targetSpread.classList.add('active');

        updateNavigationState();
    }
}

function updateNavigationState() {
    const prevBtn = document.getElementById('prevSpread');
    const nextBtn = document.getElementById('nextSpread');

    if (prevBtn) {
        prevBtn.disabled = currentSpread === 1;
        prevBtn.style.opacity = currentSpread === 1 ? '0.3' : '1';
    }

    if (nextBtn) {
        nextBtn.disabled = currentSpread === totalSpreads;
        nextBtn.style.opacity = currentSpread === totalSpreads ? '0.3' : '1';
    }
}

// ===================================
// DARK MODE
// ===================================

function initializeDarkMode() {
    const toggleBtn = document.getElementById('darkModeToggle');

    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
        enableDarkMode();
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;

    if (isDarkMode) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }

    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    isDarkMode = true;

    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.classList.add('active');
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    isDarkMode = false;

    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
        toggle.classList.remove('active');
    }
}

// ===================================
// TABLE OF CONTENTS
// ===================================

function initializeTOC() {
    const tocButtons = document.querySelectorAll('.toc-button[data-goto]');

    tocButtons.forEach(button => {
        button.addEventListener('click', function() {
            const spreadNum = parseInt(this.getAttribute('data-goto'));
            navigateToSpread(spreadNum);
        });
    });
}

// ===================================
// PRODUCT MODAL
// ===================================

function openProductModal(sku, title, description) {
    const modal = document.getElementById('productModal');

    if (modal) {
        // Update modal content
        document.getElementById('modalProductTitle').textContent = title;
        document.getElementById('modalProductSKU').textContent = `SKU: ${sku}`;
        document.getElementById('modalProductDescription').textContent = description;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Add entrance animation
        setTimeout(() => {
            modal.querySelector('.modal-content').classList.add('visible');
        }, 50);
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');

    if (modal) {
        modal.querySelector('.modal-content').classList.remove('visible');

        setTimeout(() => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

// ===================================
// KEYBOARD NAVIGATION
// ===================================

function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        switch(e.key) {
            case 'ArrowLeft':
                navigateToSpread(currentSpread - 1);
                break;
            case 'ArrowRight':
                navigateToSpread(currentSpread + 1);
                break;
            case 'Home':
                navigateToSpread(1);
                break;
            case 'End':
                navigateToSpread(totalSpreads);
                break;
        }
    });
}

// ===================================
// SCROLL EFFECTS
// ===================================

function initializeScrollEffects() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spreadNum = parseInt(entry.target.getAttribute('data-spread'));
                if (spreadNum) {
                    currentSpread = spreadNum;
                    document.getElementById('currentSpreadNum').textContent = spreadNum;
                    updateNavigationState();
                }

                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.spread').forEach(spread => {
        observer.observe(spread);
    });
}

// ===================================
// NEWSLETTER FORM
// ===================================

function initializeNewsletterForm() {
    const form = document.querySelector('.newsletter-form');

    if (form) {
        const button = form.querySelector('button');
        const input = form.querySelector('input');

        button.addEventListener('click', function(e) {
            e.preventDefault();

            if (input && input.value && input.value.includes('@')) {
                // Simulate submission
                button.textContent = 'Subscribed!';
                button.style.background = '#00D4AA';
                input.value = '';

                setTimeout(() => {
                    button.textContent = 'Subscribe';
                    button.style.background = '';
                }, 3000);
            } else {
                input.style.borderColor = '#ff4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 1000);
            }
        });
    }
}

// ===================================
// PRODUCT INTERACTIONS
// ===================================

// Add hover effects to product cells
document.addEventListener('DOMContentLoaded', function() {
    const productCells = document.querySelectorAll('.product-cell');

    productCells.forEach(cell => {
        cell.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });

        cell.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// ===================================
// SMOOTH SCROLL BEHAVIOR
// ===================================

function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
}

// ===================================
// ANALYTICS & TRACKING (Placeholder)
// ===================================

function trackProductView(sku) {
    console.log(`Product viewed: ${sku}`);
    // Add your analytics code here
}

function trackNavigation(spreadNum) {
    console.log(`Navigated to spread: ${spreadNum}`);
    // Add your analytics code here
}

// ===================================
// PRINT FUNCTIONALITY
// ===================================

function preparePrint() {
    // Optimize for printing
    document.body.classList.add('printing');

    window.print();

    // Remove print class after print dialog closes
    setTimeout(() => {
        document.body.classList.remove('printing');
    }, 1000);
}

// Add print button handler if exists
const printBtn = document.querySelector('[data-action="print"]');
if (printBtn) {
    printBtn.addEventListener('click', preparePrint);
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Focus management for modal
function trapFocusInModal(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modalElement.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
}

// ===================================
// PERFORMANCE OPTIMIZATIONS
// ===================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const handleScroll = debounce(function() {
    // Handle scroll effects here
}, 100);

window.addEventListener('scroll', handleScroll);

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatPrice(price) {
    return `$${price.toFixed(2)}`;
}

function generateProductLink(sku) {
    return `#product-${sku}`;
}

// ===================================
// EXPORT FUNCTIONALITY
// ===================================

window.catalogApp = {
    navigateToSpread,
    openProductModal,
    closeProductModal,
    toggleDarkMode,
    trackProductView,
    trackNavigation
};

console.log('Product Catalog Initialized Successfully ✓');
