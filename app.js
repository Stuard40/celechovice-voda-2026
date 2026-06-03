// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initCountdown();
  initMobileMenu();
  initActiveLinks();
});

// 1. Countdown Timer (Target: July 2, 2026 18:00)
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

// 3. Active Nav Links highlighting on scroll
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
