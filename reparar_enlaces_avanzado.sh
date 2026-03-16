#!/bin/bash

echo "🔧 REPARACIÓN AVANZADA DE ENLACES ROTOS"
echo "======================================"

BASE_DIR="/home/jmartinf/Documentos/electromovilidad24"
ARTICULOS_DIR="$BASE_DIR/articulos"
REPAIR_LOG="$BASE_DIR/reparaciones_avanzadas.log"

> "$REPAIR_LOG"

# Función para encontrar el mejor reemplazo
buscar_mejor_reemplazo() {
    local enlace_roto="$1"
    local nombre_base=$(echo "$enlace_roto" | sed 's/\.html$//' | sed 's/-202[0-9]$//')
    
    # Estrategias de búsqueda
    local candidatos=()
    
    # 1. Buscar exacto con diferente año
    find "$ARTICULOS_DIR" -name "${nombre_base}-202*.html" -type f | while read -r candidato; do
        echo "$(basename "$candidato")"
    done
    
    # 2. Buscar parcial
    find "$ARTICULOS_DIR" -name "*${nombre_base}*.html" -type f | head -3 | while read -r candidato; do
        echo "$(basename "$candidato")"
    done
}

# Reparaciones específicas para los enlaces más comunes

echo "Reparando mejores-coches-electricos-2025.html (8 ocurrencias)..."
if [[ -f "$ARTICULOS_DIR/mejores-coches-electricos-baratos-espana-2025.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "mejores-coches-electricos-2025.html" {} \; | while read -r archivo; do
        sed -i 's|mejores-coches-electricos-2025.html|mejores-coches-electricos-baratos-espana-2025.html|g' "$archivo"
        echo "mejores-coches-electricos-2025.html → mejores-coches-electricos-baratos-espana-2025.html" >> "$REPAIR_LOG"
    done
fi

echo "Reparando bateria-12v-tesla-fallo-como-actuar.html (5 ocurrencias)..."
if [[ -f "$ARTICULOS_DIR/bateria-12v-coche-electrico-guia-completa.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "bateria-12v-tesla-fallo-como-actuar.html" {} \; | while read -r archivo; do
        sed -i 's|bateria-12v-tesla-fallo-como-actuar.html|bateria-12v-coche-electrico-guia-completa.html|g' "$archivo"
        echo "bateria-12v-tesla-fallo-como-actuar.html → bateria-12v-coche-electrico-guia-completa.html" >> "$REPAIR_LOG"
    done
fi

echo "Reparando mejores-coches-electricos-baratos-espana-2025.html (3 ocurrencias)..."
if [[ -f "$ARTICULOS_DIR/coches-electricos-baratos-espana-2025.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "mejores-coches-electricos-baratos-espana-2025.html" {} \; | while read -r archivo; do
        sed -i 's|mejores-coches-electricos-baratos-espana-2025.html|coches-electricos-baratos-espana-2025.html|g' "$archivo"
        echo "mejores-coches-electricos-baratos-espana-2025.html → coches-electricos-baratos-espana-2025.html" >> "$REPAIR_LOG"
    done
fi

echo "Reparando ../articulos/mejores-coches-electricos-2025-precio-calidad.html (3 ocurrencias)..."
if [[ -f "$ARTICULOS_DIR/coches-electricos-baratos-espana-2025.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "../articulos/mejores-coches-electricos-2025-precio-calidad.html" {} \; | while read -r archivo; do
        sed -i 's|../articulos/mejores-coches-electricos-2025-precio-calidad.html|coches-electricos-baratos-espana-2025.html|g' "$archivo"
        echo "../articulos/mejores-coches-electricos-2025-precio-calidad.html → coches-electricos-baratos-espana-2025.html" >> "$REPAIR_LOG"
    done
fi

echo "Reparando chery-bateria-estado-solido-1500km-autonomia.html (3 ocurrencias)..."
if [[ -f "$ARTICULOS_DIR/chery-bateria-estado-solido-1300km-autonomia-2025.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "chery-bateria-estado-solido-1500km-autonomia.html" {} \; | while read -r archivo; do
        sed -i 's|chery-bateria-estado-solido-1500km-autonomia.html|chery-bateria-estado-solido-1300km-autonomia-2025.html|g' "$archivo"
        echo "chery-bateria-estado-solido-1500km-autonomia.html → chery-bateria-estado-solido-1300km-autonomia-2025.html" >> "$REPAIR_LOG"
    done
fi

echo "Reparando byd-atto3-2025-review.html (3 ocurrencias)..."
if [[ -f "$ARTICULOS_DIR/byd-atto-3-review-precios-autonomia-espana.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "byd-atto3-2025-review.html" {} \; | while read -r archivo; do
        sed -i 's|byd-atto3-2025-review.html|byd-atto-3-review-precios-autonomia-espana.html|g' "$archivo"
        echo "byd-atto3-2025-review.html → byd-atto-3-review-precios-autonomia-espana.html" >> "$REPAIR_LOG"
    done
fi

echo ""
echo "✅ Reparaciones avanzadas completadas"
echo "📄 Log guardado en: $REPAIR_LOG"

# Verificar resultados
./detectar_enlaces_rotos.sh > /dev/null 2>&1

if [[ -f "$BASE_DIR/enlaces_rotos.txt" ]] && [[ -s "$BASE_DIR/enlaces_rotos.txt" ]]; then
    RESTANTES=$(grep -c "ENLACE ROTO" "$BASE_DIR/enlaces_rotos.txt" 2>/dev/null || echo "0")
    echo ""
    echo "📊 Enlaces rotos restantes: $RESTANTES"
    
    if [[ $RESTANTES -gt 0 ]]; then
        echo ""
        echo "🔥 Enlaces rotos más frecuentes restantes:"
        grep "ENLACE ROTO" "$BASE_DIR/enlaces_rotos.txt" | cut -d: -f2 | sort | uniq -c | sort -nr | head -10
    fi
fi
