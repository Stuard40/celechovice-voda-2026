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
  initMaps();
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

// 6. Mapy.cz / Leaflet Map Initialization
function initMaps() {
  const map2El = document.getElementById('map-day2');
  const map3El = document.getElementById('map-day3');
  const map4El = document.getElementById('map-day4');
  
  if (typeof L === 'undefined') return;
  
  // Custom marker styles
  const startIcon = L.divIcon({
    className: 'custom-map-marker marker-start',
    html: '<div style="background-color: #0d9488; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>',
    iconSize: [12, 12]
  });
  
  const endIcon = L.divIcon({
    className: 'custom-map-marker marker-end',
    html: '<div style="background-color: #f59e0b; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>',
    iconSize: [12, 12]
  });
  
  const weirIcon = L.divIcon({
    className: 'custom-map-marker marker-weir',
    html: '<div style="background-color: #ef4444; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.5);"></div>',
    iconSize: [10, 10]
  });
  
  if (map2El) {
    const map2 = L.map('map-day2', {
      scrollWheelZoom: false
    }).setView([49.993, 14.027], 11);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map2);
    
    const route2 = [
      [50.0189, 13.9757], // Žloukovice
      [50.0065, 13.9850], // bends
      [50.0016, 13.9998], // Nižbor
      [49.9950, 14.0250],
      [49.9833, 14.0531], // Hýskov
      [49.9675, 14.0792]  // Beroun
    ];
    
    L.polyline(route2, {color: '#0d9488', weight: 4, opacity: 0.85}).addTo(map2);
    
    L.marker([50.0189, 13.9757], {icon: startIcon}).addTo(map2).bindPopup('<b>Start: Žloukovice</b><br>Tábořiště Blackfoot');
    L.marker([50.0016, 13.9998], {icon: weirIcon}).addTo(map2).bindPopup('<b>Jez Nižbor</b><br>Špatně sjízdný, přetahuje se vlevo');
    L.marker([49.9833, 14.0531], {icon: weirIcon}).addTo(map2).bindPopup('<b>Jez Hýskov</b><br>Přetahuje se vlevo (sportovní propust)');
    L.marker([49.9675, 14.0792], {icon: endIcon}).addTo(map2).bindPopup('<b>Cíl: Beroun</b><br>Autokemp Na Hrázi');
  }
  
  if (map3El) {
    const map3 = L.map('map-day3', {
      scrollWheelZoom: false
    }).setView([49.948, 14.135], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map3);
    
    const route3 = [
      [49.9675, 14.0792], // Beroun
      [49.9657, 14.0841], // Beroun jez
      [49.9550, 14.1020], 
      [49.9366, 14.1352], // Srbsko
      [49.9317, 14.1843]  // Karlštejn
    ];
    
    L.polyline(route3, {color: '#0d9488', weight: 4, opacity: 0.85}).addTo(map3);
    
    L.marker([49.9675, 14.0792], {icon: startIcon}).addTo(map3).bindPopup('<b>Start: Beroun</b><br>Autokemp Na Hrázi');
    L.marker([49.9657, 14.0841], {icon: weirIcon}).addTo(map3).bindPopup('<b>Jez Beroun</b><br>Nebezpečný jez, přetahuje se');
    L.marker([49.9366, 14.1352], {icon: startIcon}).addTo(map3).bindPopup('<b>Srbsko</b><br>Zastávka na oběd a pivo');
    L.marker([49.9317, 14.1843], {icon: endIcon}).addTo(map3).bindPopup('<b>Cíl: Karlštejn</b><br>Autokemp Karlštejn');
  }
  
  if (map4El) {
    const map4 = L.map('map-day4', {
      scrollWheelZoom: false
    }).setView([49.924, 14.227], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map4);
    
    const route4 = [
      [49.9317, 14.1843], // Karlštejn
      [49.9194, 14.2125], // Zadní Třebaň
      [49.9234, 14.2709]  // Dobřichovice
    ];
    
    L.polyline(route4, {color: '#f59e0b', weight: 4, opacity: 0.85}).addTo(map4);
    
    L.marker([49.9317, 14.1843], {icon: startIcon}).addTo(map4).bindPopup('<b>Start: Karlštejn</b><br>Autokemp Karlštejn');
    L.marker([49.9194, 14.2125], {icon: weirIcon}).addTo(map4).bindPopup('<b>Jez Zadní Třebaň</b><br>Přetahuje se');
    L.marker([49.9234, 14.2709], {icon: endIcon}).addTo(map4).bindPopup('<b>Cíl: Dobřichovice</b><br>Autokemp Dobřichovice');
  }
}
