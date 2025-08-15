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
        const url = `${base}/product/lookup/status`;
        const r = await fetchWithTimeout(url, { method: "GET" }, 3500);
        if (r.ok) {
          sessionStorage.setItem("API_BASE_SELECTED", base);
          return base;
        }
      } catch {/* siguiente */}
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

  // ====== Imagen (validación, preview y subida) ======
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

  function validarUnaImagen(file) {
    const allowed = ["image/png","image/jpeg","image/webp","image/gif","image/jpg"];
    const maxSizeMB = 6;
    if (!allowed.includes(file.type)) return { ok:false, msg:`${file.name}: formato no permitido (PNG/JPG/WEBP/GIF).` };
    if (file.size > maxSizeMB*1024*1024) return { ok:false, msg:`${file.name}: supera ${maxSizeMB}MB.` };
    return { ok:true };
  }
  function validarImagenes(files) {
    if (!files || !files.length) return { ok: true, msgs: [] };
    const msgs = [];
    for (const f of files) {
      const v = validarUnaImagen(f);
      if (!v.ok) msgs.push(v.msg);
    }
    return { ok: msgs.length === 0, msgs };
  }

  // Fallback para re-encode si algun servidor devuelve 422 (opcional)
  async function reencodeImage(file, { mime = "image/png", maxW = 1600, maxH = 1600, quality = 0.95 } = {}) {
    const dataURL = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = dataURL;
    });
    let { width, height } = img;
    const ratio = Math.min(maxW / width, maxH / height, 1);
    width  = Math.round(width * ratio);
    height = Math.round(height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, quality));
    const ext = mime === "image/png" ? ".png" : mime === "image/jpeg" ? ".jpg" : ".bin";
    const clean = sanitizeFilename(file.name).replace(/\.[^.]+$/, "") + ext;
    return new File([blob], clean, { type: mime });
  }

  // Sube 1 imagen
  async function subirUnaImagen(productId, file) {
    try {
      const fd = new FormData();
      fd.append("file", file, sanitizeFilename(file?.name));
      fd.append("id", String(productId));
      return await safeJsonFetch(EP.addImg(), { method: "POST", body: fd });
    } catch (e) {
      // Si el server valida mimetype y rechaza con 422, re-encode y reintenta una vez
      if (String(e.message).startsWith("HTTP 422")) {
        const pngFile = await reencodeImage(file, { mime: "image/png", maxW: 1600, maxH: 1600, quality: 0.95 });
        const fd2 = new FormData();
        fd2.append("file", pngFile, sanitizeFilename(pngFile.name));
        fd2.append("id", String(productId));
        return await safeJsonFetch(EP.addImg(), { method: "POST", body: fd2 });
      }
      throw e;
    }
  }

  // Sube N imágenes de forma secuencial (más seguro para el backend)
  async function subirImagenesProducto(productId, files) {
    let ok = 0, fail = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        toastInfo(`Subiendo imagen ${i+1}/${files.length}: ${file.name}`);
        await subirUnaImagen(productId, file);
        ok++;
      } catch (err) {
        console.error("Fallo al subir imagen:", err);
        fail++;
      }
    }
    return { ok, fail };
  }

  // Render de previews
  function renderPreviews(files, container) {
    container.innerHTML = "";
    const frag = document.createDocumentFragment();
    Array.from(files).forEach(file => {
      const col = document.createElement("div");
      col.className = "col-6 col-sm-4 col-md-3 col-lg-2";
      const card = document.createElement("div");
      card.className = "border rounded p-1 h-100 d-flex flex-column";

      const img = document.createElement("img");
      img.className = "img-fluid rounded";
      img.alt = file.name;
      img.src = URL.createObjectURL(file);

      const cap = document.createElement("small");
      cap.className = "text-truncate mt-1";
      cap.title = file.name;
      cap.textContent = file.name;

      card.appendChild(img);
      card.appendChild(cap);
      col.appendChild(card);
      frag.appendChild(col);
    });
    container.appendChild(frag);
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

  // ====== Bootstrap de la página ======
  document.addEventListener("DOMContentLoaded", async () => {
    const form         = document.getElementById("formularioRegistro");
    const btnPublicar  = document.getElementById("btn-publicar");
    const nombre       = document.getElementById("nombre");
    const modelo       = document.getElementById("modelo");
    const descripcion  = document.getElementById("descripcion");
    const detalle      = document.getElementById("detalle");
    const precio       = document.getElementById("precio");
    const selMarca     = document.getElementById("marca");
    const selColor     = document.getElementById("color");
    const selTalla     = document.getElementById("talla");
    const selEstado    = document.getElementById("estado");
    const inputImagen  = document.getElementById("imagen");
    const previewGrid  = document.getElementById("previewGrid");

    [selMarca, selColor, selTalla, selEstado].forEach(s => { if (s) { s.disabled = false; s.style.pointerEvents = "auto"; } });

    const originalBtnText = btnPublicar?.textContent || "PUBLICAR";
    if (btnPublicar) { btnPublicar.disabled = true; btnPublicar.textContent = "Detectando servidor..."; }

    // Previews al seleccionar archivos
    inputImagen?.addEventListener("change", () => {
      const files = inputImagen.files ? Array.from(inputImagen.files) : [];
      if (!files.length) {
        previewGrid.innerHTML = "";
        return;
      }
      const v = validarImagenes(files);
      if (!v.ok) {
        toastWarn("Revisa tus imágenes:\n• " + v.msgs.join("\n• "));
        inputImagen.value = "";
        previewGrid.innerHTML = "";
        return;
      }
      renderPreviews(files, previewGrid);
    });

    // 1) Elegir base disponible
    try {
      API_BASE = await chooseApiBase();
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

      const files = inputImagen?.files ? Array.from(inputImagen.files) : [];
      const vImgs = validarImagenes(files);
      if (!vImgs.ok) { toastWarn("Revisa tus imágenes:\n• " + vImgs.msgs.join("\n• ")); return; }

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

        if (files.length) {
          if (btnPublicar) btnPublicar.textContent = `2/2 Subiendo ${files.length} imagen(es)...`;
          toastInfo(`2/2 Subiendo ${files.length} imagen(es)…`);

          const { ok, fail } = await subirImagenesProducto(productSaved.id, files);
          if (ok && !fail) {
            toastOK(`Se subieron ${ok}/${files.length} imágenes correctamente.`);
          } else if (ok && fail) {
            toastWarn(`Algunas imágenes fallaron (${ok} OK, ${fail} error). Puedes reintentar.`);
          } else {
            toastWarn("No se pudo subir ninguna imagen. El producto quedó creado, puedes subirlas más tarde.");
          }
        }

        toastOK("Producto publicado correctamente.");
        form.reset();
        // Limpia previews
        if (previewGrid) previewGrid.innerHTML = "";
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
