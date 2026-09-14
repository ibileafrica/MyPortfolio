/**
 * Oluwabiyi Ayodele Samson - Creative Director Portfolio JavaScript
 * Video modal lightbox, typewriter, campaign filtering, and brand inquiry handling.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Typewriter Effect
  initTypewriter();

  // 3. Navbar scroll & active navigation tracker
  initNavbarScroll();

  // 4. Mobile Navigation Drawer
  initMobileMenu();

  // 5. Campaigns Dynamic Load & Category Filter
  initCampaignsSection();

  // 6. Video Modal Lightbox
  initVideoModal();

  // 7. Brand Booking / Campaign Inquiry AJAX Form
  initBookingForm();
});

/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'Direct-Response Creative Director',
    'E-Commerce Commercial Specialist',
    'High-ROAS Video Ad Strategist',
    'DTC Product Film Architect'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 2200; // Pause at completion
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   NAVBAR SCROLL & ACTIVE LINK OBSERVER
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy active link detection
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const icon = toggleBtn.querySelector('i');
    if (navMenu.classList.contains('open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   CAMPAIGNS SECTION (FETCH, RENDER, FILTER)
   ========================================================================== */
let allCampaigns = [];

async function initCampaignsSection() {
  const gridContainer = document.getElementById('campaigns-grid');
  const filterButtons = document.querySelectorAll('#campaigns-filter-bar .filter-btn');

  try {
    const response = await fetch('/api/projects');
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    const result = await response.json();

    if (result.success && Array.isArray(result.data)) {
      allCampaigns = result.data;
      renderCampaigns(allCampaigns);
    } else if (Array.isArray(result)) {
      allCampaigns = result;
      renderCampaigns(allCampaigns);
    } else {
      throw new Error('Invalid campaigns payload');
    }
  } catch (error) {
    console.warn('API error, trying static projects dataset:', error);
    try {
      const staticRes = await fetch('data/projects.json');
      if (staticRes.ok) {
        const staticData = await staticRes.json();
        allCampaigns = Array.isArray(staticData) ? staticData : (staticData.data || []);
        renderCampaigns(allCampaigns);
        return;
      }
    } catch (e) {
      console.warn('Static file fetch failed, using built-in cache:', e);
    }
    allCampaigns = getFallbackCampaigns();
    renderCampaigns(allCampaigns);
  }

  // Filter Click Handlers
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      if (filter === 'all') {
        renderCampaigns(allCampaigns);
      } else {
        const filtered = allCampaigns.filter(item => item.category === filter);
        renderCampaigns(filtered);
      }
    });
  });
}

