# Plan para añadir categoría de Motos Eléctricas

Este plan describe cómo añadir una nueva categoría de "Motos Eléctricas" al sitio web, incluyendo la creación de la estructura de carpetas, la actualización del menú principal en todas las páginas, y la configuración inicial.

## Análisis actual

- **Estructura actual**: El sitio tiene un menú principal con: Noticias, Comparativas, Reviews, Guías, Calculadoras eléctricas, Sobre mí, Contacto
- **Ubicación artículos**: Todos los artículos están en `/articulos/` (323 archivos HTML)
- **Navegación**: El menú está definido en `index.html` y se replica en otras páginas
- **URLs existentes**: No hay actualmente mención a motos eléctricas en el menú principal

## Objetivos

1. Crear nueva categoría "Motos Eléctricas" en el menú principal
2. Crear estructura de carpetas `/articulos/motos-electricas/`
3. Actualizar el menú de navegación en todas las páginas principales
4. Mantener consistencia con el diseño actual

## Pasos a implementar

### 1. Crear estructura de carpetas
- Crear directorio `/articulos/motos-electricas/`
- Preparar para futuros artículos de motos eléctricas

### 2. Actualizar menú principal en index.html
- Añadir "Motos Eléctricas" después de "Reviews" y antes de "Guías"
- Actualizar tanto menú desktop como móvil
- Mantener clases CSS y estructura existente

### 3. Actualizar menú en otras páginas principales
- Actualizar `guias.html`
- Actualizar `comparativas.html`
- Actualizar `reviews.html`
- Actualizar `calculadoras.html`
- Actualizar `contacto.html`
- Actualizar `sobre.html`

### 4. Crear página de categoría inicial
- Crear `/articulos/motos-electricas/index.html`
- Página de bienvenida a la sección de motos eléctricas
- Enlace a futuros artículos

## Consideraciones técnicas

- **URL amigable**: `/articulos/motos-electricas/`
- **SEO**: Optimizar para búsqueda de motos eléctricas
- **Diseño**: Mantener consistencia visual con otras secciones
- **Responsive**: Asegurar funcionamiento en móvil y desktop
- **Accesibilidad**: Mantener estructura semántica HTML5

## Estructura de navegación propuesta

```
Noticias | Comparativas | Reviews | Motos Eléctricas | Guías | Calculadoras eléctricas | Sobre mí | Contacto
```

## Archivos a modificar

1. `index.html` - Menú principal
2. `guias.html` - Navegación
3. `comparativas.html` - Navegación  
4. `reviews.html` - Navegación
5. `calculadoras.html` - Navegación
6. `contacto.html` - Navegación
7. `sobre.html` - Navegación
8. Nuevo: `/articulos/motos-electricas/index.html`

## Próximos pasos (futuros)

- Crear artículos específicos de motos eléctricas
- Añadir sección de motos en el sitemap.xml
- Crear página de comparativas de motos eléctricas
- Integrar con calculadoras específicas para motos
