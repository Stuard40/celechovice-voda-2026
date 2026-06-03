// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initCountdown();
  initMobileMenu();
  initChecklist();
  initFormSubmit();
  initActiveLinks();
});

// 1. Countdown Timer (Target: July 3, 2026)
function initCountdown() {
  const targetDate = new Date('July 2, 2026 18:00:00').getTime();
  
  const daysVal = document.getElementById('days');
  const hoursVal = document.getElementById('hours');
  const minutesVal = document.getElementById('minutes');
  const secondsVal = document.getElementById('seconds');
  
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    
    if (distance < 0) {
      clearInterval(interval);
      if (daysVal) daysVal.innerText = '00';
      if (hoursVal) hoursVal.innerText = '00';
      if (minutesVal) minutesVal.innerText = '00';
      if (secondsVal) secondsVal.innerText = '00';
      return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    if (daysVal) daysVal.innerText = String(days).padStart(2, '0');
    if (hoursVal) hoursVal.innerText = String(hours).padStart(2, '0');
    if (minutesVal) minutesVal.innerText = String(minutes).padStart(2, '0');
    if (secondsVal) secondsVal.innerText = String(seconds).padStart(2, '0');
  }
  
  // Run once immediately, then on interval
  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
}

// 2. Mobile Menu Drawer
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');
  
  if (!mobileMenuBtn || !navLinks) return;
  
  // Toggle active class on menu and button
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle menu icon between burger and close
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
      const isMenu = icon.getAttribute('data-lucide') === 'menu';
      icon.setAttribute('data-lucide', isMenu ? 'x' : 'menu');
      if (typeof lucide !== 'undefined') {
        lucide.createIcons({
          attrs: {
            id: mobileMenuBtn.id
          },
          nameAttr: 'data-lucide'
        });
      }
    }
  });
  
  // Close menu when a link is clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        icon.setAttribute('data-lucide', 'menu');
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    });
  });
}

// 3. Packing Checklist with localStorage persistence
function initChecklist() {
  const checkboxes = document.querySelectorAll('.checklist-checkbox');
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  
  if (checkboxes.length === 0) return;
  
  // Load saved states from localStorage
  const savedState = JSON.parse(localStorage.getItem('voda2026_checklist')) || {};
  
  checkboxes.forEach((cb, index) => {
    // Set initial checked state
    if (savedState[index]) {
      cb.checked = true;
    }
    
    // Add change event listener
    cb.addEventListener('change', () => {
      savedState[index] = cb.checked;
      localStorage.setItem('voda2026_checklist', JSON.stringify(savedState));
      updateProgressBar();
    });
  });
  
  function updateProgressBar() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.innerText = `${percentage}%`;
  }
  
  // Initialize progress bar width on load
  updateProgressBar();
}

// 4. Contact Form Handling
function initFormSubmit() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    
    // Simulate submission state
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Odesílám...';
    
    setTimeout(() => {
      alert('Děkujeme! Tvoje přihláška byla úspěšně zpracována. Ozveme se ti brzy s dalšími detaily!');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Reset checklist progress if needed (optional, just to show clean state)
      // Here we just make sure lucide icons are rendered properly in the button if replaced
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 1200);
  });
}

// 5. Active Nav Links highlighting on scroll
function initActiveLinks() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 120)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