function renderCampaigns(campaigns) {
  const gridContainer = document.getElementById('campaigns-grid');
  if (!gridContainer) return;

  if (!campaigns || campaigns.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <i class="fa-solid fa-video-slash fa-2x"></i>
        <p style="margin-top: 10px;">No campaigns available in this category.</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = campaigns.map(camp => `
    <article class="campaign-card" data-category="${camp.category}">
      <div class="campaign-thumb-wrapper" onclick="openCampaignVideo('${escapeAttr(camp.title)}', '${escapeAttr(camp.videoSample)}')">
        <div class="campaign-thumb" style="background: ${camp.thumbnailGradient || '#0f172a'};">
          <div class="campaign-overlay-gradient">
            <div class="thumb-top-meta">
              <span class="badge-format">${escapeHtml(camp.format || 'Commercial')}</span>
              <span class="badge-roas"><i class="fa-solid fa-bolt"></i> ${escapeHtml(camp.metrics || 'Verified ROI')}</span>
            </div>
            
            <div class="card-play-btn" title="Watch Commercial">
              <i class="fa-solid fa-play"></i>
            </div>

            <div class="thumb-bottom-meta">
              <span><i class="fa-regular fa-clock"></i> ${escapeHtml(camp.duration || '0:45')}</span>
              <span><i class="fa-solid fa-expand"></i> Preview</span>
            </div>
          </div>
        </div>
      </div>

      <div class="campaign-card-content">
        <span class="campaign-client-tag">${escapeHtml(camp.client)}</span>
        <h3 class="campaign-title">${escapeHtml(camp.title)}</h3>
        <p class="campaign-description">${escapeHtml(camp.description)}</p>
        
        <div class="campaign-metrics-box">
          <span class="metric-label-small">Attributed Impact:</span>
          <span class="metric-val-bold">${escapeHtml(camp.impact || 'High Converting')}</span>
        </div>

        <div class="campaign-tags">
          ${(camp.tags || []).map(t => `<span class="campaign-tag-pill">${escapeHtml(t)}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');
}

function getFallbackCampaigns() {
  return [
    {
      id: 1,
      title: "Zola Luxury Fashion - Black Friday Mega Sale TVC",
      client: "Zola Fashion Nigeria",
      category: "commercials",
      badge: "TVC & Digital",
      format: "16:9 & 9:16",
      duration: "0:60 / 0:30",
      description: "High-octane fashion commercial combining cinematic slow-motion visuals with high-urgency promotional hooks.",
      metrics: "4.8x ROAS",
      impact: "₦180M+ GMV in 7 Days",
      tags: ["Direct-Response TVC", "Fashion E-Commerce", "Black Friday"],
      thumbnailGradient: "linear-gradient(135deg, #1e1b4b 0%, #4338ca 50%, #f43f5e 100%)",
      videoSample: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      id: 2,
      title: "Kariakoo Gadgets - Flagship Smartphone Launch Film",
      client: "Kariakoo Tech Hub",
      category: "product-launch",
      badge: "Product Film",
      format: "16:9 4K Cinema",
      duration: "1:15",
      description: "Futuristic product reveal commercial featuring dynamic 3D lighting simulation, macro lens close-ups, and punchy sound design.",
      metrics: "Sold Out in 72h",
      impact: "₦120M+ First Batch",
      tags: ["Product Launch", "Consumer Tech", "Cinematic 4K"],
      thumbnailGradient: "linear-gradient(135deg, #0f172a 0%, #0369a1 50%, #06b6d4 100%)",
      videoSample: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
      id: 3,
      title: "Nura Glow Botanicals - Direct-Response TikTok & Reels Blitz",
      client: "Nura Skin Nigeria",
      category: "social-ads",
      badge: "TikTok & Reels",
      format: "9:16 Vertical",
      duration: "0:25",
      description: "Hook-heavy direct response video ad creatives designed specifically for mobile shoppers.",
      metrics: "+310% Conversion",
      impact: "12M+ Video Views",
      tags: ["DTC Social Ads", "Beauty & Skincare", "TikTok Viral"],
      thumbnailGradient: "linear-gradient(135deg, #4c0519 0%, #be123c 50%, #fb7185 100%)",
      videoSample: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    }
  ];
}

/* ==========================================================================
   VIDEO MODAL LIGHTBOX
   ========================================================================== */
function initVideoModal() {
  const modal = document.getElementById('video-modal-backdrop');
  const closeBtn = document.getElementById('modal-close-btn');
  const videoPlayer = document.getElementById('modal-video-player');
  const showreelCard = document.getElementById('showreel-card');
  const heroReelBtn = document.getElementById('hero-watch-reel-btn');

  if (!modal || !videoPlayer) return;

  function openShowreel() {
    openCampaignVideo(
      'Oluwabiyi Ayodele Samson - 2026 Commercial Director Showreel',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    );
  }

  if (showreelCard) {
    showreelCard.addEventListener('click', openShowreel);
    showreelCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openShowreel();
      }
    });
  }

  if (heroReelBtn) {
    heroReelBtn.addEventListener('click', openShowreel);
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Expose to global scope for onclick triggers
  window.openCampaignVideo = function(title, videoUrl) {
    const modalTitle = document.getElementById('modal-video-title');
    if (modalTitle) modalTitle.textContent = title;

    videoPlayer.src = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    videoPlayer.play().catch(() => {
      // Autoplay with sound might be blocked, user can press play manually
    });
  };
}

/* ==========================================================================
   BRAND INQUIRY / BOOKING FORM (AJAX)
   ========================================================================== */
function initBookingForm() {
  const form = document.getElementById('brand-booking-form');
  const submitBtn = document.getElementById('booking-submit-btn');
  const btnText = document.getElementById('btn-submit-text');
  const btnIcon = document.getElementById('btn-submit-icon');
  const feedback = document.getElementById('booking-form-feedback');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const brandName = form.brandName.value.trim();
    const contactPerson = form.contactPerson.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const storeUrl = form.storeUrl.value.trim();
    const budgetTier = form.budgetTier.value;
    const campaignGoals = form.campaignGoals.value;
    const message = form.message.value.trim();

    // Basic Validation
    if (!brandName || !contactPerson || !email || !message) {
      showFeedback('Please fill out all required fields marked with an asterisk (*).', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please provide a valid business email address.', 'error');
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    btnText.textContent = 'Submitting Campaign Brief...';
    btnIcon.className = 'fa-solid fa-spinner fa-spin';
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          brandName,
          contactPerson,
          email,
          phone,
          storeUrl,
          budgetTier,
          campaignGoals,
          message
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showFeedback(data.message, 'success');
        form.reset();
      } else {
        showFeedback(data.message || 'Error submitting your campaign brief. Please try again or reach out on WhatsApp.', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showFeedback('Unable to connect to the server. Please contact directly via WhatsApp or email.', 'error');
    } finally {
      submitBtn.disabled = false;
      btnText.textContent = 'Submit Campaign Brief';
      btnIcon.className = 'fa-solid fa-paper-plane';
    }
  });

  function showFeedback(text, type) {
    feedback.textContent = text;
    feedback.className = `form-feedback ${type}`;
    feedback.style.display = 'block';
  }
}

/* Helpers */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}
