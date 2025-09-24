# Kóoton Calli - Fixes para producción (Vite + Netlify)

## Cambios clave
- `vite.config.js`: `base: '/'` para que en Netlify los assets se sirvan desde la raíz.
- `html/contact.html`: el script de la página ahora es un **módulo** y apunta a `/src/js/contact.js` para que Vite lo procese y lo empaquete.
- `netlify.toml` añadido con:
  ```
  [build]
    command = "npm run build"
    publish = "dist"
  ```

## Cómo probar local
1. Instalar deps: `npm i`
2. Build: `npm run build`
3. Preview: `npm run preview -- --host`
4. Abre la consola del navegador en cada página:
   - `/` (index)
   - `/html/contact.html`
   - `/html/product.html`
   - `/html/aboutUs.html`
   No debe haber 404 de `/node_modules/...` ni de `/src/...` en producción.

## Despliegue en Netlify
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- No se requiere `_redirects` porque es multi‑página tradicional (no SPA router).

## Notas
- Todos los assets públicos están en `public/` y son referenciados con `<base href="/">` + `import.meta.env.BASE_URL`.
- Si alguna vez despliegas en un subpath (por ejemplo GitHub Pages `/kooton-calli/`), cambia `base` en `vite.config.js` a `'/kooton-calli/'`.
