/**
 * Movilidad Eléctrica 24 - Funcionalidad Principal
 * Sistema de noticias dinámico con búsqueda, filtrado y ordenamiento
 */

class MovilidadElectrica {
    constructor() {
        this.allNews = [];
        this.filteredNews = [];
        this.currentSearchTerm = '';
        this.currentSortBy = 'recent';
        
        this.init();
    }
    
    /**
     * Inicialización de la aplicación
     */
    async init() {
        this.setupEventListeners();
        await this.loadNews();
        this.renderNews();
        this.hideLoader();
    }
    
    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Menú móvil
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileNav = document.getElementById('mobile-nav');
        
        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileNav.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
        
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
     * Cargar noticias desde el archivo JSON
     */
    async loadNews() {
        try {
            const url = `data/news.json?ts=${Date.now()}`;
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allNews = await response.json();
            this.filteredNews = [...this.allNews];
            
            console.log(`✅ Cargadas ${this.allNews.length} noticias correctamente`);
        } catch (error) {
            console.error('❌ Error al cargar las noticias:', error);
            this.showErrorMessage('No se pudieron cargar las noticias. Por favor, inténtalo de nuevo más tarde.');
        }
    }
    
    /**
     * Renderizar las noticias en el grid
     */
    renderNews() {
        const newsGrid = document.getElementById('news-grid');
        const noResults = document.getElementById('no-results');
        const searchResults = document.getElementById('search-results');
        const resultsCount = document.getElementById('results-count');
        
        if (!newsGrid) return;
        
        // Limpiar grid anterior
        newsGrid.innerHTML = '';
        
        // Si no hay noticias filtradas
        if (this.filteredNews.length === 0) {
            if (noResults) noResults.classList.remove('hidden');
            if (searchResults) searchResults.classList.add('hidden');
            return;
        }
        
        // Ocultar mensaje de "no resultados"
        if (noResults) noResults.classList.add('hidden');
        
        // Mostrar contador de resultados si hay búsqueda activa
        if (this.currentSearchTerm) {
            if (searchResults) {
                searchResults.classList.remove('hidden');
                if (resultsCount) resultsCount.textContent = this.filteredNews.length;
            }
        } else {
            if (searchResults) searchResults.classList.add('hidden');
        }
        
        // Renderizar cada noticia
        this.filteredNews.forEach(news => {
            const newsCard = this.createNewsCard(news);
            newsGrid.appendChild(newsCard);
        });
        
        // Añadir animación de entrada
        this.animateCardsEntrance();
    }
    
