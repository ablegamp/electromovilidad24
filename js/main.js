/**
 * Movilidad Eléctrica 24 - Funcionalidad Principal
 * Sistema de noticias dinámico con búsqueda, filtrado y ordenamiento
 */

class MovilidadElectrica {
    constructor() {
        this.allNews = [];
        this.filteredNews = [];
        this.allComparativas = [];
        this.filteredComparativas = [];
        this.currentSearchTerm = '';
        this.currentSortBy = 'recent';
        this.currentSection = 'news'; // 'news' o 'comparativas'

        this.init();
    }

    /**
     * Inicialización de la aplicación
     */
    async init() {
        this.setupEventListeners();
        await this.loadNews();
        await this.loadComparativas();
        await this.loadReviews();

        // ✅ Verificar la sección inicial según el hash de la URL
        this.checkInitialSection();

        // ✅ Renderizar el contenido inicial
        this.renderContent();

        // ✅ Ocultar loader y mostrar la sección inicial
        this.hideLoader();

        // ✅ Configurar cambio entre secciones
        this.setupSectionSwitching();
    }

    /**
     * Verificar la sección inicial según el hash de la URL
     */
    checkInitialSection() {
        const hash = window.location.hash;
        const currentPage = window.location.pathname.split('/').pop();

        console.log('🔍 Verificando sección inicial - Hash de la URL:', hash);
        console.log('📄 Página actual:', currentPage);

        // Forzar recarga de datos si venimos de una navegación externa
        if (hash && (this.allNews.length === 0 || this.allComparativas.length === 0 || this.allReviews.length === 0)) {
            console.log('🔄 Recargando datos para navegación externa');
            this.loadNews();
            this.loadComparativas();
            this.loadReviews();
        }

        // Detectar la sección basada en la página actual si no hay hash
        if (!hash) {
            if (currentPage === 'comparativas.html') {
                console.log('📊 Detectada página de comparativas - configurando como inicial');
                this.currentSection = 'comparativas';
                this.switchToSection('comparativas');
                return;
            } else if (currentPage === 'reviews.html') {
                console.log('⭐ Detectada página de reviews - configurando como inicial');
                this.currentSection = 'reviews';
                this.switchToSection('reviews');
                return;
            }
        }

        if (hash === '#reviews-section') {
            console.log('⭐ Detectada sección de reviews en la URL - configurando como inicial');
            this.currentSection = 'reviews';
            this.switchToSection('reviews');
        } else if (hash === '#comparativas-section') {
            console.log('📊 Detectada sección de comparativas en la URL - configurando como inicial');
            this.currentSection = 'comparativas';
            this.switchToSection('comparativas');
        } else {
            console.log('📰 Mostrando sección por defecto: noticias');
            this.currentSection = 'news';
            this.switchToSection('news');
        }
    }

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        console.log('🔧 Configurando event listeners para sección:', this.currentSection);

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

        // Buscador - solo si existe el elemento
        const searchInput = document.getElementById('search-input');
        const clearSearchBtn = document.getElementById('clear-search');

