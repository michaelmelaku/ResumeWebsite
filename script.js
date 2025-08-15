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
const scrollAmount = 300;
let autoScrollInterval = 3000;
let autoScrollTimer;

// Clone the items for seamless looping
function cloneCards() {
  const cards = container.querySelectorAll('.portfolio-card');
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.add('cloned'); // Optional: to identify
    container.appendChild(clone);
  });
}

//arrow buttons
const leftBtn = document.querySelector('.scroll-arrow.left');
const rightBtn = document.querySelector('.scroll-arrow.right');

leftBtn.addEventListener('click', () => {
  container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });

  // Jump to second half if we’re too far left (before original set)
  if (container.scrollLeft <= 0) {
    container.scrollTo({ left: container.scrollWidth / 2, behavior: 'auto' });
  }
});

rightBtn.addEventListener('click', () => {
  container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

  // Reset to start when reaching cloned part
  if (container.scrollLeft >= container.scrollWidth / 2) {
    container.scrollTo({ left: 0, behavior: 'auto' });
  }
});


// Start auto-scroll
function startAutoScroll() {
  autoScrollTimer = setInterval(() => {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });

    // If we've scrolled past the original set, reset position to start of original cards
    if (container.scrollLeft >= container.scrollWidth / 2) {
      container.scrollTo({ left: 0, behavior: 'auto' }); // instant jump
    }
  }, autoScrollInterval);
}

// Stop auto-scroll
function stopAutoScroll() {
  clearInterval(autoScrollTimer);
}

// Setup
cloneCards();        // clone items for loop effect
startAutoScroll();   // start auto-scrolling

// Pause on hover
container.addEventListener('mouseenter', stopAutoScroll);
container.addEventListener('mouseleave', startAutoScroll);

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

