const teamMembers = [
  { name: "Denisse Lizeth González González", role: "Desarrolladora web Fullstack con enfoque en Back-End y formación Físico-Matemática.", image: "img/team-pictures/foto-Denisse-Lizeth-González-González.jpg", linkedin: "https://www.linkedin.com/in/denisse-lizeth-gonzalez/" },
  { name: "Jaime Armando Martínez Palomera", role: "Desarrollador fullstack usando HTML, CSS, JS.", image: "img/team-pictures/foto-Jaime-Armando-Martínez-Palomera.png", linkedin: "https://www.linkedin.com/in/martinezpalomera92/" },
  { name: "Jose Alberto Escalante Toledo", role: "Programador full stack con interés en front-end.", image: "img/team-pictures/foto-Jose-Alberto-Escalante-Toledo.jpg", linkedin: "https://www.linkedin.com/in/alberto-escalante-toledo/" },
  { name: "José Angel Tirado Luna", role: "Desarrollador Java FullStack con enfoque backend.", image: "img/team-pictures/foto-José-Angel-Tirado-Luna.jpg", linkedin: "https://www.linkedin.com/in/jose-angel-tirado/" },
  { name: "Kóoton Calli", role: "by: Peter y sus Desarrolladores", image: "img/Kooton-Calli-Logo-StandAlone.jpg", linkedin: "" },
  { name: "Miguel Adrian Ortega Herrera", role: "Desarrollador Web en formación, Ingeniería en Sistemas.", image: "img/team-pictures/foto-Miguel-Adrian-Ortega-Herrera.jpg", linkedin: "https://www.linkedin.com/in/miguel-adrian-ortegah9/" },
  { name: "Nicteha Fragoso", role: "Desarrolladora Full Stack con enfoque en Frontend.", image: "img/team-pictures/foto-Nicteha-Fragoso.jpg", linkedin: "https://www.linkedin.com/in/nicteha-fragoso/" },
  { name: "Pedro Serrano Viveros", role: "Frontend con enfoque UX/UI.", image: "img/team-pictures/foto-Pedro-Serrano-Viveros.jpg", linkedin: "https://www.linkedin.com/in/pedro-serrano23/" },
  { name: "Yeudiel Avelar Martínez", role: "Desarrolladora Full Stack con iniciativa y trabajo en equipo.", image: "img/team-pictures/foto-Yeudiel-Avelar-Martínez.jpg", linkedin: "https://www.linkedin.com/in/avelar-martinez-yeudiel/" }
];

// Crear la tarjeta
function createCard(member) {
  return `
    <div class="card-container">
      <div class="card">
        <div class="card-face card-front">
          <img src="${member.image}" alt="Foto de ${member.name}">
        </div>
        <div class="card-face card-back">
          <h3>${member.name}</h3>
          <p>${member.role}</p>
          ${member.linkedin 
            ? `<a href="${member.linkedin}" target="_blank" class="btn btn-primary">Ver Perfil</a>` 
            : ""}
        </div>
      </div>
    </div>
  `;
}

// Referencias
const teamGrid = document.getElementById("teamGrid");
const carouselInner = document.getElementById("carouselInner");
const teamCarousel = document.getElementById("teamCarousel");

function addFlipListeners() {
  document.querySelectorAll('.card').forEach(card => {
    // Limpiar listeners previos
    card.onclick = null;

    card.addEventListener('click', () => {
      const grid = card.closest('#teamGrid');
      const carousel = card.closest('#teamCarousel');

      // Detectar número de columnas reales del grid
      let columns = 3;
      if (grid) {
        const style = window.getComputedStyle(grid);
        const columnCount = style.getPropertyValue('grid-template-columns').split(' ').length;
        columns = columnCount;
      }

      // Reglas:
      // - Grid 3 columnas → solo hover (no clic)
      // - Grid 2 columnas o carrusel → clic para voltear
      if (columns < 3 || carousel) {
        card.classList.toggle('flipped');
      }
    });
  });
}

// Llamar después de renderizar y al cambiar layout
function renderTeam() {
  teamGrid.innerHTML = "";
  carouselInner.innerHTML = "";

  teamMembers.forEach((member, index) => {
    teamGrid.innerHTML += createCard(member);

    const carouselItem = document.createElement("div");
    carouselItem.className = "carousel-item" + (index === 0 ? " active" : "");
    carouselItem.innerHTML = createCard(member);
    carouselInner.appendChild(carouselItem);
  });

  addFlipListeners();
}

// Ejecutar la función cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', renderTeam);