        if (searchInput) {
            console.log('📝 Configurando event listener para búsqueda');
            searchInput.addEventListener('input', this.debounce(this.handleSearchGeneric.bind(this), 300));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearchGeneric(e);
                }
            });
        }

        if (clearSearchBtn) {
            console.log('🧹 Configurando event listener para limpiar búsqueda');
            clearSearchBtn.addEventListener('click', this.clearSearchGeneric.bind(this));
        }

        // Selector de ordenamiento - solo configurar el de la sección actual
        const sortSelect = document.getElementById('sort-select');
        const sortSelectComparativas = document.getElementById('sort-select-comparativas');
        const sortSelectReviews = document.getElementById('sort-select-reviews');

        if (this.currentSection === 'news' && sortSelect) {
            console.log('📊 Configurando event listener para ordenamiento de noticias');
            sortSelect.addEventListener('change', this.handleSortChangeGeneric.bind(this));
        } else if (this.currentSection === 'comparativas' && sortSelectComparativas) {
            console.log('📊 Configurando event listener para ordenamiento de comparativas');
            sortSelectComparativas.addEventListener('change', this.handleSortChangeGeneric.bind(this));
        } else if (this.currentSection === 'reviews' && sortSelectReviews) {
            console.log('⭐ Configurando event listener para ordenamiento de reviews');
            sortSelectReviews.addEventListener('change', this.handleSortChangeGeneric.bind(this));
        }
    }

    /**
     * Configurar cambio entre secciones
     */
    setupSectionSwitching() {
        // Solo configurar navegación entre secciones en index.html
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'index.html') {
            console.log('📄 En página específica, no se configura navegación entre secciones');
            return;
        }

        // Enlaces del menú para cambiar entre noticias, comparativas y reviews
        const newsLinks = document.querySelectorAll('a[href="#news-section"]');
        const comparativasLinks = document.querySelectorAll('a[href="#comparativas-section"]');
        const reviewsLinks = document.querySelectorAll('a[href="#reviews-section"]');

        newsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clic en noticias');
                this.switchToSection('news');
            });
        });

        comparativasLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clic en comparativas');
                this.switchToSection('comparativas');
            });
        });

        reviewsLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Clic en reviews');
                this.switchToSection('reviews');
            });
        });
    }

    /**
     * Cambiar entre secciones
     */
    switchToSection(section) {
        console.log('🔄 Cambiando a sección:', section);
        console.log('📊 Estado actual:', {
            currentSection: this.currentSection,
            filteredNews: this.filteredNews.length,
            filteredComparativas: this.filteredComparativas.length,
            filteredReviews: this.filteredReviews.length
        });

        this.currentSection = section;

        // Solo aplicar lógica de navegación en index.html
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'index.html') {
            console.log('📄 En página específica, no se aplica lógica de navegación entre secciones');
            this.renderContent();
            this.setupEventListeners();
            return;
        }

        // Actualizar clases activas en el menú
        const newsLinks = document.querySelectorAll('a[href="#news-section"]');
        const comparativasLinks = document.querySelectorAll('a[href="#comparativas-section"]');
        const reviewsLinks = document.querySelectorAll('a[href="#reviews-section"]');

        console.log('🔍 Enlaces encontrados:', {
            newsLinks: newsLinks.length,
            comparativasLinks: comparativasLinks.length,
            reviewsLinks: reviewsLinks.length
        });

        // Ocultar todas las secciones
        const newsSection = document.getElementById('news-section');
        const comparativasSection = document.getElementById('comparativas-section');
        const reviewsSection = document.getElementById('reviews-section');

        console.log('🎯 Secciones encontradas:', {
            newsSection: !!newsSection,
            comparativasSection: !!comparativasSection,
            reviewsSection: !!reviewsSection
        });

        if (newsSection) newsSection.classList.add('hidden');
        if (comparativasSection) comparativasSection.classList.add('hidden');
        if (reviewsSection) reviewsSection.classList.add('hidden');

        if (section === 'news') {
            console.log('📰 Mostrando sección de noticias');
            newsLinks.forEach(link => {
                link.classList.add('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.remove('hover:text-verde-principal');
            });
            comparativasLinks.forEach(link => {
                link.classList.remove('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.add('hover:text-verde-principal');
            });
            reviewsLinks.forEach(link => {
                link.classList.remove('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.add('hover:text-verde-principal');
            });
            if (newsSection) newsSection.classList.remove('hidden');
        } else if (section === 'comparativas') {
            console.log('📊 Mostrando sección de comparativas');
            comparativasLinks.forEach(link => {
                link.classList.add('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.remove('hover:text-verde-principal');
            });
            newsLinks.forEach(link => {
                link.classList.remove('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.add('hover:text-verde-principal');
            });
            reviewsLinks.forEach(link => {
                link.classList.remove('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.add('hover:text-verde-principal');
            });
            if (comparativasSection) comparativasSection.classList.remove('hidden');
        } else if (section === 'reviews') {
            console.log('⭐ Mostrando sección de reviews');
            reviewsLinks.forEach(link => {
                link.classList.add('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.remove('hover:text-verde-principal');
            });
            newsLinks.forEach(link => {
                link.classList.remove('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.add('hover:text-verde-principal');
            });
            comparativasLinks.forEach(link => {
                link.classList.remove('border-b-2', 'border-verde-principal', 'pb-1');
                link.classList.add('hover:text-verde-principal');
            });
            if (reviewsSection) reviewsSection.classList.remove('hidden');
        }

        // Renderizar el contenido correspondiente
        this.renderContent();

        // ✅ Reconfigurar event listeners para la nueva sección
        console.log('🔄 Reconfigurando event listeners para sección:', section);
        this.setupEventListeners();
    }

    /**
     * Renderizar contenido según la sección actual
     */
    renderContent() {
        console.log('🎨 Renderizando contenido para sección:', this.currentSection);
        console.log('📊 Estado antes de renderizar:', {
            currentSection: this.currentSection,
            filteredNews: this.filteredNews.length,
            filteredComparativas: this.filteredComparativas.length,
            filteredReviews: this.filteredReviews.length
        });

        if (this.currentSection === 'news') {
            console.log('📰 Renderizando noticias');
            this.renderNews();
        } else if (this.currentSection === 'comparativas') {
            console.log('📊 Renderizando comparativas');
            this.renderComparativas();
        } else if (this.currentSection === 'reviews') {
            console.log('⭐ Renderizando reviews');
            this.renderReviews();
        }

        console.log('✅ Renderizado completado para sección:', this.currentSection);
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
     * Cargar comparativas desde el archivo JSON
     */
    async loadComparativas() {
        try {
            const url = `data/comparativas.json?ts=${Date.now()}`;
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allComparativas = await response.json();
            this.filteredComparativas = [...this.allComparativas];

            console.log(`✅ Cargadas ${this.allComparativas.length} comparativas correctamente`);
        } catch (error) {
            console.error('❌ Error al cargar las comparativas:', error);
            this.showErrorMessage('No se pudieron cargar las comparativas. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    /**
     * Cargar reviews desde el archivo JSON
     */
    async loadReviews() {
        try {
            const url = `data/reviews.json?ts=${Date.now()}`;
            const response = await fetch(url, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allReviews = await response.json();
            this.filteredReviews = [...this.allReviews];

            console.log(`✅ Cargadas ${this.allReviews.length} reviews correctamente`);
        } catch (error) {
            console.error('❌ Error al cargar las reviews:', error);
            this.showErrorMessage('No se pudieron cargar las reviews. Por favor, inténtalo de nuevo más tarde.');
        }
    }

    /**
     * Renderizar contenido genérico para cualquier tipo
     */
    renderContentByType(contentType) {
        console.log(`Ejecutando render${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`);

        // Configuración por tipo de contenido
        const config = {
            news: {
                gridId: 'news-grid',
                noResultsId: 'no-results',
                filteredArray: this.filteredNews,
                allArray: this.allNews
            },
            comparativas: {
                gridId: 'comparativas-grid',
                noResultsId: 'no-results-comparativas',
                filteredArray: this.filteredComparativas,
                allArray: this.allComparativas
            },
            reviews: {
                gridId: 'reviews-grid',
                noResultsId: 'no-results-reviews',
                filteredArray: this.filteredReviews,
                allArray: this.allReviews
            }
        };

        const { gridId, noResultsId, filteredArray, allArray } = config[contentType];
        const grid = document.getElementById(gridId);
        const noResults = document.getElementById(noResultsId);
        const searchResults = document.getElementById('search-results');
        const resultsCount = document.getElementById('results-count');

        console.log(`Grid de ${contentType}:`, grid);
        console.log(`Número de ${contentType} filtradas:`, filteredArray.length);

        if (!grid) {
            console.log(`ERROR: No se encontró el grid de ${contentType}`);
            return;
        }

        // Limpiar grid anterior
        grid.innerHTML = '';

        // Si no hay contenido filtrado
        if (filteredArray.length === 0) {
            console.log(`No hay ${contentType} filtradas, mostrando mensaje de no resultados`);
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
                if (resultsCount) resultsCount.textContent = filteredArray.length;
            }
        } else {
            if (searchResults) searchResults.classList.add('hidden');
        }

        // Renderizar cada elemento
        filteredArray.forEach(item => {
            const card = this.createContentCard(item, contentType);
            grid.appendChild(card);
        });

        // Añadir animación de entrada
        this.animateCardsEntrance();
    }

    /**
     * Renderizar las noticias en el grid
     */
    renderNews() {
        this.renderContentByType('news');
    }

    /**
     * Renderizar las comparativas en el grid
     */
    renderComparativas() {
        this.renderContentByType('comparativas');
    }

    /**
     * Renderizar las reviews en el grid
     */
    renderReviews() {
        this.renderContentByType('reviews');
    }

    /**
     * Crear tarjeta genérica para cualquier tipo de contenido
     */
    createContentCard(content, contentType) {
        const card = document.createElement('div');
        card.className = 'card-hover bg-white rounded-xl shadow-md overflow-hidden opacity-0 transform translate-y-4';

        // Determinar el color de la categoría
        const categoryColor = this.getCategoryColor(content.category);

        // Configuración específica por tipo de contenido
        const typeConfig = {
            news: {
                gridId: 'news-grid',
                noResultsId: 'no-results',
                searchResultsId: 'search-results',
                resultsCountId: 'results-count'
            },
            comparativas: {
                gridId: 'comparativas-grid',
                noResultsId: 'no-results-comparativas',
                searchResultsId: 'search-results',
                resultsCountId: 'results-count'
            },
            reviews: {
                gridId: 'reviews-grid',
                noResultsId: 'no-results-reviews',
                searchResultsId: 'search-results',
                resultsCountId: 'results-count'
            }
        };

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
                        aria-label="Leer más: ${content.title}"
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
     * Manejar búsqueda genérica
     */
    handleSearchGeneric(event) {
        const searchTerm = event.target.value.toLowerCase().trim();
        console.log('🔍 Buscando:', searchTerm, 'en sección:', this.currentSection);
        this.currentSearchTerm = searchTerm;

        // Mostrar/ocultar botón de limpiar búsqueda
        const clearBtn = document.getElementById('clear-search');
        if (clearBtn) {
            clearBtn.classList.toggle('hidden', searchTerm === '');
        }

        if (searchTerm === '') {
            console.log('🧹 Limpiando búsqueda');
            this.clearSearchGeneric();
        } else {
            console.log('🔎 Aplicando filtro de búsqueda');
            this.applySearchFilter(searchTerm);
        }

        // Aplicar ordenamiento actual
        this.applySortingGeneric();
        console.log('📊 Renderizando después de búsqueda');
        this.renderContent();
    }

    /**
     * Aplicar filtro de búsqueda genérico
     */
    applySearchFilter(searchTerm) {
        const contentArrays = {
            news: { all: this.allNews, filtered: 'filteredNews' },
            comparativas: { all: this.allComparativas, filtered: 'filteredComparativas' },
            reviews: { all: this.allReviews, filtered: 'filteredReviews' }
        };

        const config = contentArrays[this.currentSection];
        if (!config) return;

        this[config.filtered] = config.all.filter(item => {
            return item.title.toLowerCase().includes(searchTerm) ||
                   item.summary.toLowerCase().includes(searchTerm) ||
                   item.category.toLowerCase().includes(searchTerm);
        });
    }

    /**
     * Limpiar búsqueda genérica
     */
    clearSearchGeneric() {
        console.log('🧹 Limpiando búsqueda en sección:', this.currentSection);
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-search');

        if (searchInput) searchInput.value = '';
        if (clearBtn) clearBtn.classList.add('hidden');

        this.currentSearchTerm = '';

        const contentArrays = {
            news: { all: this.allNews, filtered: 'filteredNews' },
            comparativas: { all: this.allComparativas, filtered: 'filteredComparativas' },
            reviews: { all: this.allReviews, filtered: 'filteredReviews' }
        };

        const config = contentArrays[this.currentSection];
        if (config) {
            this[config.filtered] = [...config.all];
        }

        this.applySortingGeneric();
        console.log('📊 Renderizando después de limpiar búsqueda');
        this.renderContent();
    }

    /**
     * Manejar cambio de ordenamiento genérico
     */
    handleSortChangeGeneric(event) {
        console.log('🔄 Cambiando ordenamiento a:', event.target.value, 'en sección:', this.currentSection);
        this.currentSortBy = event.target.value;
        this.applySortingGeneric();
        console.log('📊 Renderizando después de cambio de ordenamiento');
        this.renderContent();
    }

    /**
     * Aplicar ordenamiento genérico
     */
    applySortingGeneric() {
        const contentArrays = {
            news: this.filteredNews,
            comparativas: this.filteredComparativas,
            reviews: this.filteredReviews
        };

        const array = contentArrays[this.currentSection];
        if (!array) return;

        switch (this.currentSortBy) {
            case 'recent':
                array.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'title':
                array.sort((a, b) => a.title.localeCompare(b.title, 'es-ES'));
                break;
            case 'category':
                array.sort((a, b) => a.category.localeCompare(b.category, 'es-ES'));
                break;
        }
    }

    /**
     * Animar entrada de tarjetas
     */
    animateCardsEntrance() {
        console.log('🎨 Animando tarjetas para sección:', this.currentSection);

        // Configuración por tipo de contenido
        const config = {
            news: { gridId: '#news-grid .card-hover', emoji: '📰', name: 'noticias' },
            comparativas: { gridId: '#comparativas-grid .card-hover', emoji: '📊', name: 'comparativas' },
            reviews: { gridId: '#reviews-grid .card-hover', emoji: '⭐', name: 'reviews' }
        };

        const { gridId, emoji, name } = config[this.currentSection];
        const cards = document.querySelectorAll(gridId);

        console.log(`${emoji} Encontradas`, cards.length, `tarjetas de ${name} para animar`);

        if (cards.length === 0) {
            console.log('⚠️ No se encontraron tarjetas para animar en sección:', this.currentSection);
            return;
        }

        cards.forEach((card, index) => {
            console.log('✨ Animando tarjeta', index + 1, 'en sección:', this.currentSection);
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
        const currentPage = window.location.pathname.split('/').pop();

        setTimeout(() => {
            if (loader) loader.classList.add('hidden');

            // Solo aplicar lógica de secciones en index.html
            if (currentPage === 'index.html') {
                const newsSection = document.getElementById('news-section');
                const comparativasSection = document.getElementById('comparativas-section');
                const reviewsSection = document.getElementById('reviews-section');

                // Mostrar la sección actual y ocultar las otras
                if (newsSection && comparativasSection && reviewsSection) {
                    if (this.currentSection === 'news') {
                        newsSection.classList.remove('hidden');
                        comparativasSection.classList.add('hidden');
                        reviewsSection.classList.add('hidden');
                    } else if (this.currentSection === 'comparativas') {
                        comparativasSection.classList.remove('hidden');
                        newsSection.classList.add('hidden');
                        reviewsSection.classList.add('hidden');
                    } else if (this.currentSection === 'reviews') {
                        reviewsSection.classList.remove('hidden');
                        newsSection.classList.add('hidden');
                        comparativasSection.classList.add('hidden');
                    }
                }
            }
            // En páginas específicas (comparativas.html, reviews.html), el contenido ya está visible
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
    // Solo inicializar si existe algún contenedor de contenido para evitar trabajo innecesario en páginas estáticas
    if (document.getElementById('news-grid') || document.getElementById('comparativas-grid') || document.getElementById('reviews-grid')) {
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
