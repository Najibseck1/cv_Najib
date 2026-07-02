/**
 * app.js - Interactive features for Master Najib's CV website
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTimelineFilters();
  initSkillTimelineInteractivity();
  initPrintButton();
  initContactForm();
});

/**
 * Mobile Navigation Menu Toggle
 */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });
}

/**
 * Timeline category filtering
 */
function initTimelineFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const timelineEntries = document.querySelectorAll('.timeline-entry');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active classes on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter entries with a CSS transition
      timelineEntries.forEach(entry => {
        const category = entry.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          entry.style.display = 'block';
          // Force reflow and add opacity/transform for smooth animations
          setTimeout(() => {
            entry.style.opacity = '1';
            entry.style.transform = 'translateY(0)';
          }, 50);
        } else {
          entry.style.opacity = '0';
          entry.style.transform = 'translateY(15px)';
          // Wait for transition before hiding
          setTimeout(() => {
            entry.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/**
 * Interactive Mapping: Bidirectional Skills & Experience Highlighting
 */
function initSkillTimelineInteractivity() {
  const skillItems = document.querySelectorAll('.skill-item');
  const timelineEntries = document.querySelectorAll('.timeline-entry');
  
  let activeSkill = null;
  let activeExperience = null;

  // 1. Hover/Click a skill to highlight experiences that use it
  skillItems.forEach(item => {
    const skillName = item.getAttribute('data-skill');
    const parentGroup = item.closest('.skill-card')?.getAttribute('data-skill-group');
    const highlightClass = parentGroup === 'formulation' || parentGroup === 'procedes' 
      ? 'active-highlight-card-amber' 
      : 'active-highlight-card';

    const tagHighlightClass = parentGroup === 'formulation' || parentGroup === 'procedes'
      ? 'active-amber'
      : 'active-highlight';

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // If we clicked the same skill, reset
      if (activeSkill === skillName) {
        resetHighlights();
        activeSkill = null;
        return;
      }

      resetHighlights();
      activeSkill = skillName;

      // Highlight clicked skill
      item.classList.add(tagHighlightClass);

      // Highlight matching experiences and dim others
      let matchCount = 0;
      timelineEntries.forEach(entry => {
        const entrySkills = entry.getAttribute('data-skills') || '';
        const skillsList = entrySkills.split(' ');

        if (skillsList.includes(skillName)) {
          // Highlight card
          entry.classList.add(highlightClass);
          entry.style.opacity = '1';
          matchCount++;
        } else {
          // Dim card
          entry.style.opacity = '0.35';
        }
      });

      // If we are on mobile, scroll slightly towards timeline if matches found
      if (matchCount > 0 && window.innerWidth < 768) {
        const firstMatch = document.querySelector(`.${highlightClass}`);
        if (firstMatch) {
          firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  // 2. Click an experience card to highlight skills used in it
  timelineEntries.forEach(entry => {
    const card = entry.querySelector('.timeline-card');
    if (!card) return;

    card.addEventListener('click', (e) => {
      e.stopPropagation();

      const entrySkills = entry.getAttribute('data-skills') || '';
      const skillsList = entrySkills.split(' ');

      // If same experience is clicked, reset
      if (activeExperience === entry) {
        resetHighlights();
        activeExperience = null;
        return;
      }

      resetHighlights();
      activeExperience = entry;

      // Highlight this entry card
      const category = entry.getAttribute('data-category');
      const cardHighlight = category === 'procedes' ? 'active-highlight-card-amber' : 'active-highlight-card';
      entry.classList.add(cardHighlight);

      // Dim other experiences
      timelineEntries.forEach(other => {
        if (other !== entry) {
          other.style.opacity = '0.35';
        }
      });

      // Highlight matching skills in skills matrix, dim others
      skillItems.forEach(skill => {
        const skillName = skill.getAttribute('data-skill');
        const parentGroup = skill.closest('.skill-card')?.getAttribute('data-skill-group');
        const tagHighlight = parentGroup === 'formulation' || parentGroup === 'procedes' ? 'active-amber' : 'active-highlight';

        if (skillsList.includes(skillName)) {
          skill.classList.add(tagHighlight);
        } else {
          skill.style.opacity = '0.35';
        }
      });
    });
  });

  // 3. Click anywhere else on the document to reset highlights
  document.addEventListener('click', () => {
    resetHighlights();
    activeSkill = null;
    activeExperience = null;
  });

  function resetHighlights() {
    // Reset skill buttons
    skillItems.forEach(skill => {
      skill.classList.remove('active-highlight', 'active-amber');
      skill.style.opacity = '1';
    });

    // Reset timeline entries
    timelineEntries.forEach(entry => {
      entry.classList.remove('active-highlight-card', 'active-highlight-card-amber');
      entry.style.opacity = '1';
    });
  }
}

/**
 * Print / Export PDF logic
 */
function initPrintButton() {
  const printBtn = document.getElementById('btn-print');
  if (!printBtn) return;

  printBtn.addEventListener('click', () => {
    window.print();
  });
}

/**
 * Contact Form Simulation with notification toaster
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const notification = document.getElementById('notification');
  const notifMsg = document.getElementById('notification-message');

  if (!form || !notification) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Extract name for custom feedback
    const nameInput = document.getElementById('form-name');
    const senderName = nameInput ? nameInput.value.trim() : 'Visiteur';

    // Disable button during simulated loading
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Envoi en cours...';
    }

    setTimeout(() => {
      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Envoyer le message';
      }

      // Reset form
      form.reset();

      // Show beautiful toaster notification
      notifMsg.innerHTML = `Merci <strong>${senderName}</strong> ! Message transmis avec succès à <strong>Master Najib</strong>.`;
      notification.classList.add('show');

      // Hide notification after 4.5 seconds
      setTimeout(() => {
        notification.classList.remove('show');
      }, 4500);

    }, 1200);
  });
}
