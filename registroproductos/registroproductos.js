// /registroproductos/registroproductos.js
(() => {
  // === Candidatos de API: LAN y DDNS (ajusta si hace falta) ===
  const API_CANDIDATES = [
    "http://192.168.50.23:8081/api/v1/nso",
    "http://jft314.ddns.net:8080/nso/api/v1/nso",
  ];
  // Si quieres forzar que la imagen vaya a una base distinta, pon aquí la URL base (o deja null)
  const IMAGE_EP_OVERRIDE = null; // p.ej. "http://192.168.50.23:8081/api/v1/nso"

  // No agregar sufijo al modelo
  const USE_UNIQUE_MODEL_SUFFIX = false;

  // ====== Toasts (Bootstrap 5) ======
  function createToast({ title = "", message = "", variant = "info", delay = 4500, autohide = true } = {}) {
    const container = document.getElementById("toastContainer") || (() => {
      const c = document.createElement("div");
      c.id = "toastContainer";
      c.className = "toast-container position-fixed top-0 end-0 p-3";
      c.style.zIndex = 1080;
      document.body.appendChild(c);
      return c;
    })();
    const bgClass = `text-bg-${variant}`;
    const wrapper = document.createElement("div");
    wrapper.className = `toast align-items-center ${bgClass} border-0`;
    wrapper.setAttribute("role", "alert");
    wrapper.setAttribute("aria-live", "assertive");
    wrapper.setAttribute("aria-atomic", "true");

    const body = document.createElement("div");
    body.className = "d-flex";

    const tb = document.createElement("div");
    tb.className = "toast-body";
    tb.innerHTML = (title ? `<strong class="me-2">${title}</strong>` : "") + (message || "");

    const closeBtn = document.createElement("button");
    const darkBg = ["primary","secondary","dark","danger","success"].includes(variant);
    closeBtn.type = "button";
    closeBtn.className = `btn-close ${darkBg ? "btn-close-white" : ""} me-2 m-auto`;
    closeBtn.setAttribute("data-bs-dismiss", "toast");
    closeBtn.setAttribute("aria-label", "Close");

    body.appendChild(tb);
    body.appendChild(closeBtn);
    wrapper.appendChild(body);
    container.appendChild(wrapper);

    const toast = new bootstrap.Toast(wrapper, { autohide, delay });
    toast.show();
    return toast;
  }
  const toastInfo  = (m,t="Info",d=3500)=>createToast({title:t,message:m,variant:"info",delay:d});
  const toastOK    = (m,t="Éxito",d=3500)=>createToast({title:t,message:m,variant:"success",delay:d});
  const toastWarn  = (m,t="Atención",d=5500)=>createToast({title:t,message:m,variant:"warning",delay:d});
  const toastError = (m,t="Error",d=7000)=>createToast({title:t,message:m,variant:"danger",delay:d});

  // ====== Helpers red/HTTP ======
  async function fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await fetch(url, { ...options, mode: "cors", signal: ctrl.signal });
    } finally {
      clearTimeout(id);
    }
  }

  async function safeJsonFetch(url, options = {}, timeoutMs = 10000) {
    const res = await fetchWithTimeout(url, options, timeoutMs);
    const text = await res.text().catch(() => "");
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${url} - ${text}`);
    if (!text) return [];
    try { return JSON.parse(text); } catch { return text; }
  }

  // Detecta y cachea la base disponible
  async function chooseApiBase() {
    const cached = sessionStorage.getItem("API_BASE_SELECTED");
    if (cached) return cached;

    for (const base of API_CANDIDATES) {
      try {
        // Probamos un endpoint "ligero" y público (lookup/status)
        const url = `${base}/product/lookup/status`;
        const r = await fetchWithTimeout(url, { method: "GET" }, 3500);
        if (r.ok) {
          sessionStorage.setItem("API_BASE_SELECTED", base);
          return base;
        }
      } catch { /* ignora y prueba siguiente */ }
    }
    throw new Error("Ningún backend respondió en tiempo. Verifica red/servidor.");
  }

  // ====== Utilidades UI/DOM ======
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
      for (const k of ["data","content","items","list","results"]) {
        if (Array.isArray(raw[k])) return raw[k];
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

  // ====== Imagen ======
  function sanitizeFilename(name) {
    if (!name) return `img_${Date.now()}.bin`;
    const dot = name.lastIndexOf(".");
    const base = dot >= 0 ? name.slice(0, dot) : name;
    const ext  = dot >= 0 ? name.slice(dot) : "";
    const safeBase = base.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                     .replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 80) || `img_${Date.now()}`;
    const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "");
    return `${safeBase}${safeExt || ".jpg"}`;
  }
  function validarImagen(file) {
    if (!file) return { ok: true };
    const allowed = ["image/png","image/jpeg","image/webp","image/gif","image/jpg"];
    const maxSizeMB = 6;
    if (!allowed.includes(file.type)) return { ok:false, msg:"Formato no permitido (PNG/JPG/WEBP/GIF)." };
    if (file.size > maxSizeMB*1024*1024) return { ok:false, msg:`La imagen supera ${maxSizeMB}MB.` };
    return { ok:true };
  }

  // ====== Sesión ======
  function getActiveUserIdFromSessionOrRedirect() {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      const u = raw ? JSON.parse(raw) : null;
      if (u && Number.isInteger(Number(u.id)) && Number(u.id) > 0) {
        return Number(u.id);
      }
    } catch {}
    toastWarn("Tu sesión expiró o no hay usuario activo. Inicia sesión.", "Sesión requerida", 6000);
    window.location.href = "/Login/login.html";
    throw new Error("Sin sesión: redirigiendo a login");
  }

  // ====== Estado global tras elegir base ======
  let API_BASE = null;
  const CATALOG_CACHE = { brands: [], colors: [], sizes: [], status: [] };

  // Construye endpoints a partir de API_BASE
  const EP = {
    brands:  () => `${API_BASE}/product/lookup/brands`,
    colors:  () => `${API_BASE}/product/lookup/colors_products`,
    sizes:   () => `${API_BASE}/product/lookup/sizes`,
    status:  () => `${API_BASE}/product/lookup/status`,
    save:    () => `${API_BASE}/product/save`,
    // Imagen: usa override si está definido; si no, la base elegida
    addImg:  () => `${(IMAGE_EP_OVERRIDE || API_BASE)}/product/add/image`,
  };

  // ====== Carga de catálogos ======
  async function precargarCatalogos() {
    const [brandsRaw, colorsRaw, sizesRaw, statusRaw] = await Promise.all([
      safeJsonFetch(EP.brands()),
      safeJsonFetch(EP.colors()),
      safeJsonFetch(EP.sizes()),
      safeJsonFetch(EP.status()),
    ]);

    const brands = normalizeArray(brandsRaw).map(o => ({ id:o.id ?? o.id_brand ?? o.brandId ?? o.value, name:guessLabel(o), raw:o }));
    const colors = normalizeArray(colorsRaw).map(o => ({ id:o.id ?? o.id_color ?? o.colorId ?? o.value, name:guessLabel(o), hex:o.hex||o.hex_code||o.hexCode||o.hexadecimal||null, raw:o }));
    const sizes  = normalizeArray(sizesRaw).map(o => ({ id:o.id ?? o.id_size  ?? o.sizeId  ?? o.value, name:guessLabel(o), raw:o }));
    const status = normalizeArray(statusRaw).map(o => ({ id:o.id ?? o.id_status?? o.statusId?? o.value, name:guessLabel(o), raw:o }));

    console.group("[Catálogos registrar productos]");
    console.log("API_BASE:", API_BASE);
    console.log("Brands:", brands);
    console.log("Colors:", colors);
    console.log("Sizes:", sizes);
    console.log("Status:", status);
    console.groupEnd();

    return { brands, colors, sizes, status };
  }

  // ====== Subida de imagen ======
  async function subirImagenProducto(productId, file) {
    const fd = new FormData();
    fd.append("file", file, sanitizeFilename(file?.name));
    fd.append("id", String(productId)); // el backend espera id como texto
    return await safeJsonFetch(EP.addImg(), { method: "POST", body: fd });
  }

  // ====== Bootstrap de la página ======
  document.addEventListener("DOMContentLoaded", async () => {
    const form        = document.getElementById("formularioRegistro");
    const btnPublicar = document.getElementById("btn-publicar");
    const nombre      = document.getElementById("nombre");
    const modelo      = document.getElementById("modelo");
    const descripcion = document.getElementById("descripcion");
    const detalle     = document.getElementById("detalle");
    const precio      = document.getElementById("precio");
    const selMarca    = document.getElementById("marca");
    const selColor    = document.getElementById("color");
    const selTalla    = document.getElementById("talla");
    const selEstado   = document.getElementById("estado");
    const inputImagen = document.getElementById("imagen");

    [selMarca, selColor, selTalla, selEstado].forEach(s => { if (s) { s.disabled = false; s.style.pointerEvents = "auto"; } });

    const originalBtnText = btnPublicar?.textContent || "PUBLICAR";
    if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = "Detectando servidor..."; }

    // 1) Elegir base disponible
    try {
      API_BASE = await chooseApiBase();
      toastOK(`Conectado a: ${API_BASE}`, "Backend OK");
    } catch (e) {
      console.error(e);
      toastError("No fue posible contactar ningún backend (LAN ni DDNS). Verifica que el servidor esté arriba y accesible desde tu red.");
      if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = originalBtnText; }
      return;
    }

    // 2) Cargar catálogos
    if (btnPublicar) { btnPublicar.textContent = "Cargando catálogos..."; }
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
      toastOK("Catálogos listos.");
    } catch (err) {
      console.error(err);
      toastError("No se pudieron cargar los catálogos desde el backend seleccionado.");
      if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = originalBtnText; }
      return;
    }

    // 3) Submit
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombreVal      = (nombre?.value || "").trim();
      const modeloVal      = (modelo?.value || "").trim();
      const descripcionVal = (descripcion?.value || "").trim();
      const detalleVal     = (detalle?.value || "-").trim();
      const precioVal      = Number(precio?.value);

      if (!nombreVal || !modeloVal) { toastWarn("Nombre y modelo son obligatorios."); return; }
      if (!precioVal || isNaN(precioVal) || precioVal <= 0 || precioVal > 999999.99) {
        toastWarn("Precio inválido. Debe ser > 0 y ≤ 999,999.99."); return;
      }
      if (!selMarca?.value || !selColor?.value || !selTalla?.value || !selEstado?.value) {
        toastWarn("Selecciona marca, color, talla y estado."); return;
      }

      const file = inputImagen?.files?.[0] ?? null;
      const vImg = validarImagen(file);
      if (!vImg.ok) { toastWarn(vImg.msg); return; }

      let payload;
      try {
        if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = "1/2 Guardando producto..."; }
        toastInfo("1/2 Guardando producto…");

        const id_user = getActiveUserIdFromSessionOrRedirect();
        const fk = {
          id_user:  id_user,
          id_status: Number(selEstado.value),
          id_size:   Number(selTalla.value),
          id_brand:  Number(selMarca.value),
          id_color:  Number(selColor.value),
        };

        payload = {
          ...fk,
          // camelCase por si tu backend mapea así
          idUser:   fk.id_user,
          idStatus: fk.id_status,
          idSize:   fk.id_size,
          idBrand:  fk.id_brand,
          idColor:  fk.id_color,
          name: nombreVal,
          model: USE_UNIQUE_MODEL_SUFFIX ? `${modeloVal}-${Date.now()}` : modeloVal,
          description: descripcionVal || "Sin descripción",
          details: detalleVal,
          price: precioVal
        };

        const productSaved = await safeJsonFetch(EP.save(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!productSaved?.id) {
          console.warn("Respuesta inesperada al guardar producto:", productSaved);
          toastWarn("Producto guardado, pero la respuesta no incluye ID. Revisa el backend.");
          return;
        }

        if (file) {
          if (btnPublicar) btnPublicar.textContent = "2/2 Subiendo imagen...";
          toastInfo("2/2 Subiendo imagen…");
          try {
            await subirImagenProducto(productSaved.id, file);
          } catch (imgErr) {
            console.error("Fallo al subir imagen:", imgErr);
            toastWarn("El producto se creó, pero la imagen no se pudo subir. Puedes reintentar más tarde.\n" + imgErr.message);
          }
        }

        toastOK("Producto publicado correctamente.");
        form.reset();
      } catch (err) {
        console.error(err);
        if (String(err.message).startsWith("HTTP 409")) {
          toastError("No se pudo guardar (409 - Conflicto). Verifica FKs y nombres de campos.", "Conflicto al guardar");
        } else {
          toastError(`Error al registrar producto: ${err.message}`);
        }
      } finally {
        if (btnPublicar) { btnPublicar.disabled = false; btnPublicar.textContent = "PUBLICAR"; }
      }
    });
  });
})();
