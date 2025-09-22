// src/js/components.js
async function loadComponent(containerId, fileName) {
  const containerElement = document.getElementById(containerId);
  if (containerElement) {
    try {
      const base = import.meta.env.BASE_URL; // Vite te da el prefijo correcto
      const response = await fetch(`${base}components/${fileName}`);
      const content = await response.text();
      containerElement.innerHTML = content;
    } catch (error) {
      console.error(`Error loading component ${fileName}:`, error);
    }
  }
}
document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header', 'header.html');
  loadComponent('footer', 'footer.html');
});
