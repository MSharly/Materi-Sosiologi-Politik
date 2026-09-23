document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const tabs = document.querySelectorAll('.era-tab');
  const items = document.querySelectorAll('.timeline-item');
  const emptyState = document.querySelector('#emptyState');
  const focusSearch = document.querySelector('[data-focus-search]');
  const detailPanels = document.querySelectorAll('.era-detail');
  const progressValue = document.querySelector('#progressValue');
  const progressTrack = document.querySelector('#progressTrack');
  const progressText = document.querySelector('#progressText');
  const progressSections = document.querySelectorAll('[data-progress-section]');
  const progressKey = 'mata-kuliah-sosiologi-politik-read-sections';
  const savedSections = JSON.parse(localStorage.getItem(progressKey) || '[]');
  const readSections = new Set(Array.isArray(savedSections) ? savedSections : []);

  function updateReadingProgress() {
    if (!progressValue && !progressText && !progressTrack) return;

    const total = progressSections.length || 1;
    const percentage = Math.round((readSections.size / total) * 100);

    if (progressValue) {
      progressValue.textContent = `${percentage}%`;
      progressValue.title = `${readSections.size} dari ${total} bagian materi telah dibaca`;
    }

    if (progressTrack) {
      progressTrack.style.width = `${percentage}%`;
    }

    if (progressText) {
      progressText.textContent = `${readSections.size}/${total} bagian`;
    }
  }

  if (progressSections.length) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        readSections.add(entry.target.dataset.progressSection);
        localStorage.setItem(progressKey, JSON.stringify([...readSections]));
        updateReadingProgress();
      });
    }, { threshold: 0.25 });

    progressSections.forEach((section) => progressObserver.observe(section));
  }
  updateReadingProgress();

  function filterTimeline() {
    const activeEra = document.querySelector('.era-tab.active')?.dataset.era || 'all';
    let visibleCount = 0;

    items.forEach((item) => {
      const matchesEra = activeEra === 'all' || item.dataset.era.includes(activeEra);
      const shouldShow = matchesEra;
      item.classList.toggle('filter-hidden', !shouldShow);
      if (shouldShow) visibleCount += 1;
    });

    if (emptyState) {
      emptyState.style.display = visibleCount ? 'none' : 'block';
    }

    detailPanels.forEach((panel) => {
      panel.classList.toggle('active', activeEra !== 'all' && panel.dataset.detail === activeEra);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((item) => item.classList.remove('active'));
      tab.classList.add('active');
      filterTimeline();
    });
  });

  document.querySelectorAll('.timeline-link').forEach((link) => {
    const era = link.dataset.activateEra;
    if (era) {
      const correctHref = `#detail-${era}`;
      link.setAttribute('href', correctHref);
      link.dataset.href = correctHref;
    }

    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetEra = link.dataset.activateEra || (link.dataset.href || '').replace('#detail-', '');
      const targetTab = document.querySelector(`.era-tab[data-era="${targetEra}"]`);
      if (!targetTab) return;
      tabs.forEach((tab) => tab.classList.remove('active'));
      targetTab.classList.add('active');
      filterTimeline();
      const targetPanel = document.querySelector(`.era-detail[data-detail="${targetEra}"]`);
      targetPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href') || `#detail-${targetEra}`);
    });
  });

  focusSearch?.addEventListener('click', () => {
    document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.querySelector('.filter-btn')?.addEventListener('click', () => {
    document.querySelector('.era-tab')?.focus();
  });

  const continueButton = document.querySelector('.continue-btn');
  continueButton?.addEventListener('click', () => {
    document.querySelector('#timeline')?.scrollIntoView({ behavior: 'smooth' });
  });
});