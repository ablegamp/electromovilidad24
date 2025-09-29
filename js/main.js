/**
 * Movilidad Eléctrica 24 - Funcionalidad Simplificada
 * Versión simplificada del sistema de navegación y contenido
 */

class MovilidadElectrica {
    constructor() {
        this.allContent = [];
        this.filteredContent = [];
        this.currentSearchTerm = '';
        this.currentSortBy = 'recent';
        this.contentType = this.getContentType();

        this.init();
    }

    /**
     * Obtener tipo de contenido basado en la página actual
     */
    getContentType() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';

        // Detectar por nombre de archivo o por URL
        if (currentPage === 'comparativas.html' || currentPath.includes('comparativas')) {
            return 'comparativas';
        }
        if (currentPage === 'reviews.html' || currentPath.includes('reviews')) {
            return 'reviews';
        }
        if (currentPage === 'guias.html' || currentPath.includes('guias')) {
            return 'guias';
        }
        if (currentPage === 'index.html' || currentPath === '/' || currentPath === '') {
            return 'news';
        }

        // Fallback: detectar por elementos del DOM
        if (document.getElementById('comparativas-grid')) {
            return 'comparativas';
        }
        if (document.getElementById('reviews-grid')) {
            return 'reviews';
        }
        if (document.getElementById('guias-grid')) {
            return 'guias';
        }
        if (document.getElementById('news-grid')) {
            return 'news';
        }

