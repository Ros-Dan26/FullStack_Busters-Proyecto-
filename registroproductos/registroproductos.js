// === LÓGICA DE REGISTRO DE PRODUCTO (sin tocar el diseño) ===
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formularioRegistro');
  const fileInput = document.getElementById('imagen');
  const previewImg = document.getElementById('preview'); // opcional: si existe, muestra preview
  const contenedorResultado = document.getElementById('producto'); // opcional: si existe, renderiza respuesta

  // --- PREVIEW DE IMAGEN (NO cambia diseño; solo si existe #preview) ---
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (!previewImg) return; // si no hay img#preview, no hacemos nada visual

      if (!file) {
        previewImg.removeAttribute('src');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Selecciona una imagen válida (jpg, png, etc.)');
        fileInput.value = '';
        previewImg.removeAttribute('src');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2 MB
        alert('La imagen debe ser menor a 2MB');
        fileInput.value = '';
        previewImg.removeAttribute('src');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => (previewImg.src = e.target.result);
      reader.readAsDataURL(file);
    });
  }

  // --- SUBMIT DEL FORM (manteniendo tu diseño) ---
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Obtén valores de tus inputs SIN cambiar tu HTML
      const nombre = document.getElementById('nombre')?.value.trim() ?? '';
      const modelo = document.getElementById('modelo')?.value.trim() ?? '';
      const descripcion = document.getElementById('descripcion')?.value.trim()
        ?? document.getElementById('description')?.value.trim() // por si tu input se llama "description"
        ?? '';
      const precio = document.getElementById('precio')?.value ?? document.getElementById('price')?.value ?? '';
      const color = document.getElementById('color')?.value ?? document.getElementById('colorProduct')?.value ?? '';
      const talla = document.getElementById('talla')?.value ?? document.getElementById('size')?.value ?? '';
      const genero = document.getElementById('genero')?.value ?? document.getElementById('gender')?.value ?? '';
      const estado = document.getElementById('estado')?.value ?? document.getElementById('status')?.value ?? '';
      const marca = document.getElementById('marca')?.value ?? document.getElementById('brand')?.value ?? '';

      // Validación mínima (no toca diseño)
      if (!nombre || !modelo || !precio || !color || !talla || !genero || !estado || !marca) {
        alert('Por favor completa los campos requeridos.');
        return;
      }

      // Construimos FormData manualmente para mapear a las keys del backend SIN cambiar tu HTML
      const fd = new FormData();
      fd.set('name', nombre);
      fd.set('model', modelo);
      fd.set('description', descripcion);
      fd.set('price', precio);
      fd.set('colorProduct', color);
      fd.set('size', talla);
      fd.set('gender', genero);
      fd.set('status', estado);
      fd.set('brand', marca);

      // Imagen (si el backend la espera bajo "file")
      const file = fileInput?.files?.[0];
      if (file) {
        fd.set('file', file, file.name);
      }

      try {
        console.log('>>> Enviando a backend…');
        const res = await fetch('http://jft314.ddns.net:8080/nso/api/v1/nso/product/save', {
          method: 'POST',
          body: fd, // NO pongas Content-Type aquí: fetch lo define con boundary
        });

        const raw = await res.text();
        if (!res.ok) {
          console.error('❌ Error HTTP:', res.status, res.statusText);
          console.error('❌ Cuerpo del error:', raw);
          alert(`Error al guardar: ${res.status} ${res.statusText}`);
          return;
        }

        let data = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch (err) {
          console.warn('⚠️ Respuesta no JSON:', raw);
          alert('Producto guardado (respuesta no JSON).');
          form.reset();
          if (previewImg) previewImg.removeAttribute('src');
          return;
        }

        console.log('✅ Guardado OK:', data);

        // Normaliza estructura (algunas APIs devuelven product, otras products)
        const product = data.product || data.products || data;
        const images = data.images || product?.images || [];

        // Renderiza resultado SOLO si existe #producto (no cambia tu diseño)
        if (contenedorResultado) {
          contenedorResultado.innerHTML = `
            <div class="card p-3">
              <h5 class="mb-1">
                ${product?.name ?? '(sin nombre)'}
                ${product?.model ? ` (${product.model})` : ''}
              </h5>
              <p class="mb-1"><b>Marca:</b> ${product?.brand ?? '-'}</p>
              <p class="mb-1"><b>Precio:</b> $${product?.price ?? '-'}</p>
              <p class="mb-1"><b>Color:</b> ${product?.colorProduct ?? '-'}</p>
              <p class="mb-1"><b>Status:</b> ${product?.status ?? '-'}</p>
              <p class="mb-1"><b>Talla:</b> ${product?.size ?? '-'}</p>
              <p class="mb-1"><b>Descripción:</b> ${product?.description ?? '-'}</p>
              ${product?.urlBrand ? `<img src="${product.urlBrand}" alt="${product?.brand ?? ''}" width="100">` : ''}
              <div class="mt-2 d-flex gap-2 flex-wrap">
                ${images.map(img => `<img src="${img.url}" width="150" alt="img">`).join('')}
              </div>
            </div>
          `;
        }

        alert('Producto guardado correctamente.');
        form.reset();
        if (previewImg) previewImg.removeAttribute('src');

      } catch (err) {
        console.error('❌ Error de red/JS:', err);
        alert('Error de red o de JavaScript: ' + err.message);
      }
    });
  }
});