    /**
     * Crear tarjeta de noticia
     */
    createNewsCard(news) {
        const card = document.createElement('div');
        card.className = 'card-hover bg-white rounded-xl shadow-md overflow-hidden opacity-0 transform translate-y-4';
        
        // Determinar el color de la categoría
        const categoryColor = this.getCategoryColor(news.category);
        
        card.innerHTML = `
            <div class="relative">
                <a href="${news.link}" aria-label="Leer: ${news.title}">
                    <img 
                        src="${news.image}" 
                        alt="${news.title}"
                        class="w-full h-48 object-cover"
                        loading="lazy"
                        onerror="this.src='https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=800&q=80'"
                    >
                </a>
                <div class="absolute top-3 left-3">
                    <span class="${categoryColor} text-white px-3 py-1 rounded-full text-xs font-medium">
                        ${news.category}
                    </span>
                </div>
                <div class="absolute top-3 right-3">
                    <span class="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                        ${news.readTime}
                    </span>
                </div>
            </div>
            
            <div class="p-6">
                <div class="flex items-center text-sm text-gray-500 mb-3">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    <span>${this.formatDate(news.date)}</span>
                </div>
                
                <h2 class="text-xl font-bold text-gris-oscuro mb-3 clamp-2 leading-tight">
                    <a href="${news.link}" class="hover:text-verde-principal">${news.title}</a>
                </h2>
                
                <p class="text-gray-600 mb-6 clamp-3 leading-relaxed">
                    ${news.summary}
                </p>
                
                <div class="flex items-center justify-between">
                    <a 
                        href="${news.link}"
                        class="btn-hover bg-verde-principal hover:bg-verde-hover text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2"
                        aria-label="Leer más: ${news.title}"
                    >
                        <span>Leer más</span>
                        <i class="fas fa-external-link-alt text-sm" aria-hidden="true"></i>
                    </a>
                    
                    <div class="flex items-center space-x-3 text-gray-400">
                        <button class="hover:text-verde-principal transition-colors" title="Compartir">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="hover:text-verde-principal transition-colors" title="Guardar">
                            <i class="fas fa-bookmark"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        return card;
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
     * Manejar búsqueda
     */
    handleSearch(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        this.currentSearchTerm = searchTerm;
        
        // Mostrar/ocultar botón de limpiar búsqueda
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', searchTerm === '');
        }
        
        if (searchTerm === '') {
            this.filteredNews = [...this.allNews];
        } else {
            this.filteredNews = this.allNews.filter(news => {
                return news.title.toLowerCase().includes(searchTerm) ||
                       news.summary.toLowerCase().includes(searchTerm) ||
                       news.category.toLowerCase().includes(searchTerm);
            });
        }
        
        // Aplicar ordenamiento actual
        this.applySorting();
        this.renderNews();
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
        this.filteredNews = [...this.allNews];
        this.applySorting();
        this.renderNews();
    }
    
    /**
     * Manejar cambio de ordenamiento
     */
    handleSortChange(event) {
        this.currentSortBy = event.target.value;
        this.applySorting();
        this.renderNews();
    }
    
    /**
     * Aplicar ordenamiento
     */
    applySorting() {
        switch (this.currentSortBy) {
            case 'recent':
                this.filteredNews.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title':
                this.filteredNews.sort((a, b) => a.title.localeCompare(b.title, 'es-ES'));
                break;
            case 'category':
                this.filteredNews.sort((a, b) => a.category.localeCompare(b.category, 'es-ES'));
                break;
        }
    }
    
    /**
     * Animar entrada de tarjetas
     */
    animateCardsEntrance() {
        const cards = document.querySelectorAll('#news-grid .card-hover');
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('opacity-0', 'translate-y-4');
                card.classList.add('opacity-100', 'translate-y-0');
            }, index * 100);
        });
    }
    
    /**
     * Ocultar loader y mostrar contenido
     */
    hideLoader() {
        const loader = document.getElementById('loader');
        const newsSection = document.getElementById('news-section');
        
        setTimeout(() => {
            if (loader) loader.classList.add('hidden');
            if (newsSection) newsSection.classList.remove('hidden');
        }, 1000);
    }
    
    /**
     * Mostrar mensaje de error
     */
    showErrorMessage(message) {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.innerHTML = `
                <div class="text-center">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                    <p class="text-gris-oscuro font-medium">${message}</p>
                    <button 
                        onclick="location.reload()" 
                        class="mt-4 bg-verde-principal hover:bg-verde-hover text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            `;
        }
    }
    
    /**
     * Debounce function para optimizar búsqueda
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

/**
 * Utilidades adicionales
 */

// Scroll suave para enlaces
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para todos los enlaces internos
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

    // Inicializar banner de cookies y analítica si ya hay consentimiento
    initCookieBanner();
    try {
        if (localStorage.getItem('cookieConsent') === 'accepted') {
            loadAnalytics();
        }
    } catch (e) {}
});

// Función para compartir noticias
function shareNews(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).then(() => {
            console.log('✅ Noticia compartida correctamente');
        }).catch((error) => {
            console.log('❌ Error al compartir:', error);
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const dummy = document.createElement('textarea');
        document.body.appendChild(dummy);
        dummy.value = `${title} - ${url}`;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        
        // Mostrar notificación
        showNotification('¡Enlace copiado al portapapeles!');
    }
}

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-verde-principal text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-y-full transition-transform duration-300';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-y-full');
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('translate-y-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Performance monitoring
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

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando Movilidad Eléctrica 24...');
        
    // Inicializar métricas de rendimiento
    logPerformanceMetrics();
        
    // Inicializar aplicación principal
    // Solo inicializar si existe el contenedor de noticias para evitar trabajo innecesario en páginas estáticas
    if (document.getElementById('news-grid')) {
        new MovilidadElectrica();
    }
        
    console.log('✅ Aplicación iniciada correctamente');
});

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
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
}