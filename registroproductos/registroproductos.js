// /registroproductos/registrar-productos.js
(() => {
  // =========================
  // CONFIG: ENDPOINTS BACKEND
  // =========================
  const API_BASE = "http://jft314.ddns.net:8080/nso/api/v1/nso";

  // Catálogos (ProductsEndPoints.*)
  const EP_LOOKUP_BRANDS  = `${API_BASE}/product/lookup/brands`;
  const EP_LOOKUP_COLORS  = `${API_BASE}/product/lookup/colors_products`;
  const EP_LOOKUP_SIZES   = `${API_BASE}/product/lookup/sizes`;
  const EP_LOOKUP_STATUS  = `${API_BASE}/product/lookup/status`;

  // Usuarios (para resolver id_user)
  const EP_USERS_ALL      = `${API_BASE}/nso/user/all`;

  // Producto  ✅ sin doble /nso
  const EP_SAVE_PRODUCT   = `${API_BASE}/product/save`;
  const EP_ADD_IMAGE      = `${API_BASE}/product/add/image`;

  // =========================
  // CACHES PARA VALIDACIÓN
  // =========================
  const CATALOG_CACHE = {
    brands: [],
    colors: [],
    sizes:  [],
    status: [],
    users:  []
  };

  // =========================
  // HELPERS GENERALES
  // =========================

  // Fetch tolerante a 204/no-JSON y con diagnóstico
  async function safeJsonFetch(url, options = {}) {
    const res = await fetch(url, { ...options, mode: "cors" });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} - ${url} - ${text}`);
    }
    if (res.status === 204) return []; // No Content -> arreglo vacío
    try { return await res.json(); }
    catch { return await res.text(); }  // por si el backend devuelve texto
  }

  // Limpia y agrega un placeholder
  function resetAndPlaceholder(selectEl, placeholder) {
    if (!selectEl) return;
    selectEl.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    selectEl.appendChild(opt);
  }

  // Rellena un <select> con items[{valueKey,labelKey}]
  function populateSelect(selectEl, items, { valueKey = "id", labelKey = "name" } = {}) {
    if (!selectEl || !Array.isArray(items)) return;
    const frag = document.createDocumentFragment();
    items.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item[valueKey];
      opt.textContent = item[labelKey] ?? "";
      frag.appendChild(opt);
    });
    selectEl.appendChild(frag);
  }

  // Normaliza las respuestas de catálogos aunque el backend cambie la forma
  function normalizeArray(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === "object") {
      for (const key of ["data","content","items","list","results"]) {
        if (Array.isArray(raw[key])) return raw[key];
      }
      const vals = Object.values(raw);
      if (vals.length && vals.every(v => typeof v === "object")) return vals;
    }
    return [];
  }

  // Intenta seleccionar una etiqueta “humana” si no existe `name`
  function guessLabel(obj) {
    if (!obj || typeof obj !== "object") return "";
    const keysByPriority = ["name","nombre","label","value","brand","status","size","description","title"];
    for (const k of keysByPriority) if (obj[k]) return obj[k];

    const hex = obj.hex || obj.hex_code || obj.hexCode || obj.hexadecimal || obj.hexColor;
    if (obj.colorName && hex) return `${obj.colorName} (${hex})`;
    if (obj.color && hex)     return `${obj.color} (${hex})`;
    if (hex)                  return hex;

    for (const k of Object.keys(obj)) {
      const v = obj[k];
      if (typeof v === "string" && v.trim()) return v;
    }
    return String(obj.id ?? "");
  }

  // Carga y normaliza catálogos
  async function precargarCatalogos() {
    const [brandsRaw, colorsRaw, sizesRaw, statusRaw] = await Promise.all([
      safeJsonFetch(EP_LOOKUP_BRANDS),
      safeJsonFetch(EP_LOOKUP_COLORS),
      safeJsonFetch(EP_LOOKUP_SIZES),
      safeJsonFetch(EP_LOOKUP_STATUS),
    ]);

    const brands = normalizeArray(brandsRaw).map(o => ({
      id:   o.id ?? o.id_brand ?? o.brandId ?? o.value,
      name: guessLabel(o),
      raw:  o
    }));

    const colors = normalizeArray(colorsRaw).map(o => ({
      id:   o.id ?? o.id_color ?? o.colorId ?? o.value,
      name: guessLabel(o),
      hex:  o.hex || o.hex_code || o.hexCode || o.hexadecimal || null,
      raw:  o
    }));

    const sizes = normalizeArray(sizesRaw).map(o => ({
      id:   o.id ?? o.id_size ?? o.sizeId ?? o.value,
      name: guessLabel(o),
      raw:  o
    }));

    const status = normalizeArray(statusRaw).map(o => ({
      id:   o.id ?? o.id_status ?? o.statusId ?? o.value,
      name: guessLabel(o),
      raw:  o
    }));

    // Diagnóstico visible en consola
    console.group("[Catálogos registrar productos]");
    console.log("Brands:", brands);
    console.log("Colors:", colors);
    console.log("Sizes:", sizes);
    console.log("Status:", status);
    console.groupEnd();

    return { brands, colors, sizes, status };
  }

  // Obtiene id_user de localStorage o del backend
  async function getActiveUserId() {
    try {
      const u = JSON.parse(localStorage.getItem("usuarioActivo"));
      if (u?.id) return u.id;

      if (u?.email) {
        const users = await safeJsonFetch(EP_USERS_ALL);
        const found = (users || []).find(x => (x.email || "").toLowerCase() === u.email.toLowerCase());
        if (found?.id) return found.id;
      }
    } catch {}
    const users = await safeJsonFetch(EP_USERS_ALL);
    if (Array.isArray(users) && users[0]?.id) return users[0].id;

    throw new Error("No hay un usuario válido para asociar el producto (id_user).");
  }

  // =========================
  // VALIDACIONES PRE-POST
  // =========================
  function existsId(arr, id) {
    id = Number(id);
    return Array.isArray(arr) && arr.some(x => Number(x.id) === id);
  }

  function validateBeforePost({ id_user, id_brand, id_color, id_size, id_status }) {
    const missing = [];
    if (!existsId(CATALOG_CACHE.users,  id_user))   missing.push("Usuario (id_user)");
    if (!existsId(CATALOG_CACHE.brands, id_brand))  missing.push("Marca (id_brand)");
    if (!existsId(CATALOG_CACHE.colors, id_color))  missing.push("Color (id_color)");
    if (!existsId(CATALOG_CACHE.sizes,  id_size))   missing.push("Talla (id_size)");
    if (!existsId(CATALOG_CACHE.status, id_status)) missing.push("Estado (id_status)");
    return missing;
  }

  // =========================
  // ARRANQUE DE LA PANTALLA
  // =========================
  document.addEventListener("DOMContentLoaded", async () => {
    // Referencias al DOM
    const form          = document.getElementById("formularioRegistro");
    const btnPublicar   = document.getElementById("btn-publicar");
    const nombre        = document.getElementById("nombre");
    const modelo        = document.getElementById("modelo");
    const descripcion   = document.getElementById("descripcion");
    const precio        = document.getElementById("precio");
    const selMarca      = document.getElementById("marca");
    const selColor      = document.getElementById("color");
    const selTalla      = document.getElementById("talla");
    const selEstado     = document.getElementById("estado");
    const inputImagen   = document.getElementById("imagen");

    // Asegura que los selects estén habilitados
    [selMarca, selColor, selTalla, selEstado].forEach(s => {
      if (!s) return;
      s.disabled = false;
      s.style.pointerEvents = "auto";
    });

    // Desactiva botón mientras se cargan catálogos
    const originalBtnText = btnPublicar?.textContent || "PUBLICAR";
    if (btnPublicar) {
      btnPublicar.disabled = true;
      btnPublicar.textContent = "Cargando catálogos...";
    }

    try {
      // 1) Cargar catálogos
      const { brands, colors, sizes, status } = await precargarCatalogos();

      // Guarda en caché para validaciones
      CATALOG_CACHE.brands = brands;
      CATALOG_CACHE.colors = colors;
      CATALOG_CACHE.sizes  = sizes;
      CATALOG_CACHE.status = status;

      // 2) Placeholders
      resetAndPlaceholder(selMarca,  "Marca");
      resetAndPlaceholder(selColor,  "Color");
      resetAndPlaceholder(selTalla,  "Talla");
      resetAndPlaceholder(selEstado, "Estado");

      // 3) Popular selects
      populateSelect(selMarca,  brands, { valueKey: "id", labelKey: "name" });
      populateSelect(selTalla,  sizes,  { valueKey: "id", labelKey: "name" });
      populateSelect(selEstado, status, { valueKey: "id", labelKey: "name" });

      if (selColor && Array.isArray(colors)) {
        const frag = document.createDocumentFragment();
        colors.forEach(c => {
          const opt = document.createElement("option");
          opt.value = c.id;
          opt.textContent = c.hex ? `${c.name} (${c.hex})` : c.name;
          frag.appendChild(opt);
        });
        selColor.appendChild(frag);
      }

      // 4) Aviso si algo llegó vacío (ayuda a detectar rápido)
      const vacios = [];
      if (!brands.length) vacios.push("Marcas");
      if (!colors.length) vacios.push("Colores");
      if (!sizes.length)  vacios.push("Tallas");
      if (!status.length) vacios.push("Estados");
      if (vacios.length) {
        console.warn("Catálogos vacíos:", vacios.join(", "));
        const alert = document.createElement("div");
        alert.className = "alert alert-warning mt-2";
        alert.textContent = `Atención: no se recibieron datos para ${vacios.join(", ")}. Revisa los endpoints y la consola.`;
        document.querySelector(".form-container")?.prepend(alert);
      }

      // 5) Carga usuarios para validar id_user
      try {
        const users = await safeJsonFetch(EP_USERS_ALL);
        CATALOG_CACHE.users = Array.isArray(users) ? users.map(u => ({
          id: u.id ?? u.userId ?? u.value,
          email: u.email ?? u.mail ?? null
        })) : [];
      } catch (e) {
        console.warn("No se pudieron cargar usuarios para validación de id_user:", e);
      }

      // 6) Rehabilita botón
      if (btnPublicar) {
        btnPublicar.disabled = false;
        btnPublicar.textContent = originalBtnText;
      }
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los catálogos. Revisa consola/Network y vuelve a intentar.");
      return;
    }

    // =========================
    // SUBMIT: REGISTRAR PRODUCTO
    // =========================
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombreVal = (nombre?.value || "").trim();
      const modeloVal = (modelo?.value || "").trim();
      const descripcionVal = (descripcion?.value || "").trim();
      const precioVal = Number(precio?.value);

      if (!nombreVal || !modeloVal) {
        alert("Nombre y modelo son obligatorios.");
        return;
      }
      if (!precioVal || isNaN(precioVal) || precioVal <= 0) {
        alert("Precio inválido.");
        return;
      }
      if (!selMarca?.value || !selColor?.value || !selTalla?.value || !selEstado?.value) {
        alert("Selecciona marca, color, talla y estado.");
        return;
      }

      if (btnPublicar) {
        btnPublicar.disabled = true;
        btnPublicar.textContent = "PUBLICANDO...";
      }

      try {
        // id_user real (localStorage o backend)
        const id_user = await getActiveUserId();

        // Payload con IDs que espera tu BD
        const payload = {
          id_user,
          id_status: Number(selEstado.value),
          id_size:   Number(selTalla.value),
          id_brand:  Number(selMarca.value),
          id_color:  Number(selColor.value),
          name: nombreVal,
          model: modeloVal,
          description: descripcionVal || "Sin descripción",
          details: "-",
          price: precioVal
        };

        // DEBUG: mira exactamente lo que envías
        console.table(payload);

        // Validación previa a POST: existen los IDs referenciados?
        const missing = validateBeforePost(payload);
        if (missing.length) {
          alert(
            "No se puede registrar porque faltan/son inválidas las referencias:\n- " +
            missing.join("\n- ") +
            "\n\nVerifica que los catálogos y usuarios contengan esos IDs."
          );
          return;
        }

        // 1) Guardar producto
        const productSaved = await safeJsonFetch(EP_SAVE_PRODUCT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!productSaved?.id) {
          console.warn("Respuesta inesperada al guardar producto:", productSaved);
          alert("Producto guardado, pero la respuesta no incluye ID. Revisa el backend.");
          return;
        }

        // 2) (Opcional) Subir imagen
        if (inputImagen?.files?.length) {
          const fd = new FormData();
          fd.append("file", inputImagen.files[0]);
          fd.append("id", productSaved.id);

          await safeJsonFetch(EP_ADD_IMAGE, {
            method: "POST",
            body: fd
          });
        }

        alert("Producto publicado correctamente.");
        form.reset();
      } catch (err) {
        console.error(err);

        // Mapea el 409 a mensajes útiles
        if (String(err.message).startsWith("HTTP 409")) {
          alert(
            "No se pudo guardar (409 - Conflicto).\n\n" +
            "Posibles causas:\n" +
            "• Alguna clave foránea no existe (id_user, id_brand, id_color, id_size, id_status).\n" +
            "• El campo 'model' u otro tiene restricción de único y ya existe.\n\n" +
            "Revisa:\n" +
            "1) Que los selects se hayan llenado desde tus lookups.\n" +
            "2) Que el usuario activo (id_user=" + (window?.payload?.id_user || '¿?') + ") exista en la BD.\n" +
            "3) Prueba con un 'model' distinto por si hay restricción UNIQUE."
          );
        } else {
          alert(`Error al registrar producto: ${err.message}`);
        }
      } finally {
        if (btnPublicar) {
          btnPublicar.disabled = false;
          btnPublicar.textContent = originalBtnText;
        }
      }
    });
  });
})();