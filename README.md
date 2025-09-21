# 🚗⚡ Movilidad Eléctrica 24

Una página web moderna y responsive sobre noticias de movilidad eléctrica, desarrollada con HTML5, Tailwind CSS y JavaScript vanilla. El sitio presenta las últimas noticias sobre coches, bicicletas y scooters eléctricos con un sistema dinámico de carga, búsqueda y filtrado.

## 🌟 Características Principales

### ✅ Funcionalidades Implementadas

- **🎨 Diseño Moderno y Responsive**: Interfaz minimalista usando Tailwind CSS
- **📱 Mobile-First**: Optimizado para dispositivos móviles y tablets
- **🔍 Sistema de Búsqueda**: Búsqueda en tiempo real por título, resumen y categoría
- **📊 Filtrado y Ordenamiento**: Ordenar por fecha, título o categoría
- **🃏 Grid de Tarjetas**: Diseño en tarjetas con efectos hover y animaciones
- **⚡ Carga Dinámica**: Las noticias se cargan desde archivo JSON
- **🎯 Navegación Intuitiva**: Menú responsive con hamburger para móviles
- **🚀 Optimización de Rendimiento**: Debouncing, lazy loading y métricas de rendimiento
- **♿ Accesibilidad**: Etiquetas semánticas y soporte para lectores de pantalla

### 🎨 Elementos de Diseño

