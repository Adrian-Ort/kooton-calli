async function loadComponent(containerId, fileName) {
    const containerElement = document.getElementById(containerId);
    if (containerElement) {
        try{
            const response = await fetch(`components/${fileName}`);
            const content = await response.text();
            containerElement.innerHTML = content;
        }catch(error){
            console.error(`Error loading component ${fileName}:`, error);
        }
    }
}
// Inject all common components when loading the page.
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('header', 'header.html');
    loadComponent('footer', 'footer.html');
    loadComponent('sidebar', 'navbar.html');
});