const weeklyPhrases = [
  "Beautiful equations, quiet machines",
  "The poetry of computation",
  "Machines dreaming in equations",
  "The geometry of intelligence",
  "Equations with a pulse",
  "The long conversation between code and math",
  "Where uncertainty becomes structure",
  "A quiet life of difficult questions",
  "The beautiful trouble of hard problems",
  "Thinking slowly with fast machines",
  "Between chalk dust and silicon"
];

function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / 86400000);
  return Math.floor((days + startOfYear.getDay()) / 7);
}

const phraseElement = document.getElementById("weekly-script-phrase");
if (phraseElement) {
  const currentWeek = getWeekNumber(new Date());
  const phraseIndex = currentWeek % weeklyPhrases.length;
  phraseElement.textContent = weeklyPhrases[phraseIndex];
  phraseElement.title = "This phrase changes automatically once a week.";
}

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}
