const header = document.querySelector("header");
let lastScrollY = 0;
let ticking = false;

// Mobile-only scroll/hide behavior
window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > lastScrollY && window.scrollY > 50) {
          header.classList.add("hide");
          navMenu.classList.remove("show");
        } else if (window.scrollY < 10) {
          header.classList.remove("hide");
        }
        lastScrollY = window.scrollY;
        ticking = false;
      });
      ticking = true;
    }
  } else {
    header.classList.remove("hide");
  }
});

// Mobile nav toggle
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
});

// Close mobile menu when a link is clicked
document.querySelectorAll("nav ul li a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
  });
});

// Contact form (AJAX + no redirect + smooth fade-out messages)
const form = document.querySelector("#contact form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const submitButton = form.querySelector("button");

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  // Remove previous messages
  form.querySelectorAll(".success-msg, .error-msg").forEach(msg => msg.remove());

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    let messageEl = document.createElement("p");

    if (response.ok) {
      form.reset();
      messageEl.className = "success-msg";
      messageEl.textContent = "Message sent successfully! We'll be in touch soon.";
    } else {
      messageEl.className = "error-msg";
      messageEl.textContent = "There was an issue sending your message. Please try again later.";
    }

    form.appendChild(messageEl);

    // Fade-out after 4 sec
    setTimeout(() => {
      messageEl.classList.add("fade-out");
      setTimeout(() => messageEl.remove(), 500);
    }, 4000);

  } catch (err) {
    const messageEl = document.createElement("p");
    messageEl.className = "error-msg";
    messageEl.textContent = "Network error. Please check your connection.";
    form.appendChild(messageEl);

    setTimeout(() => {
      messageEl.classList.add("fade-out");
      setTimeout(() => messageEl.remove(), 500);
    }, 4000);

  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Send Message";
  }
});

// Portfolio Slideshow
let slideIndex = 0;
let slides = document.querySelectorAll(".slide");
let dots = document.querySelectorAll(".dot");
let slideshow = document.querySelector(".slideshow-container");

if (slides.length > 0) {
  showSlides(slideIndex);
}

// Auto-slide timer logic with reset on input
let autoInterval;
let autoDelay = 5000;     // normal auto-slide = 5 seconds
let resetDelay = 20000;   // 20 seconds after user action

function startAutoSlide(delay = autoDelay) {
  clearInterval(autoInterval);
  autoInterval = setInterval(() => {
    showSlides(slideIndex += 1);
  }, delay);
}

// start automatic slideshow
startAutoSlide();

function userInteracted() {
  // restart auto-slide with 20s delay after interaction
  startAutoSlide(resetDelay);
}

// Next/Prev buttons
document.querySelector(".next").addEventListener("click", () => {
  showSlides(slideIndex += 1);
  userInteracted();
});

document.querySelector(".prev").addEventListener("click", () => {
  showSlides(slideIndex -= 1);
  userInteracted();
});

// Dot controls
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    showSlides(slideIndex = i);
    userInteracted();
  });
});

// Show Slides Function
function showSlides(n) {
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;

  slides.forEach(s => s.style.display = "none");
  dots.forEach(d => d.classList.remove("active-dot"));

  slides[slideIndex].style.display = "block";
  dots[slideIndex].classList.add("active-dot");
}


// Mobile Swipe Support
let startX = 0;
let endX = 0;

slideshow.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

slideshow.addEventListener("touchend", e => {
  endX = e.changedTouches[0].clientX;

  let diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      showSlides(slideIndex += 1); // swipe left
    } else {
      showSlides(slideIndex -= 1); // swipe right
    }
    userInteracted();
  }
});

function updateLogoVisibility() {
  const desktopLogo = document.querySelector('.desktop-logo');
  const mobileLogo = document.querySelector('.mobile-logo');

  if (!desktopLogo || !mobileLogo) return;

  // Using real device width instead of CSS viewport width
  const deviceWidth = window.screen.width;

  if (deviceWidth <= 900) {
    // Mobile
    desktopLogo.style.display = "none";
    mobileLogo.style.display = "block";
  } else {
    // Desktop / Tablet
    desktopLogo.style.display = "block";
    mobileLogo.style.display = "none";
  }
}

// Run once on load
updateLogoVisibility();

// Also run on rotate (portrait - landscape)
window.addEventListener('resize', updateLogoVisibility);
