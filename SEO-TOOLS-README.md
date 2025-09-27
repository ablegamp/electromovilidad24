# Herramientas de SEO para Movilidad Eléctrica 24

Este documento explica cómo utilizar las herramientas de SEO implementadas para optimizar los artículos publicados.

## 🎯 Visión General

Se han implementado varias herramientas para facilitar la gestión y optimización del SEO en tu sitio web de movilidad eléctrica:

### ✅ Completado
- [x] Sitemap.xml actualizado con todos los artículos
- [x] Script automático para generar sitemap
- [x] Mejoras adicionales de SEO en artículos existentes
- [x] Herramienta web para editar SEO de artículos

## 🛠️ Herramientas Disponibles

### 1. Generador de Sitemap (`generate-sitemap.js`)

**Ubicación:** `generate-sitemap.js`

**Uso:**
```bash
node generate-sitemap.js
```

**Función:** Genera automáticamente el archivo `sitemap.xml` incluyendo todas las páginas HTML del sitio.

**Características:**
- Escanea automáticamente todos los archivos HTML
- Asigna prioridades según el tipo de contenido
- Configura frecuencias de cambio apropiadas
- Excluye páginas legales automáticamente

### 2. Mejoras de SEO (`improve-article-seo.js`)

**Ubicación:** `improve-article-seo.js`

**Uso:**
```bash
node improve-article-seo.js
```

**Función:** Añade mejoras avanzadas de SEO a los artículos existentes.

**Mejoras incluidas:**
- Meta tags de robots optimizados
- Configuración de theme-color
- Preconexión a recursos externos (fonts, CDN)
- DNS prefetch para mejorar velocidad de carga
- Meta tags para móviles (iOS/Android)

### 3. Editor Web de SEO (`seo-editor.html`)

**Ubicación:** `seo-editor.html`

**Acceso:** Abre `seo-editor.html` en tu navegador

**Función:** Interfaz web para editar los metadatos SEO de artículos individuales.

**Características:**
- Lista de artículos disponibles
- Editor de metadatos completo
- Vista previa en tiempo real
- Validación de campos
- Contador de caracteres para descripciones
- Vista previa de cómo se verá en Google y redes sociales

## 📊 SEO Ya Implementado

Cada artículo ya cuenta con:

### Metadatos básicos
- ✅ Títulos optimizados (50-60 caracteres)
- ✅ Descripciones atractivas (150-160 caracteres)
- ✅ URLs canónicas
- ✅ Meta viewport

### Open Graph (Redes sociales)
- ✅ Títulos para redes sociales
- ✅ Descripciones optimizadas
- ✅ Imágenes de preview
- ✅ Configuración de locale

### Twitter Cards
- ✅ Títulos específicos para Twitter
- ✅ Descripciones optimizadas
- ✅ Imágenes de preview

### Datos estructurados
- ✅ Schema.org NewsArticle
- ✅ FAQPage con preguntas frecuentes
- ✅ Información del autor y publisher
- ✅ Fechas de publicación y modificación

### SEO técnico
- ✅ Archivos robots.txt configurado
- ✅ Sitemap.xml completo y actualizado
- ✅ Mejoras de velocidad de carga
- ✅ Meta tags para móviles

## 🚀 Próximos Pasos

### Para nuevos artículos:
1. Escribe el contenido HTML con la estructura SEO ya incluida
2. Ejecuta `node generate-sitemap.js` para actualizar el sitemap
3. Usa `seo-editor.html` para ajustes finales de metadatos

### Para artículos existentes:
1. Los artículos ya tienen mejoras SEO aplicadas
2. Usa `seo-editor.html` para modificaciones específicas
3. Vuelve a generar el sitemap si es necesario

### Mantenimiento:
1. Ejecuta `node generate-sitemap.js` después de añadir nuevos artículos
2. Revisa y actualiza metadatos según sea necesario
3. Monitorea el rendimiento SEO con herramientas como Google Search Console

## 📈 Mejores Prácticas

### Títulos
- 50-60 caracteres
- Incluir palabras clave principales
- Hacerlos atractivos y clickeables

### Descripciones
- 150-160 caracteres
- Incluir llamada a la acción
- Mencionar beneficios para el lector

### Palabras clave
- Investigar keywords relevantes
- Usar herramientas como Google Keyword Planner
- Incluir variaciones long-tail

### Imágenes
- Optimizar tamaño y calidad
- Usar nombres descriptivos
- Incluir alt text relevante

## 🔧 Instalación de Dependencias

Si necesitas instalar Node.js para usar los scripts:

```bash
# Verificar si Node.js está instalado
node --version

# Si no está instalado, instalar desde https://nodejs.org/
```

## 📞 Soporte

Para cualquier duda sobre el uso de estas herramientas:
1. Revisa este README
2. Ejecuta los scripts con el flag `--help` si está disponible
3. Revisa los comentarios en el código fuente

---

**¡Tu sitio web de movilidad eléctrica ahora tiene una optimización SEO completa y herramientas para mantenerla actualizada!** 🎉
