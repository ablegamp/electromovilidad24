#!/bin/bash

echo "🔍 Detectando enlaces rotos en el sitio web..."
echo "=========================================="

BASE_DIR="/home/jmartinf/Documentos/electromovilidad24"
ARTICULOS_DIR="$BASE_DIR/articulos"
RESULT_FILE="$BASE_DIR/enlaces_rotos.txt"

> "$RESULT_FILE"

echo "Analizando archivos HTML..."

find "$ARTICULOS_DIR" -name "*.html" -type f | while read -r archivo_actual; do
    echo "Analizando: $(basename "$archivo_actual")"
    
    grep -oE 'href="[^"]*\.html"' "$archivo_actual" | while read -r enlace; do
        url_enlace=$(echo "$enlace" | sed 's/href="//g' | sed 's/"//g')
        
        if [[ "$url_enlace" == http* ]] || [[ "$url_enlace" == *"#"* ]]; then
            continue
        fi
        
        ruta_completa="$ARTICULOS_DIR/$url_enlace"
        
        if [[ ! -f "$ruta_completa" ]]; then
            echo "❌ ENLACE ROTO: $url_enlace"
            echo "   En archivo: $(basename "$archivo_actual")"
            echo ""
            
            echo "ENLACE ROTO: $url_enlace" >> "$RESULT_FILE"
            echo "Archivo: $(basename "$archivo_actual")" >> "$RESULT_FILE"
            echo "" >> "$RESULT_FILE"
        fi
    done
done

echo ""
echo "=========================================="
echo "📊 Resumen del análisis"
echo "=========================================="

if [[ -f "$RESULT_FILE" ]] && [[ -s "$RESULT_FILE" ]]; then
    TOTAL_ENCONTRADOS=$(grep -c "ENLACE ROTO" "$RESULT_FILE" 2>/dev/null || echo "0")
    echo "❌ Se encontraron $TOTAL_ENCONTRADOS enlaces rotos"
    echo "📄 Los detalles están guardados en: $RESULT_FILE"
    echo ""
    echo "📋 Enlaces rotos encontrados:"
    cat "$RESULT_FILE"
else
    echo "✅ No se encontraron enlaces rotos"
fi
