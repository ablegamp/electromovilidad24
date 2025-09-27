#!/usr/bin/env node

/**
 * Script para mejorar el SEO de artículos existentes
 * Uso: node improve-article-seo.js
 */

const fs = require('fs');
const path = require('path');

// Plantilla de mejoras SEO adicionales
const SEO_IMPROVEMENTS = `  <!-- SEO mejorado -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="googlebot" content="index, follow" />
  <meta name="theme-color" content="#10B981" />
  <meta name="msapplication-TileColor" content="#10B981" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="format-detection" content="telephone=no" />
  <!-- Enlaces prev/next para navegación -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="https://cdn.tailwindcss.com" />
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />`;

function improveArticleSEO(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Verificar si ya tiene las mejoras aplicadas
    if (content.includes('SEO mejorado')) {
      console.log(`⚠️  ${path.basename(filePath)} ya tiene mejoras SEO aplicadas`);
      return false;
    }

    // Buscar la posición después del viewport meta
    const viewportRegex = /<meta name="viewport" content="[^"]*" \/>/;
    const insertPosition = content.search(viewportRegex) + content.match(viewportRegex)[0].length;

    // Insertar las mejoras SEO
    const improvedContent = content.slice(0, insertPosition) + '\n' + SEO_IMPROVEMENTS + '\n' + content.slice(insertPosition);

    // Guardar el archivo mejorado
    fs.writeFileSync(filePath, improvedContent, 'utf8');

    console.log(`✅ SEO mejorado en ${path.basename(filePath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

function findArticleFiles(dir) {
  const files = [];

  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory() && item === 'articulos') {
        // Escanear específicamente la carpeta de artículos
        const articlesDir = fullPath;
        const articleItems = fs.readdirSync(articlesDir);

        for (const articleItem of articleItems) {
          const articlePath = path.join(articlesDir, articleItem);
          const articleStat = fs.statSync(articlePath);

          if (articleStat.isFile() && articleItem.endsWith('.html')) {
            files.push(articlePath);
          }
        }
      }
    }
  }

  scanDirectory(dir);
  return files;
}

function main() {
  const rootDir = '.';

  try {
    console.log('🔍 Buscando artículos para mejorar SEO...');
    const articleFiles = findArticleFiles(rootDir);

    if (articleFiles.length === 0) {
      console.log('❌ No se encontraron artículos para mejorar');
      return;
    }

    console.log(`📄 Encontrados ${articleFiles.length} artículos`);
    console.log('\n🚀 Aplicando mejoras SEO...\n');

    let improved = 0;
    let skipped = 0;

    for (const file of articleFiles) {
      if (improveArticleSEO(file)) {
        improved++;
      } else {
        skipped++;
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   ✅ Mejorados: ${improved}`);
    console.log(`   ⚠️  Omitidos: ${skipped}`);
    console.log(`   📄 Total: ${articleFiles.length}`);

  } catch (error) {
    console.error('❌ Error ejecutando mejoras SEO:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { improveArticleSEO, findArticleFiles };