- **Colores Principales**: Verde (#10B981) y gris oscuro (#1F2937)
- **Tipografía**: Google Fonts Inter para una lectura óptima
- **Iconos**: Font Awesome para iconografía consistente
- **Animaciones**: Transiciones suaves y efectos hover
- **Imágenes**: Placeholders de Unsplash para las noticias

## 📁 Estructura del Proyecto

```
movilidad-electrica-24/
├── index.html              # Página principal
├── data/
│   └── news.json          # Base de datos de noticias (JSON)
├── js/
│   └── main.js           # Lógica principal de la aplicación
└── README.md             # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **Tailwind CSS**: Framework CSS utility-first via CDN
- **JavaScript ES6+**: Funcionalidad interactiva moderna
- **Font Awesome**: Iconografía profesional
- **Google Fonts**: Tipografía Inter para mejor legibilidad
- **Fetch API**: Carga asíncrona de datos JSON
- **CSS Grid/Flexbox**: Layout responsive y flexible

## 🚀 URIs y Funcionalidades

### 📄 Páginas Principales
- **`/index.html`** - Página principal con todas las noticias

### 🔗 Enlaces Internos
- **Header Navigation**: Noticias, Comparativas, Reviews, Contacto
- **Footer Links**: Política de Privacidad, Términos de Uso, Sobre Nosotros

### ⚙️ Funcionalidades JavaScript
- **Búsqueda en Tiempo Real**: Filtrado instantáneo por palabra clave
- **Ordenamiento Dinámico**: Por fecha, título o categoría
- **Responsive Menu**: Navegación adaptable para móviles
- **Carga de Noticias**: Fetch dinámico desde JSON
- **Animaciones de Entrada**: Cards con efectos de aparición progresiva

## 📊 Estructura de Datos (news.json)

Cada noticia contiene la siguiente estructura:

```json
{
    "id": 1,
    "title": "Título de la noticia",
    "summary": "Resumen descriptivo de la noticia",
    "category": "Categoría (Coches Eléctricos, Bicicletas, etc.)",
    "image": "URL de la imagen",
    "link": "Enlace externo o interno",
    "date": "2024-12-15",
    "readTime": "Tiempo estimado de lectura"
}
```

### 📂 Categorías Disponibles
- **Coches Eléctricos** (azul)
- **Bicicletas Eléctricas** (verde)
- **Scooters Eléctricos** (morado)
- **Comparativas** (naranja)
- **Reviews** (rojo)
- **Política y Regulación** (gris)

## 🎯 Características Destacadas

### 🔍 Sistema de Búsqueda Avanzado
- Búsqueda en múltiples campos (título, resumen y categoría)
- Debouncing de 300ms para optimizar rendimiento
- Contador de resultados en tiempo real
- Botón de limpiar búsqueda

### 📱 Diseño Responsive
- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Grid Adaptativo**: 1 columna (móvil), 2 (tablet), 3 (escritorio)
- **Menú Hamburger**: Navegación colapsible en móviles

### ⚡ Optimización de Rendimiento
- **Lazy Loading**: Carga diferida de imágenes
- **Debouncing**: Optimización en la búsqueda
- **Métricas de Rendimiento**: Monitoreo del tiempo de carga
- **Manejo de Errores**: Fallbacks para imágenes y datos

## 🚧 Funcionalidades Pendientes

### 🔄 Mejoras Futuras Recomendadas
- [ ] **Sistema de Favoritos**: Guardar noticias favoritas en localStorage
- [ ] **Comentarios**: Sistema de comentarios por noticia
- [ ] **Newsletter**: Suscripción a boletín de noticias
- [ ] **Modo Oscuro**: Tema dark/light toggle
- [ ] **Paginación**: Dividir noticias en múltiples páginas
- [ ] **Filtros Avanzados**: Por fecha y categoría específica
- [ ] **Compartir Social**: Integración con redes sociales
- [ ] **PWA**: Convertir a Progressive Web App
- [ ] **API Real**: Integración con API de noticias real
- [ ] **Panel Admin**: CMS para gestionar noticias

### 🎨 Mejoras de Diseño
- [ ] **Animaciones CSS**: Más efectos de transición
- [ ] **Skeleton Loading**: Placeholders durante la carga
- [ ] **Infinite Scroll**: Carga automática al hacer scroll
- [ ] **Galería de Imágenes**: Modal para ver imágenes ampliadas
- [ ] **Breadcrumbs**: Navegación por categorías

### 🔧 Optimizaciones Técnicas
- [ ] **Service Worker**: Cache para funcionamiento offline
- [ ] **Optimización SEO**: Meta tags y structured data
- [ ] **Compresión**: Minificación de CSS y JS
- [ ] **CDN**: Optimización de carga de recursos
- [ ] **Testing**: Tests unitarios y de integración

## 🛠️ Instalación y Uso

### 📋 Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### 🚀 Inicio Rápido

1. **Clonar o descargar** el proyecto
2. **Abrir** `index.html` en un navegador
3. **¡Listo!** El sitio funcionará completamente

### 🔧 Desarrollo Local (Opcional)

```bash
# Usar cualquier servidor web local, por ejemplo:

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (con live-server)
npx live-server

# Acceder en: http://localhost:8000
```

## 📱 Responsive Design

### 📐 Breakpoints
- **Mobile**: 320px - 767px (1 columna)
- **Tablet**: 768px - 1023px (2 columnas)
- **Desktop**: 1024px+ (3 columnas)

### 🎨 Adaptaciones por Dispositivo
- **Mobile**: Menú hamburger, tarjetas apiladas, texto optimizado
- **Tablet**: Grid de 2 columnas, navegación completa
- **Desktop**: Grid de 3 columnas, efectos hover avanzados

## 🎯 Casos de Uso

### 👥 Usuarios Objetivo
- **Entusiastas de la movilidad eléctrica**
- **Compradores potenciales** de vehículos eléctricos
- **Profesionales del sector** automotriz
- **Periodistas y bloggers** especializados
- **Ambientalistas** interesados en sostenibilidad

### 📈 Métricas de Éxito
- **Tiempo de permanencia** en el sitio
- **Interacciones** con el buscador
- **Clicks** en "Leer más"
- **Compartidos** en redes sociales
- **Retorno** de visitantes

## 🔒 Consideraciones de Seguridad

- **Validación de entrada**: Sanitización en búsquedas
- **Enlaces externos**: Apertura en nueva ventana (_blank)
- **Imágenes**: Fallback para URLs rotas
- **HTTPS**: Recomendado para producción

## 📞 Soporte y Contacto

Para reportar bugs, sugerir mejoras o hacer preguntas:

- **Issues**: Usar el sistema de issues del repositorio
- **Email**: contacto@movilidadelectrica24.com (placeholder)
- **Social Media**: @MovilidadE24 (placeholder)

## 📄 Licencia

© 2025 Movilidad Eléctrica 24 - Proyecto educativo y de demostración.

---

**🚀 ¡Disfruta explorando el futuro de la movilidad eléctrica!** ⚡

*Última actualización: Diciembre 2024*