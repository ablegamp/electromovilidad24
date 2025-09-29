#!/usr/bin/env node

/**
 * Generador automático de sitemap.xml para Movilidad Eléctrica 24
 * Uso: node generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Configuración de prioridades y frecuencias de cambio
const PAGE_CONFIG = {
  'index.html': { priority: '1.0', changefreq: 'daily' },
  'comparativas.html': { priority: '0.7', changefreq: 'weekly' },
  'reviews.html': { priority: '0.7', changefreq: 'weekly' },
  'calculadoras.html': { priority: '0.6', changefreq: 'monthly' },
  'sobre.html': { priority: '0.5', changefreq: 'monthly' },
  'contacto.html': { priority: '0.5', changefreq: 'monthly' },
  'privacidad.html': { priority: '0.3', changefreq: 'monthly' },
  'terminos.html': { priority: '0.3', changefreq: 'monthly' }
};

const ARTICLE_PRIORITY = '0.8';
const ARTICLE_CHANGEFREQ = 'weekly';

function findHtmlFiles(dir) {
  const files = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Ignorar directorios de sistema
        if (!item.startsWith('.') && item !== 'node_modules') {
          scanDirectory(fullPath);
        }
      } else if (stat.isFile() && item.endsWith('.html')) {
        // Excluir páginas legales y otras que no queremos en el sitemap principal
        if (!['privacidad.html', 'terminos.html'].includes(item)) {
          files.push(fullPath);
        }
      }
    }
  }

  scanDirectory(dir);
  return files;
}

function generateSitemap(files, baseUrl = '') {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const file of files) {
    const relativePath = path.relative('.', file).replace(/\\/g, '/');
    const url = baseUrl + '/' + relativePath;
    const filename = path.basename(file);

    // Determinar configuración según el tipo de archivo
    let config;
    if (PAGE_CONFIG[filename]) {
      config = PAGE_CONFIG[filename];
    } else if (relativePath.includes('/articulos/')) {
      config = { priority: ARTICLE_PRIORITY, changefreq: ARTICLE_CHANGEFREQ };
    } else {
      config = { priority: '0.6', changefreq: 'monthly' };
    }

    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <changefreq>${config.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${config.priority}</priority>\n`;
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>\n';
  return sitemap;
}

function main(baseUrl = '') {
  const rootDir = '.';
  const outputFile = 'sitemap.xml';

  try {
    console.log('🔍 Escaneando archivos HTML...');
    const htmlFiles = findHtmlFiles(rootDir);
    console.log(`📄 Encontrados ${htmlFiles.length} archivos HTML`);

    console.log('⚙️  Generando sitemap...');
    const sitemap = generateSitemap(htmlFiles, baseUrl);

    console.log(`💾 Guardando sitemap en ${outputFile}...`);
    fs.writeFileSync(outputFile, sitemap);

    console.log('✅ Sitemap generado exitosamente!');
    console.log(`📊 URLs incluidas: ${htmlFiles.length}`);

    // Mostrar algunas URLs como ejemplo
    console.log('\n🔗 URLs principales incluidas:');
    htmlFiles.slice(0, 5).forEach(file => {
      const relativePath = path.relative('.', file).replace(/\\/g, '/');
      console.log(`   • ${baseUrl}/${relativePath}`);
    });
    if (htmlFiles.length > 5) {
      console.log(`   ... y ${htmlFiles.length - 5} más`);
    }

  } catch (error) {
    console.error('❌ Error generando sitemap:', error.message);
    process.exit(1);
  }
}

// Configuración de la URL base del sitio
const SITE_URL = 'https://electromovilidad24.com'; // Reemplaza con tu dominio real

// Ejecutar si se llama directamente
if (require.main === module) {
  main(SITE_URL);
}

module.exports = { generateSitemap, findHtmlFiles };
