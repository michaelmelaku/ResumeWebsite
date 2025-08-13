// Dark Mode Toggle
const toggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeText = document.getElementById('theme-text');
const body = document.body;

function setLightMode() {
  body.classList.add('light');
  body.classList.remove('dark');
  themeIcon.textContent = '🌘';
  themeText.textContent = 'Dark Mode';
  localStorage.setItem('theme', 'light');
}

function setDarkMode() {
  body.classList.add('dark');
  body.classList.remove('light');
  themeIcon.textContent = '⚪';
  themeText.textContent = 'Light Mode';
  localStorage.setItem('theme', 'dark');
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    setDarkMode();
  } else {
    setLightMode(); // default to light
  }
}

toggleBtn.addEventListener('click', () => {
  if (body.classList.contains('dark')) {
    setLightMode();
  } else {
    setDarkMode();
  }
});

loadTheme();
// Scroll Fade-in Animations
const faders = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    appearOnScroll.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

  const container = document.querySelector('.portfolio-container');
  const leftBtn = document.querySelector('.scroll-arrow.left');
  const rightBtn = document.querySelector('.scroll-arrow.right');

  const scrollAmount = 300; // how far to scroll on each click

  leftBtn.addEventListener('click', () => {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  rightBtn.addEventListener('click', () => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });


  const form = document.getElementById('contact-form');
  const successBubble = document.getElementById('form-success');

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    fetch(form.action, {
      method: form.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        form.reset();

        // Reset and trigger animation
        successBubble.style.display = 'block';
        successBubble.style.animation = 'none'; // reset animation
        void successBubble.offsetWidth; // trigger reflow
        successBubble.style.animation = 'fadeInOut 10s forwards';

      } else {
        alert("Oops! Something went wrong.");
      }
    })
    .catch(() => {
      alert("Error submitting the form.");
    });
  });

