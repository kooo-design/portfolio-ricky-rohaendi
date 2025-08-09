// DOM Elements
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const skillBars = document.querySelectorAll(".skill-progress");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const contactForm = document.querySelector(".contact-form");
const header = document.querySelector(".header");

// Mobile Navigation Toggle
if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });
}

// Header scroll effect
let lastScrollTop = 0;
window.addEventListener("scroll", () => {
  // Hapus/komentari seluruh blok ini:
  // const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // if (scrollTop > lastScrollTop && scrollTop > 100) {
  //   // Scrolling down
  //   header.style.transform = "translateY(-100%)";
  // } else {
  //   // Scrolling up
  //   header.style.transform = "translateY(0)";
  // }
  // lastScrollTop = scrollTop;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in");

      // Animate skill bars
      if (entry.target.classList.contains("skills")) {
        animateSkillBars();
      }

      // Animate counters
      if (entry.target.classList.contains("stats")) {
        animateCounters();
      }
    }
  });
}, observerOptions);

// Observe elements for animation
const observeElements = document.querySelectorAll(
  ".hero-text, .hero-image, .about-text, .about-image, .step, .portfolio-item, .blog-item, .service-item, .skills, .stats"
);
observeElements.forEach((el) => observer.observe(el));

// Skill bars animation
function animateSkillBars() {
  skillBars.forEach((bar, index) => {
    const width = bar.getAttribute("data-width");
    setTimeout(() => {
      bar.style.setProperty("--width", width);
      bar.style.width = width;
    }, index * 200);
  });
}

// Counter animation
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  counters.forEach((counter) => {
    const target = parseInt(counter.textContent.replace("+", ""));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current) + "+";
    }, 16);
  });
}

// Portfolio filter and modal (if needed)
function initPortfolio() {
  portfolioItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      // Add click animation
      item.style.transform = "scale(0.95)";
      setTimeout(() => {
        item.style.transform = "";
      }, 150);
    });
  });
}

// Contact form handling
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const subject = this.querySelector('input[placeholder="Subject"]').value;
    const message = this.querySelector("textarea").value;

    // Basic validation
    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email address", "error");
      return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector(".btn-primary");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      showNotification(
        "Message sent successfully! I'll get back to you soon.",
        "success"
      );
      this.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }, 2000);
  });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notification) => notification.remove());

  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  // Styles for notification
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "15px 25px",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    zIndex: "10000",
    transform: "translateX(100%)",
    transition: "transform 0.3s ease",
    maxWidth: "300px",
    wordWrap: "break-word",
  });

  // Set background color based on type
  switch (type) {
    case "success":
      notification.style.background =
        "linear-gradient(45deg, #00b894, #00cec9)";
      break;
    case "error":
      notification.style.background =
        "linear-gradient(45deg, #e17055, #d63031)";
      break;
    default:
      notification.style.background =
        "linear-gradient(45deg, #6c5ce7, #a29bfe)";
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Parallax effect for hero section
function initParallax() {
  const heroSection = document.querySelector(".hero");

  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;

      if (scrolled < window.innerHeight) {
        heroSection.style.transform = `translateY(${
          scrolled * parallaxSpeed
        }px)`;
      }
    });
  }
}

// Typing animation for hero text
function initTypingAnimation() {
  const heroTitle = document.querySelector(".hero-text h1");
  if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = "";

    let index = 0;
    const typeSpeed = 50;

    function typeWriter() {
      if (index < text.length) {
        heroTitle.innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, typeSpeed);
      }
    }

    // Start typing animation after page load
    setTimeout(typeWriter, 500);
  }
}

// Lazy loading for images
function initLazyLoading() {
  const images = document.querySelectorAll("img");

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.src;
        img.setAttribute("data-loaded", "true");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    img.setAttribute("data-loaded", "false");
    imageObserver.observe(img);
  });
}

// Theme toggle (optional dark mode)
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-theme");
      localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-theme") ? "dark" : "light"
      );
    });

    // Load saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-theme");
    }
  }
}

// Cursor effect
function initCustomCursor() {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #6c5ce7, #a29bfe);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        transform: translate(-50%, -50%);
    `;

  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Cursor interactions
  const interactiveElements = document.querySelectorAll(
    "a, button, .portfolio-item, .service-item"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    });

    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

// Page loading animation
function initPageLoader() {
  const loader = document.createElement("div");
  loader.className = "page-loader";
  loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <p>Loading...</p>
        </div>
    `;

  loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease;
    `;

  const loaderSpinner = loader.querySelector(".loader-spinner");
  if (loaderSpinner) {
    loaderSpinner.style.cssText = `
            width: 50px;
            height: 50px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #6c5ce7;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
        `;
  }

  // Add spinner animation
  const style = document.createElement("style");
  style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
  document.head.appendChild(style);

  document.body.appendChild(loader);

  // Hide loader after page load
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 500);
    }, 1000);
  });
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initPortfolio();
  initParallax();
  initLazyLoading();
  initThemeToggle();
  initPageLoader();

  // Only add custom cursor on desktop
  if (window.innerWidth > 768) {
    initCustomCursor();
  }

  // Add scroll to top button
  const scrollTopBtn = document.createElement("button");
  scrollTopBtn.innerHTML = "↑";
  scrollTopBtn.className = "scroll-top-btn";
  scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #6c5ce7, #a29bfe);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        transform: translateY(100px);
        transition: all 0.3s ease;
    `;

  document.body.appendChild(scrollTopBtn);

  // Show/hide scroll to top button
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.style.opacity = "1";
      scrollTopBtn.style.transform = "translateY(0)";
    } else {
      scrollTopBtn.style.opacity = "0";
      scrollTopBtn.style.transform = "translateY(100px)";
    }
  });

  // Scroll to top functionality
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  const animatables = document.querySelectorAll(".about .animate");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  animatables.forEach((el) => observer.observe(el));

  console.log("Portfolio website initialized successfully!");

  const heroSection = document.querySelector(".fade-on-scroll");
  window.addEventListener("scroll", function () {
    if (!heroSection) return;
    // Mulai fade out dari scrollY 0 ke 300
    const fadeStart = 0;
    const fadeEnd = 300;
    const scrollY = window.scrollY;
    let opacity = 1;

    if (scrollY > fadeStart) {
      opacity = 1 - Math.min((scrollY - fadeStart) / (fadeEnd - fadeStart), 1);
    }
    heroSection.style.opacity = opacity;
  });
});

// Performance optimization
window.addEventListener("scroll", throttle(handleScroll, 16));

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function handleScroll() {
  // Handle scroll-based animations here
  const scrollTop = window.pageYOffset;

  // Add any scroll-based effects
  document.querySelectorAll(".parallax-element").forEach((element) => {
    const speed = element.dataset.speed || 0.5;
    const yPos = -(scrollTop * speed);
    element.style.transform = `translateY(${yPos}px)`;
  });
}