        return 'news'; // default fallback
    }

    /**
     * Inicialización simplificada
     */
    async init() {
        this.setupEventListeners();
        await this.loadContent();
        this.renderContent();
        this.hideLoader();
        this.setupActiveNavigation();
    }

    /**
     * Configurar event listeners básicos
     */
    setupEventListeners() {
        // Nota: El menú móvil ahora se configura en setupBasicFunctionality()
        // para que funcione en TODAS las páginas

        // Buscador
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search');

        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(e);
                }
            });
        }

        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', this.clearSearch.bind(this));
        }

        // Selector de ordenamiento
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.handleSortChange.bind(this));
        }
    }

    /**
     * Configurar navegación activa basada en URL
     */
    setupActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Comparar rutas
            if (currentPath.includes('index.html') && href === 'index.html') {
                link.classList.add('active');
            } else if (currentPath.includes('comparativas.html') && href === 'comparativas.html') {
                link.classList.add('active');
            } else if (currentPath.includes('reviews.html') && href === 'reviews.html') {
                link.classList.add('active');
            } else if (currentPath.includes('guias.html') && href === 'guias.html') {
                link.classList.add('active');
            }
        });
    }

    /**
     * Cargar contenido según el tipo
     */
    async loadContent() {
        try {
            let url;
            if (this.contentType === 'comparativas') {
                url = `/data/comparativas.json?ts=${Date.now()}`;
            } else if (this.contentType === 'reviews') {
                url = `/data/reviews.json?ts=${Date.now()}`;
            } else if (this.contentType === 'guias') {
                url = `/data/guias.json?ts=${Date.now()}`;
            } else {
                url = `/data/news.json?ts=${Date.now()}`;
            }

            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allContent = await response.json();
            this.filteredContent = [...this.allContent];
        } catch (error) {
            console.error('Error al cargar el contenido:', error);
            this.showErrorMessage('No se pudo cargar el contenido.');
        }
    }

    /**
     * Renderizar contenido
     */
    renderContent() {
        const gridId = `${this.contentType}-grid`;
        const noResultsId = `no-results-${this.contentType}`;
        const grid = document.getElementById(gridId);
        const noResults = document.getElementById(noResultsId);
        const searchResults = document.getElementById('search-results');
        const resultsCount = document.getElementById('results-count');

        if (!grid) return;

        grid.innerHTML = '';

        if (this.filteredContent.length === 0) {
            if (noResults) noResults.classList.remove('hidden');
            if (searchResults) searchResults.classList.add('hidden');
            return;
        }

        if (noResults) noResults.classList.add('hidden');

        if (this.currentSearchTerm) {
            if (searchResults) {
                searchResults.classList.remove('hidden');
                if (resultsCount) resultsCount.textContent = this.filteredContent.length;
            }
        } else {
            if (searchResults) searchResults.classList.add('hidden');
        }

        this.filteredContent.forEach(item => {
            const card = this.createCard(item);
            grid.appendChild(card);
        });

        this.animateCardsEntrance();
        this.hideLoader();
    }

    /**
     * Ocultar loader
     */
    hideLoader() {
        const loader = document.getElementById('loader');
        if (loader) {
            setTimeout(() => {
                loader.classList.add('hidden');
                const sectionId = `${this.contentType}-section`;
                const section = document.getElementById(sectionId);
                if (section) section.classList.remove('hidden');
            }, 500);
        }
    }

    /**
     * Crear tarjeta de contenido
     */
    createCard(content) {
        const card = document.createElement('div');
        card.className = 'card-hover bg-white rounded-xl shadow-md overflow-hidden opacity-0 transform translate-y-4';

        const categoryColor = this.getCategoryColor(content.category);

        card.innerHTML = `
            <div class="relative">
                <a href="${content.link}" aria-label="Leer: ${content.title}">
                    <img
                        src="${content.image}"
                        alt="${content.title}"
                        class="w-full h-48 object-cover"
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&q=80'"
                    >
                </a>
                <div class="absolute top-3 left-3">
                    <span class="${categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium">
                        ${content.category}
                    </span>
                </div>
                <div class="absolute top-3 right-3">
                    <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                        ${content.readTime}
                    </span>
                </div>
            </div>

            <div class="p-6">
                <div class="flex items-center text-sm text-gray-500 mb-3">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    <span>${this.formatDate(content.date)}</span>
                </div>

                <h2 class="text-xl font-bold text-gris-oscuro mb-3 clamp-2 leading-tight">
                    <a href="${content.link}" class="hover:text-verde-principal">${content.title}</a>
                </h2>

                <p class="text-gray-600 mb-6 clamp-3 leading-relaxed">
                    ${content.summary}
                </p>

                <div class="flex items-center justify-between">
                    <a
                        href="${content.link}"
                        class="btn-hover bg-verde-principal hover:bg-verde-hover text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                    >
                        <span>Leer más</span>
                        <i class="fas fa-external-link-alt text-sm"></i>
                    </a>

                    <!-- Espacio para mantener el layout -->
                    <div class="w-16"></div>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Manejar búsqueda
     */
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        this.currentSearchTerm = searchTerm;

        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', searchTerm === '');
        }

        if (searchTerm === '') {
            this.clearSearch();
        } else {
            this.applySearchFilter(searchTerm);
        }

        this.applySorting();
        this.renderContent();
    }

    /**
     * Aplicar filtro de búsqueda
     */
    applySearchFilter(searchTerm) {
        this.filteredContent = this.allContent.filter(item => {
            return item.title.toLowerCase().includes(searchTerm) ||
                   item.summary.toLowerCase().includes(searchTerm) ||
                   item.category.toLowerCase().includes(searchTerm);
        });
    }

    /**
     * Limpiar búsqueda
     */
    clearSearch() {
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-search');

        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');

        this.currentSearchTerm = '';
        this.filteredContent = [...this.allContent];
        this.applySorting();
        this.renderContent();
    }

    /**
     * Manejar cambio de ordenamiento
     */
    handleSortChange(event) {
        this.currentSortBy = event.target.value;
        this.applySorting();
        this.renderContent();
    }

    /**
     * Aplicar ordenamiento
     */
    applySorting() {
        switch (this.currentSortBy) {
            case 'recent':
                this.filteredContent.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title':
                this.filteredContent.sort((a, b) => a.title.localeCompare(b.title, 'es-ES'));
                break;
            case 'category':
                this.filteredContent.sort((a, b) => a.category.localeCompare(b.category, 'es-ES'));
                break;
        }
    }

    /**
     * Obtener color de categoría
     */
    getCategoryColor(category) {
        const colors = {
            'Coches Eléctricos': 'bg-blue-500',
            'Bicicletas Eléctricas': 'bg-green-500',
            'Scooters Eléctricos': 'bg-purple-500',
            'Comparativas': 'bg-orange-500',
            'Reviews': 'bg-red-500',
            'Guías': 'bg-teal-500',
            'Política y Regulación': 'bg-gray-600'
        };
        return colors[category] || 'bg-verde-principal';
    }

    /**
     * Formatear fecha
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return date.toLocaleDateString('es-ES', options);
    }

    /**
     * Animar entrada de tarjetas
     */
    animateCardsEntrance() {
        const gridId = `${this.contentType}-grid`;
        const cards = document.querySelectorAll(`#${gridId} .card-hover`);
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-4');
                card.classList.add('opacity-100', 'translate-y-0');
            }, index * 100);
        });
    }

    /**
     * Mostrar mensaje de error
     */
    showErrorMessage(message) {
        const gridId = `${this.contentType}-grid`;
        const grid = document.getElementById(gridId);

        if (grid) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
                    <h3 class="text-2xl font-bold text-gris-oscuro mb-2">Error al cargar el contenido</h3>
                    <p class="text-gray-600 mb-6">${message}</p>
                    <button
                        onclick="location.reload()"
                        class="bg-verde-principal hover:bg-verde-hover text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            `;
        }

        // Ocultar el loader
        this.hideLoader();
    }

    /**
     * Debounce para búsqueda
     */
    debounce(func, wait) {
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
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Detectar si hay grid de contenido
    const hasNewsGrid = document.getElementById('news-grid');
    const hasComparativasGrid = document.getElementById('comparativas-grid');
    const hasReviewsGrid = document.getElementById('reviews-grid');
    const hasGuiasGrid = document.getElementById('guias-grid');

    if (hasNewsGrid || hasComparativasGrid || hasReviewsGrid || hasGuiasGrid) {
        new MovilidadElectrica();
    }

    // Inicializar funcionalidades básicas en TODAS las páginas
    setupBasicFunctionality();
});

