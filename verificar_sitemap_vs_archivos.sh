#!/bin/bash

echo "🔍 Detectando URLs en sitemap que no existen físicamente..."
echo "==========================================================="

BASE_DIR="/home/jmartinf/Documentos/electromovilidad24"
SITEMAP="$BASE_DIR/sitemap-articulos.xml"
RESULT_FILE="$BASE_DIR/urls_sitemap_no_existen.txt"

echo "" > "$RESULT_FILE"

# Extraer URLs del sitemap y verificar si existen los archivos
grep -oP '(?<=<loc>).*?(?=</loc>)' "$SITEMAP" | while read -r url; do
    # Convertir URL a ruta de archivo
    ruta_relativa=$(echo "$url" | sed 's|https://www.electromovilidad24.com/||' | sed 's|https://electromovilidad24.com/||')
    ruta_completa="$BASE_DIR/$ruta_relativa"
    
    if [[ ! -f "$ruta_completa" ]]; then
        echo "❌ URL en sitemap pero archivo NO EXISTE:"
        echo "   URL: $url"
        echo "   Ruta esperada: $ruta_relativa"
        echo ""
        
        echo "URL: $url" >> "$RESULT_FILE"
        echo "Ruta: $ruta_relativa" >> "$RESULT_FILE"
        echo "" >> "$RESULT_FILE"
    fi
done

echo ""
echo "==========================================================="
echo "📊 Resumen"
echo "==========================================================="

if [[ -s "$RESULT_FILE" ]]; then
    TOTAL=$(grep -c "^URL:" "$RESULT_FILE" 2>/dev/null || echo "0")
    echo "❌ Se encontraron $TOTAL URLs en sitemap sin archivo físico"
    echo "📄 Detalles guardados en: $RESULT_FILE"
    echo ""
    echo "📋 Listado:"
    cat "$RESULT_FILE"
else
    echo "✅ Todas las URLs del sitemap tienen archivo físico"
fi
