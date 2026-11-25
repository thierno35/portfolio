/**
 * Dashboard & Network Operations Center (NOC) Telemetry JS
 * Portfolio IT Hybride - Alexandre Martin
 */

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initPingSimulation();
  initCopyButtons();
  initProjectFilters();
  initMobileNav();
  initDispatchForm();
});

// Live Telemetry Clock (UTC & Local)
function initClock() {
  const clockEl = document.getElementById('noc-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMins = String(now.getUTCMinutes()).padStart(2, '0');
    
    clockEl.textContent = `LOC: ${hours}:${mins}:${secs} | UTC: ${utcHours}:${utcMins}`;
  }

  update();
  setInterval(update, 1000);
}

// Network Ping Jitter Simulation (11ms - 17ms)
function initPingSimulation() {
  const pingEl = document.getElementById('noc-ping');
  if (!pingEl) return;

  setInterval(() => {
    const jitter = Math.floor(Math.random() * 7) + 11;
    pingEl.textContent = `${jitter} ms`;
  }, 3500);
}

// 1-Click Copy with Toast Notification
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      navigator.clipboard.writeText(text).then(() => {
        showToast(`✓ Copié dans le presse-papier : ${text}`);
      }).catch(() => {
        // Fallback prompt
        prompt("Copiez la valeur :", text);
      });
    });
  });
}

// Project Tag Filtering
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-primary'));
      filterBtns.forEach(b => b.classList.add('btn-secondary'));
      
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-secondary');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Mobile Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navList = document.querySelector('.nav-list');

  if (toggleBtn && navList) {
    toggleBtn.addEventListener('click', () => {
      navList.classList.toggle('open');
      const isOpen = navList.classList.contains('open');
      toggleBtn.textContent = isOpen ? '[✕ FERMER]' : '[☰ MENU]';
    });
  }
}

// Interactive Dispatch / Contact Form
function initDispatchForm() {
  const form = document.getElementById('dispatch-form');
  const output = document.getElementById('dispatch-output');
  if (!form || !output) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const role = form.querySelector('[name="role"]').value.trim();
    const msg = form.querySelector('[name="message"]').value.trim();

    if (!name || !email || !msg) {
      showToast('⚠️ Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    const msgId = 'PKT-' + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toISOString();

    output.innerHTML = `
      <div style="background: rgba(0, 255, 102, 0.08); border: 1px solid var(--green-primary); padding: 1rem; border-radius: 4px; margin-top: 1rem;">
        <div style="color: var(--green-primary); font-weight: 700; margin-bottom: 0.5rem;">[TRANSMISSION SUCCESSFUL]</div>
        <div style="font-size: 0.85rem; font-family: var(--font-mono); color: var(--text-main);">
          • STATUS : 200 OK (Packet ACK)<br>
          • PACKET_ID : ${msgId}<br>
          • SENDER : ${name} &lt;${email}&gt;<br>
          • MOTIF : ${role || 'Contact Direct / Opportunité'}<br>
          • TIMESTAMP : ${dateStr}
        </div>
        <p style="margin-top: 0.8rem; font-size: 0.9rem; color: var(--text-muted);">
          Merci pour votre message ! Je réponds généralement en moins de 24h ouvrées.<br>
          <em>Une copie directe peut également être envoyée via votre client mail :</em>
        </p>
        <a href="mailto:alexandre.martin.it@proton.me?subject=[${encodeURIComponent(role || 'Contact Portfolio')}] - ${encodeURIComponent(name)}&body=${encodeURIComponent(msg)}" 
           class="btn btn-primary btn-sm" style="margin-top: 0.6rem;">
          Ouvrir dans mon client mail &rarr;
        </a>
      </div>
    `;

    showToast(`✓ Message transmis (ID: ${msgId})`);
    form.reset();
  });
}

// Show Toast Message
function showToast(message) {
  let toast = document.getElementById('site-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'site-toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.display = 'flex';

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}