/**
 * Configurar funcionalidades básicas que deben ejecutarse en todas las páginas
 */
function setupBasicFunctionality() {
    // Menú móvil toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }

    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Efecto parallax sutil en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('main > section:first-child');
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Inicializar banner de cookies y analítica
    initCookieBanner();
    try {
        if (localStorage.getItem('cookieConsent') === 'accepted') {
            loadAnalytics();
        }
    } catch (e) {}

    // Inicializar métricas de rendimiento
    logPerformanceMetrics();
}

/**
 * Performance monitoring
 */
function logPerformanceMetrics() {
    if (performance.mark && performance.measure) {
        performance.mark('app-start');

        window.addEventListener('load', () => {
            performance.mark('app-end');
            performance.measure('app-load-time', 'app-start', 'app-end');

            const measure = performance.getEntriesByName('app-load-time')[0];
            console.log(`⚡ Tiempo de carga de la aplicación: ${measure.duration.toFixed(2)}ms`);
        });
    }
}

/**
 * Banner de Cookies (reutilizable)
 */
function initCookieBanner(force = false) {
    try {
        const CONSENT_KEY = 'cookieConsent';
        const consent = localStorage.getItem(CONSENT_KEY);
        // Evitar duplicados
        if (document.getElementById('cookie-banner')) return;
        if (!force && (consent === 'accepted' || consent === 'rejected')) {
            return; // ya hay decisión
        }

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'fixed inset-x-0 bottom-0 z-50';
        banner.innerHTML = `
            <div class="mx-auto max-w-5xl m-4 p-4 md:p-5 bg-white shadow-xl border border-gray-200 rounded-2xl">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-start gap-3">
                        <div class="shrink-0 bg-verde-principal text-white rounded-lg p-2">
                            <i class="fas fa-cookie-bite"></i>
                        </div>
                        <p class="text-sm text-gray-700 leading-relaxed">
                            Utilizamos cookies técnicas para que el sitio funcione correctamente y, de forma opcional, cookies de analítica agregada para mejorar nuestros contenidos.
                            Puedes aceptar o rechazar las cookies no esenciales. Más información en nuestra
                            <a href="/privacidad.html" class="text-verde-principal hover:underline">Política de Privacidad</a>.
                        </p>
                    </div>
                    <div class="flex items-center gap-3 self-end md:self-auto">
                        <button id="cookie-reject" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Rechazar</button>
                        <button id="cookie-accept" class="px-4 py-2 rounded-lg bg-verde-principal text-white hover:bg-emerald-600">Aceptar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(banner);

        const acceptBtn = document.getElementById('cookie-accept');
        const rejectBtn = document.getElementById('cookie-reject');

        const closeBanner = (value) => {
            if (value) {
                try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
            }
            if (banner && banner.parentNode) {
                banner.parentNode.removeChild(banner);
            }
            if (value === 'accepted') {
                loadAnalytics();
            }
        };

        if (acceptBtn) acceptBtn.addEventListener('click', () => closeBanner('accepted'));
        if (rejectBtn) rejectBtn.addEventListener('click', () => closeBanner('rejected'));
    } catch (e) {
        console.warn('Cookie banner init error:', e);
    }
}

// Reabrir configuración de cookies desde el footer
function openCookieSettings() {
    try { localStorage.removeItem('cookieConsent'); } catch (e) {}
    initCookieBanner(true);
}

// Cargar analítica tras consentimiento (ejemplo Plausible)
function loadAnalytics() {
    if (document.getElementById('analytics-script')) return; // evitar duplicados
    const script = document.createElement('script');
    script.id = 'analytics-script';
    script.defer = true;
    script.setAttribute('data-domain', 'movilidadelectrica24.com'); // TODO: ajustar dominio
    script.src = 'https://plausible.io/js/plausible.js';
    document.head.appendChild(script);
}
