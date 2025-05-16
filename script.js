// Particle.js config
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 2,
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      attract: { enable: false },
    },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true,
    },
    modes: {
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
    },
  },
  retina_detect: true,
});

// Typing Effect
const dynamicText = document.querySelector("h2 span");
const words = [
  { text: "YOUTUBER", color: "red" },
  { text: "GAMER", color: "#5cbfe4" },
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentWord = words[wordIndex];
  const currentChar = currentWord.text.substring(0, charIndex);
  dynamicText.textContent = currentChar;
  dynamicText.style.color = currentWord.color;

  if (!isDeleting && charIndex < currentWord.text.length) {
    charIndex++;
    setTimeout(typeEffect, 200);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 100);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeEffect, 1000);
  }
}
typeEffect();

// Modal Popup Logic
const modal = document.getElementById("login-modal");
const minecraftBtn = document.getElementById("minecraft-btn");
const closeBtn = document.querySelector(".close");
const googleBtn = document.getElementById("google-login");

minecraftBtn.onclick = () => {
  modal.style.display = "block";
};
closeBtn.onclick = () => {
  modal.style.display = "none";
};
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Simulated Google Login
googleBtn.onclick = () => {
  alert("Google login simulated...");
  // Replace with real Google login via Firebase/Auth SDK
  window.location.href = "Event/Event.html";
};
