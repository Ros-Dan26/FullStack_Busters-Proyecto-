(() => {
  const API_BASE = "http://jft314.ddns.net:8080/nso/api/v1/nso";

  const EP_LOOKUP_BRANDS  = `${API_BASE}/product/lookup/brands`;
  const EP_LOOKUP_COLORS  = `${API_BASE}/product/lookup/colors_products`;
  const EP_LOOKUP_SIZES   = `${API_BASE}/product/lookup/sizes`;
  const EP_LOOKUP_STATUS  = `${API_BASE}/product/lookup/status`;

  const EP_SAVE_PRODUCT   = `${API_BASE}/product/save`;
  const EP_ADD_IMAGE      = `${API_BASE}/product/add/image`;

  // Si sospechas de unicidad en 'model', pon esto en true para añadir -timestamp
  const USE_UNIQUE_MODEL_SUFFIX = true;

  const CATALOG_CACHE = { brands: [], colors: [], sizes: [], status: [] };

  async function safeJsonFetch(url, options = {}) {
    const res = await fetch(url, { ...options, mode: "cors" });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      // Incluye el cuerpo devuelto por el backend para que veas el motivo exacto
      throw new Error(`HTTP ${res.status} - ${url} - ${text}`);
    }
    if (!text) return [];
    try { return JSON.parse(text); } catch { return text; }
  }

  function resetAndPlaceholder(selectEl, placeholder) {
    if (!selectEl) return;
    selectEl.innerHTML = "";
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = placeholder;
    selectEl.appendChild(opt);
  }

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

  function guessLabel(obj) {
    if (!obj || typeof obj !== "object") return "";
    const keys = ["name","nombre","label","value","brand","status","size","description","title"];
    for (const k of keys) if (obj[k]) return obj[k];
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

  async function precargarCatalogos() {
    const [brandsRaw, colorsRaw, sizesRaw, statusRaw] = await Promise.all([
      safeJsonFetch(EP_LOOKUP_BRANDS),
      safeJsonFetch(EP_LOOKUP_COLORS),
      safeJsonFetch(EP_LOOKUP_SIZES),
      safeJsonFetch(EP_LOOKUP_STATUS),
    ]);

    const brands = normalizeArray(brandsRaw).map(o => ({ id: o.id ?? o.id_brand ?? o.brandId ?? o.value, name: guessLabel(o), raw: o }));
    const colors = normalizeArray(colorsRaw).map(o => ({ id: o.id ?? o.id_color ?? o.colorId ?? o.value, name: guessLabel(o), hex: o.hex || o.hex_code || o.hexCode || o.hexadecimal || null, raw: o }));
    const sizes  = normalizeArray(sizesRaw).map(o => ({ id: o.id ?? o.id_size  ?? o.sizeId  ?? o.value, name: guessLabel(o), raw: o }));
    const status = normalizeArray(statusRaw).map(o => ({ id: o.id ?? o.id_status?? o.statusId?? o.value, name: guessLabel(o), raw: o }));

    console.group("[Catálogos registrar productos]");
    console.log("Brands:", brands);
    console.log("Colors:", colors);
    console.log("Sizes:", sizes);
    console.log("Status:", status);
    console.groupEnd();

    return { brands, colors, sizes, status };
  }

  function getActiveUserIdFromSessionOrRedirect() {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      const u = raw ? JSON.parse(raw) : null;
      if (u && Number.isInteger(Number(u.id)) && Number(u.id) > 0) {
        return Number(u.id);
      }
    } catch {}
    alert("Tu sesión expiró o no hay usuario activo. Por favor inicia sesión.");
    window.location.href = "/Login/login.html";
    throw new Error("Sin sesión: redirigiendo a login");
  }

  function existsId(arr, id) {
    id = Number(id);
    return Array.isArray(arr) && arr.some(x => Number(x.id) === id);
  }
  function validateBeforePost({ id_brand, id_color, id_size, id_status }) {
    const missing = [];
    if (!existsId(CATALOG_CACHE.brands, id_brand))  missing.push("Marca (id_brand)");
    if (!existsId(CATALOG_CACHE.colors, id_color))  missing.push("Color (id_color)");
    if (!existsId(CATALOG_CACHE.sizes,  id_size))   missing.push("Talla (id_size)");
    if (!existsId(CATALOG_CACHE.status, id_status)) missing.push("Estado (id_status)");
    return missing;
  }

  document.addEventListener("DOMContentLoaded", async () => {
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

    [selMarca, selColor, selTalla, selEstado].forEach(s => { if (s) { s.disabled = false; s.style.pointerEvents = "auto"; } });

    const originalBtnText = btnPublicar?.textContent || "PUBLICAR";
    if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = "Cargando catálogos..."; }

    try {
      const { brands, colors, sizes, status } = await precargarCatalogos();
      CATALOG_CACHE.brands = brands;
      CATALOG_CACHE.colors = colors;
      CATALOG_CACHE.sizes  = sizes;
      CATALOG_CACHE.status = status;

      resetAndPlaceholder(selMarca,  "Marca");
      resetAndPlaceholder(selColor,  "Color");
      resetAndPlaceholder(selTalla,  "Talla");
      resetAndPlaceholder(selEstado, "Estado");

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

      if (btnPublicar) { btnPublicar.disabled = false; btnPublicar.textContent = originalBtnText; }
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los catálogos. Revisa consola/Network y vuelve a intentar.");
      return;
    }

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombreVal = (nombre?.value || "").trim();
      const modeloVal = (modelo?.value || "").trim();
      const descripcionVal = (descripcion?.value || "").trim();
      const precioVal = Number(precio?.value);

      if (!nombreVal || !modeloVal) { alert("Nombre y modelo son obligatorios."); return; }
      if (!precioVal || isNaN(precioVal) || precioVal <= 0 || precioVal > 999999.99) {
        alert("Precio inválido. Debe ser > 0 y ≤ 999,999.99."); return;
      }
      if (!selMarca?.value || !selColor?.value || !selTalla?.value || !selEstado?.value) {
        alert("Selecciona marca, color, talla y estado."); return;
      }

      if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = "PUBLICANDO..."; }

      let payload; // visible en catch
      try {
        const id_user = getActiveUserIdFromSessionOrRedirect();

        // IDs FK en snake_case
        const fkSnake = {
          id_user:  id_user,
          id_status: Number(selEstado.value),
          id_size:   Number(selTalla.value),
          id_brand:  Number(selMarca.value),
          id_color:  Number(selColor.value),
        };
        // Mismo contenido en camelCase (por si la entidad Java usa idUser, etc.)
        const fkCamel = {
          idUser:   fkSnake.id_user,
          idStatus: fkSnake.id_status,
          idSize:   fkSnake.id_size,
          idBrand:  fkSnake.id_brand,
          idColor:  fkSnake.id_color,
        };

        payload = {
          ...fkSnake,
          ...fkCamel,
          name: nombreVal,
          model: USE_UNIQUE_MODEL_SUFFIX ? `${modeloVal}-${Date.now()}` : modeloVal,
          description: descripcionVal || "Sin descripción",
          details: "-",
          price: precioVal
        };

        console.table(payload);

        const missing = validateBeforePost(fkSnake);
        if (missing.length) {
          alert("No se puede registrar porque faltan/son inválidas las referencias:\n- " + missing.join("\n- "));
          return;
        }

        // Double-check de FK elegidas
        const fkCheck = {
          brand:  CATALOG_CACHE.brands.find(x => Number(x.id) === fkSnake.id_brand),
          color:  CATALOG_CACHE.colors.find(x => Number(x.id) === fkSnake.id_color),
          size:   CATALOG_CACHE.sizes.find(x => Number(x.id) === fkSnake.id_size),
          status: CATALOG_CACHE.status.find(x => Number(x.id) === fkSnake.id_status),
        };
        console.log("FK elegidas:", { id_user, ...fkCheck });
        if (!fkCheck.brand || !fkCheck.color || !fkCheck.size || !fkCheck.status) {
          alert("Alguna FK seleccionada ya no existe en los catálogos. Actualiza la página y vuelve a intentar.");
          return;
        }

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

        // Subir imagen si corresponde
        if (inputImagen?.files?.length) {
          const fd = new FormData();
          fd.append("file", inputImagen.files[0]);
          fd.append("id", productSaved.id);
          await safeJsonFetch(EP_ADD_IMAGE, { method: "POST", body: fd });
        }

        alert("Producto publicado correctamente.");
        form.reset();
      } catch (err) {
        console.error(err);
        // Aquí verás el motivo exacto si tu backend lo envía en el body del 409
        if (String(err.message).startsWith("HTTP 409")) {
          alert(
            "No se pudo guardar (409 - Conflicto).\n\n" +
            "Causas típicas:\n" +
            "• Alguna FK no existe (users, brands, colors_products, sizes, status).\n" +
            "• Algún campo llegó NULL/0 porque el nombre no coincidió con lo que espera la entidad Java.\n" +
            "• (Menos probable) Unicidad en 'model'.\n\n" +
            `Envié id_user=${payload?.id_user}, id_brand=${payload?.id_brand}, id_color=${payload?.id_color}, id_size=${payload?.id_size}, id_status=${payload?.id_status}.\n` +
            "Revisa la pestaña Network → Response del 409 para ver el detalle que devolvió el backend."
          );
        } else if (err.message.includes("Sin sesión")) {
          // ya redirigimos
        } else {
          alert(`Error al registrar producto: ${err.message}`);
        }
      } finally {
        if (btnPublicar) { btnPublicar.disabled = false; btnPublicar.textContent = originalBtnText; }
      }
    });
  });
})();