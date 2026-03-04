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
  'guias.html': { priority: '0.7', changefreq: 'weekly' },
  'calculadoras.html': { priority: '0.6', changefreq: 'monthly' },
  'sobre.html': { priority: '0.5', changefreq: 'monthly' },
  'contacto.html': { priority: '0.5', changefreq: 'monthly' },
  'privacidad.html': { priority: '0.3', changefreq: 'monthly' },
  'terminos.html': { priority: '0.3', changefreq: 'monthly' }
};

const ARTICLE_DEFAULT_PRIORITY = '0.6';
const ARTICLE_DEFAULT_CHANGEFREQ = 'monthly';

const ARTICLE_PILLAR_RULES = [
  { match: /ayudas|subvencion|moves|deduccion|fiscales/i, priority: '0.8', changefreq: 'weekly' },
  { match: /coste|precio|kilometro|km|ahorrar/i, priority: '0.8', changefreq: 'weekly' },
  { match: /cargar|carga|wallbox|recarga/i, priority: '0.8', changefreq: 'weekly' },
  { match: /autonomia|bateria|degradacion|soh/i, priority: '0.7', changefreq: 'weekly' }
];

function formatLastmod(date) {
  return date.toISOString().split('T')[0];
}

function getFileLastmod(filePath) {
  const stat = fs.statSync(filePath);
  return formatLastmod(stat.mtime);
}

function getArticleConfig(relativePath) {
  for (const rule of ARTICLE_PILLAR_RULES) {
    if (rule.match.test(relativePath)) return { priority: rule.priority, changefreq: rule.changefreq };
  }
  return { priority: ARTICLE_DEFAULT_PRIORITY, changefreq: ARTICLE_DEFAULT_CHANGEFREQ };
}

function isArticlePath(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  return normalized === 'articulos' || normalized.startsWith('articulos/') || normalized.includes('/articulos/');
}

function findHtmlFiles(dir) {
  const files = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Ignorar directorios de sistema
        if (!item.startsWith('.') && item !== 'node_modules' && item !== 'imagenes') {
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
    const lastmod = getFileLastmod(file);

    // Determinar configuración según el tipo de archivo
    let config;
    if (PAGE_CONFIG[filename]) {
      config = PAGE_CONFIG[filename];
    } else if (isArticlePath(relativePath)) {
      config = getArticleConfig(relativePath);
    } else {
      config = { priority: '0.6', changefreq: 'monthly' };
    }

    sitemap += '  <url>\n';
    sitemap += `    <loc>${url}</loc>\n`;
    sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
    sitemap += `    <changefreq>${config.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${config.priority}</priority>\n`;
    sitemap += '  </url>\n';
  }

  sitemap += '</urlset>\n';
  return sitemap;
}

function generateSitemapIndex(sitemaps, baseUrl = '') {
  let index = '<?xml version="1.0" encoding="UTF-8"?>\n';
  index += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const item of sitemaps) {
    index += '  <sitemap>\n';
    index += `    <loc>${baseUrl}/${item.filename}</loc>\n`;
    index += `    <lastmod>${item.lastmod}</lastmod>\n`;
    index += '  </sitemap>\n';
  }

  index += '</sitemapindex>\n';
  return index;
}

function main(baseUrl = '') {
  const rootDir = '.';
  const indexFile = 'sitemap.xml';
  const pagesSitemapFile = 'sitemap-pages.xml';
  const articlesSitemapFile = 'sitemap-articulos.xml';

  try {
    console.log('🔍 Escaneando archivos HTML...');
    const htmlFiles = findHtmlFiles(rootDir);
    console.log(`📄 Encontrados ${htmlFiles.length} archivos HTML`);

    const pages = [];
    const articles = [];

    for (const file of htmlFiles) {
      const relativePath = path.relative('.', file).replace(/\\/g, '/');
      if (isArticlePath(relativePath)) {
        articles.push(file);
      } else {
        pages.push(file);
      }
    }

    // Asegurar que la home (/) está incluida (aunque exista index.html)
    const indexPath = path.join(rootDir, 'index.html');
    const homeLastmod = fs.existsSync(indexPath) ? getFileLastmod(indexPath) : formatLastmod(new Date());

    console.log('⚙️  Generando sitemaps...');
    const pagesSitemap = generateSitemap(pages, baseUrl);
    const articlesSitemap = generateSitemap(articles, baseUrl);

    // Inyectar la home (/) al sitemap de páginas con máxima prioridad
    const homeUrlBlock = [
      '  <url>',
      `    <loc>${baseUrl}/</loc>`,
      `    <lastmod>${homeLastmod}</lastmod>`,
      '    <changefreq>daily</changefreq>',
      '    <priority>1.0</priority>',
      '  </url>'
    ].join('\n') + '\n';

    const pagesSitemapWithHome = pagesSitemap.replace(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + homeUrlBlock
    );

    const indexLastmod = formatLastmod(new Date());
    const indexXml = generateSitemapIndex(
      [
        { filename: pagesSitemapFile, lastmod: indexLastmod },
        { filename: articlesSitemapFile, lastmod: indexLastmod }
      ],
      baseUrl
    );

    console.log(`💾 Guardando sitemap index en ${indexFile}...`);
    fs.writeFileSync(indexFile, indexXml);

    console.log(`� Guardando sitemap de páginas en ${pagesSitemapFile}...`);
    fs.writeFileSync(pagesSitemapFile, pagesSitemapWithHome);

    console.log(`� Guardando sitemap de artículos en ${articlesSitemapFile}...`);
    fs.writeFileSync(articlesSitemapFile, articlesSitemap);

    console.log('✅ Sitemap generado exitosamente!');
    console.log(`📊 URLs incluidas:`);
    console.log(`   • Páginas: ${pages.length} (+ home /)`);
    console.log(`   • Artículos: ${articles.length}`);
    console.log(`   • Total: ${pages.length + articles.length + 1}`);

  } catch (error) {
    console.error('❌ Error generando sitemap:', error.message);
    process.exit(1);
  }
}

// Configuración de la URL base del sitio
const SITE_URL = 'https://www.electromovilidad24.com'; // Reemplaza con tu dominio real

// Ejecutar si se llama directamente
if (require.main === module) {
  main(SITE_URL);
}

module.exports = { generateSitemap, findHtmlFiles };
