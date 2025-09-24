// src/js/components.js
async function loadComponent(containerId, fileName) {
  const containerElement = document.getElementById(containerId);
  if (!containerElement) return;

  try {
    const base = import.meta.env.BASE_URL; // dev: '/', build/preview: '/kooton-calli/'
    const response = await fetch(`${base}components/${fileName}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const content = await response.text();

    containerElement.innerHTML = content;

    // ---------- Normalizador de rutas (recomendado) ----------
    const baseNormalized = base.endsWith('/') ? base : base + '/';

    const isAbsoluteUrl = (url) =>
      /^([a-z]+:)?\/\//i.test(url) || // http:, https:, //cdn...
      url.startsWith('mailto:') ||
      url.startsWith('tel:') ||
      url.startsWith('#');

    // Normaliza atributos SRC (img, script, source, iframe, etc.)
    containerElement.querySelectorAll('[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (!src || isAbsoluteUrl(src)) return;
      // evita prefijar dos veces
      if (!src.startsWith(baseNormalized)) {
        el.setAttribute('src', baseNormalized + src.replace(/^\.?\//, ''));
      }
    });

    // Normaliza LINK href (css, iconos, etc.)
    containerElement.querySelectorAll('link[href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (!href || isAbsoluteUrl(href)) return;
      if (!href.startsWith(baseNormalized)) {
        el.setAttribute('href', baseNormalized + href.replace(/^\.?\//, ''));
      }
    });

    // Normalmente NO hace falta tocar <a>, el <base> ya resuelve.
    // Si quieres forzar que todos los <a> queden prefijados:
    /*
    containerElement.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href');
      if (!href || isAbsoluteUrl(href)) return;
      if (!href.startsWith(baseNormalized)) {
        a.setAttribute('href', baseNormalized + href.replace(/^\.?\//, ''));
      }
    });
    */
    // ---------- fin normalizador ----------

  } catch (err) {
    console.error(`Error loading component ${fileName}:`, err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', 'header.html');
  loadComponent('footer', 'footer.html');
});
