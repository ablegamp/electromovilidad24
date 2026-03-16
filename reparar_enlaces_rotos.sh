#!/bin/bash

echo "🔧 REPARANDO ENLACES ROTOS"
echo "========================="

BASE_DIR="/home/jmartinf/Documentos/electromovilidad24"
ARTICULOS_DIR="$BASE_DIR/articulos"
REPAIR_LOG="$BASE_DIR/reparaciones_enlaces.log"

> "$REPAIR_LOG"

# Función para encontrar reemplazos sugeridos
buscar_reemplazo() {
    local enlace_roto="$1"
    local nombre_base=$(echo "$enlace_roto" | sed 's/\.html$//' | sed 's/2025$//' | sed 's/2026$//')
    
    # Buscar archivos similares
    find "$ARTICULOS_DIR" -name "*${nombre_base}*.html" -type f | head -3
}

# Reparar los enlaces más comunes
echo "Reparando enlaces rotos más frecuentes..."

# 1. Reparar ../noticias.html (16 ocurrencias)
echo "Reparando ../noticias.html..."
find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "../noticias.html" {} \; | while read -r archivo; do
    echo "  - Reparando en $(basename "$archivo")"
    sed -i 's|href="../noticias.html"|href="../index.html#news-section"|g' "$archivo"
    echo "    ../noticias.html → ../index.html#news-section" >> "$REPAIR_LOG"
done

# 2. Reparar mejores-coches-electricos-2025.html (8 ocurrencias)
echo "Reparando mejores-coches-electricos-2025.html..."
if [[ -f "$ARTICULOS_DIR/mejores-coches-electricos-baratos-espana-2025.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "mejores-coches-electricos-2025.html" {} \; | while read -r archivo; do
        echo "  - Reparando en $(basename "$archivo")"
        sed -i 's|mejores-coches-electricos-2025.html|mejores-coches-electricos-baratos-espana-2025.html|g' "$archivo"
        echo "    mejores-coches-electricos-2025.html → mejores-coches-electricos-baratos-espana-2025.html" >> "$REPAIR_LOG"
    done
fi

# 3. Reparar baterias-lfp-vs-ncm-ventajas-desventajas.html (5 ocurrencias)
echo "Reparando baterias-lfp-vs-ncm-ventajas-desventajas.html..."
if [[ -f "$ARTICULOS_DIR/baterias-lfp-vs-ncm-diferencias-ventajas-eleccion-2026.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "baterias-lfp-vs-ncm-ventajas-desventajas.html" {} \; | while read -r archivo; do
        echo "  - Reparando en $(basename "$archivo")"
        sed -i 's|baterias-lfp-vs-ncm-ventajas-desventajas.html|baterias-lfp-vs-ncm-diferencias-ventajas-eleccion-2026.html|g' "$archivo"
        echo "    baterias-lfp-vs-ncm-ventajas-desventajas.html → baterias-lfp-vs-ncm-diferencias-ventajas-eleccion-2026.html" >> "$REPAIR_LOG"
    done
fi

# 4. Reparar bateria-12v-tesla-fallo-como-actuar.html (5 ocurrencias)
echo "Reparando bateria-12v-tesla-fallo-como-actuar.html..."
if [[ -f "$ARTICULOS_DIR/bateria-12v-coche-electrico-guia-completa.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "bateria-12v-tesla-fallo-como-actuar.html" {} \; | while read -r archivo; do
        echo "  - Reparando en $(basename "$archivo")"
        sed -i 's|bateria-12v-tesla-fallo-como-actuar.html|bateria-12v-coche-electrico-guia-completa.html|g' "$archivo"
        echo "    bateria-12v-tesla-fallo-como-actuar.html → bateria-12v-coche-electrico-guia-completa.html" >> "$REPAIR_LOG"
    done
fi

# 5. Reparar coches-electricos-llegan-espana-2026.html (4 ocurrencias)
echo "Reparando coches-electricos-llegan-espana-2026.html..."
if [[ -f "$ARTICULOS_DIR/coches-electricos-baratos-espana-2025.html" ]]; then
    find "$ARTICULOS_DIR" -name "*.html" -type f -exec grep -l "coches-electricos-llegan-espana-2026.html" {} \; | while read -r archivo; do
        echo "  - Reparando en $(basename "$archivo")"
        sed -i 's|coches-electricos-llegan-espana-2026.html|coches-electricos-baratos-espana-2025.html|g' "$archivo"
        echo "    coches-electricos-llegan-espana-2026.html → coches-electricos-baratos-espana-2025.html" >> "$REPAIR_LOG"
    done
fi

echo ""
echo "✅ Reparaciones automáticas completadas"
echo "📄 Log de reparaciones guardado en: $REPAIR_LOG"
echo ""
echo "🔍 Volviendo a detectar enlaces rotos restantes..."

# Volver a ejecutar la detección
./detectar_enlaces_rotos.sh > /dev/null 2>&1

if [[ -f "$BASE_DIR/enlaces_rotos.txt" ]] && [[ -s "$BASE_DIR/enlaces_rotos.txt" ]]; then
    RESTANTES=$(grep -c "ENLACE ROTO" "$BASE_DIR/enlaces_rotos.txt" 2>/dev/null || echo "0")
    echo "📊 Enlaces rotos restantes: $RESTANTES"
    
    if [[ $RESTANTES -gt 0 ]]; then
        echo ""
        echo "🔥 Enlaces rotos más frecuentes restantes:"
        grep "ENLACE ROTO" "$BASE_DIR/enlaces_rotos.txt" | cut -d: -f2 | sort | uniq -c | sort -nr | head -10
    fi
else
    echo "🎉 Todos los enlaces rotos han sido reparados"
fi
