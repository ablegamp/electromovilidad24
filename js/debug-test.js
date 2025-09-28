// Script de prueba simplificado para debug
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🧪 Script de prueba iniciado');

    // Detectar página actual
    const currentPage = window.location.pathname.split('/').pop();
    console.log('📄 Página actual:', currentPage);

    // Determinar tipo de contenido
    let contentType, jsonUrl, gridId;
    if (currentPage === 'comparativas.html') {
        contentType = 'comparativas';
        jsonUrl = '/data/comparativas.json';
        gridId = 'comparativas-grid';
    } else if (currentPage === 'reviews.html') {
        contentType = 'reviews';
        jsonUrl = '/data/reviews.json';
        gridId = 'reviews-grid';
    } else {
        console.log('❌ Página no reconocida');
        return;
    }

    console.log('🔍 Configuración:', { contentType, jsonUrl, gridId });

    // Verificar que existe el grid
    const grid = document.getElementById(gridId);
    console.log('🎯 Grid encontrado:', !!grid, gridId);

    if (!grid) {
        console.log('❌ Grid no encontrado:', gridId);
        return;
    }

    try {
        // Cargar datos JSON
        console.log('📡 Intentando cargar:', jsonUrl);
        const response = await fetch(jsonUrl + '?ts=' + Date.now(), {
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('📊 Respuesta HTTP:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Datos cargados:', data.length, 'elementos');

        // Renderizar datos simples
        grid.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <strong>✅ DEBUG:</strong> Datos cargados correctamente (${data.length} elementos)
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${data.map(item => `
                    <div class="bg-white rounded-lg shadow-md p-6 border">
                        <h3 class="font-bold text-lg mb-2">${item.title}</h3>
                        <p class="text-gray-600 mb-3">${item.summary}</p>
                        <div class="text-sm text-gray-500">
                            📅 ${item.date} | ⏱️ ${item.readTime}
                        </div>
                        <div class="mt-3">
                            <span class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                ${item.category}
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        console.log('🎉 Contenido renderizado exitosamente');

    } catch (error) {
        console.error('❌ Error:', error);

        // Mostrar error en la página
        grid.innerHTML = `
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>❌ Error de carga:</strong> ${error.message}
                <br><br>
                <strong>Debug Info:</strong>
                <br>• URL intentada: ${jsonUrl}
                <br>• Página: ${currentPage}
                <br>• Grid ID: ${gridId}
                <br>• Error: ${error.toString()}
            </div>
        `;
    }
});
