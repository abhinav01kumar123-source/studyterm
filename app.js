/* ==========================================================================
   EDUPULSE CORE APP CONTROLLER
   Navigation, Lesson Viewer, Search, Theming, Quizzes & State Management
   ========================================================================== */

const App = {
  activeTopic: null,
  activeFilterSubject: 'all',

  init() {
    this.setupTheme();
    this.setupNavigation();
    this.setupSearch();
    this.setupCurriculumViewer();
    this.setupStatsTracker();

    // Initialize Submodules inside safe try-catches
    try { if (typeof YoutubeSearch !== 'undefined') YoutubeSearch.init(); } catch (e) { console.error('YoutubeSearch init error:', e); }
    try { if (typeof UserGuide !== 'undefined') UserGuide.init(); } catch (e) { console.error('UserGuide init error:', e); }
    try { if (typeof UrlHub !== 'undefined') UrlHub.init(); } catch (e) { console.error('UrlHub init error:', e); }
    try { if (typeof Converter !== 'undefined') Converter.init(); } catch (e) { console.error('Converter init error:', e); }
    try { if (typeof FocusAudio !== 'undefined') FocusAudio.init(); } catch (e) { console.error('FocusAudio init error:', e); }
    try { if (typeof Flashcards !== 'undefined') Flashcards.init(); } catch (e) { console.error('Flashcards init error:', e); }
    try { if (typeof Notes !== 'undefined') Notes.init(); } catch (e) { console.error('Notes init error:', e); }

    // Load initial lesson
    this.loadTopic(STUDY_DATABASE.topics[0]);

    // Check confetti celebration trigger button in sidebar
    const confettiBtn = document.getElementById('triggerConfetti');
    if (confettiBtn) {
      confettiBtn.addEventListener('click', () => {
        if (window.confetti) {
          window.confetti({ particleCount: 100, spread: 90, origin: { y: 0.7 } });
        }
        this.showToast('Great job! Keep up the daily study streak!', 'success');
      });
    }

    // Quick open pomodoro
    const pomoQuick = document.getElementById('openPomodoroQuick');
    const navPomo = document.getElementById('navbarPomodoroBtn');
    [pomoQuick, navPomo].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.switchTab('focus-room');
        });
      }
    });
  },

  /**
   * Theme Management (Dark / Light)
   */
  setupTheme() {
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');

    const savedTheme = localStorage.getItem('edupulse_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('edupulse_theme', next);
        this.updateThemeButton(next);
        this.showToast(`Switched to ${next} theme`, 'info');
      });
    }
  },

  updateThemeButton(theme) {
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    if (!themeIcon || !themeText) return;

    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-moon';
      themeText.textContent = 'Dark View';
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      themeText.textContent = 'Light View';
    }
  },

  /**
   * Tab Navigation System
   */
  setupNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-tab]');
    const mobileOpen = document.getElementById('sidebarOpenBtn');
    const mobileClose = document.getElementById('sidebarCloseBtn');
    const sidebar = document.getElementById('sidebar');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-tab');
        this.switchTab(tab);

        // Close sidebar on mobile
        if (sidebar) sidebar.classList.remove('open');
      });
    });

    if (mobileOpen && sidebar) {
      mobileOpen.addEventListener('click', () => sidebar.classList.add('open'));
    }
    if (mobileClose && sidebar) {
      mobileClose.addEventListener('click', () => sidebar.classList.remove('open'));
    }
  },

  switchTab(tabId) {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-tab]');
    const panes = document.querySelectorAll('.tab-pane');

    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('data-tab') === tabId));
    panes.forEach(p => p.classList.toggle('active', p.id === `tab-${tabId}`));

    // Update Top Heading
    const heading = document.getElementById('pageHeading');
    const subheading = document.getElementById('pageSubheading');

    const headers = {
      'lessons': {
        h: 'Topic Lessons & Video Lectures',
        sub: 'Distraction-free comprehensive curriculum with instant PDF cheatsheets'
      },
      'url-hub': {
        h: 'Smart Educational URL Importer',
        sub: 'Paste any lecture link or YouTube URL to watch, study, and export notes to PDF'
      },
      'converter': {
        h: 'Universal Study File Converter',
        sub: 'Convert any study file: Images to PDF, Notes to PDF, Image cross-conversion & CSV tables'
      },
      'focus-room': {
        h: 'Zen Focus Room & Study Soundscape',
        sub: 'Pomodoro study cycles with procedural ambient rain, white noise & alpha waves'
      },
      'flashcards': {
        h: 'Interactive 3D Study Flashcards',
        sub: 'Spaced repetition decks with 3D flip animation and printable PDF deck export'
      },
      'notes': {
        h: 'Smart PDF Notes & Cheatsheet Creator',
        sub: 'Rich study notebook with quick formulas, auto-save, and formatted PDF download'
      }
    };

    if (headers[tabId] && heading && subheading) {
      heading.textContent = headers[tabId].h;
      subheading.textContent = headers[tabId].sub;
    }
  },

  /**
   * Curriculum Topic Browser & Viewer
   */
  setupCurriculumViewer() {
    const filterPills = document.querySelectorAll('.filter-pill');
    filterPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        filterPills.forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.activeFilterSubject = e.currentTarget.getAttribute('data-subject');
        this.renderTopicsList();

        // Automatically switch lesson viewer to the first topic of this subject
        let matching = STUDY_DATABASE.topics;
        if (this.activeFilterSubject !== 'all') {
          matching = matching.filter(t => t.subject === this.activeFilterSubject);
        }
        if (matching.length > 0) {
          this.loadTopic(matching[0]);
        }
      });
    });

    // Theater Mode Toggle
    const theaterBtn = document.getElementById('theaterModeToggleBtn');
    const theaterText = document.getElementById('theaterModeText');
    const lessonsGrid = document.querySelector('.lessons-grid');
    if (theaterBtn && lessonsGrid) {
      theaterBtn.addEventListener('click', () => {
        lessonsGrid.classList.toggle('theater-mode');
        const isTheater = lessonsGrid.classList.contains('theater-mode');
        if (theaterText) {
          theaterText.textContent = isTheater ? 'Exit Theater' : 'Theater Mode';
        }
        const icon = theaterBtn.querySelector('i');
        if (icon) icon.className = isTheater ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
        this.showToast(isTheater ? 'Theater View: Full Width Video' : 'Default View Restored', 'info');
      });
    }

    // Quick Play YouTube Bar & Actions
    const quickInput = document.getElementById('quickYoutubeInput');
    const quickPlayBtn = document.getElementById('quickPlayYoutubeBtn');
    const copyLinkBtn = document.getElementById('copyVideoLinkBtn');
    const reloadBtn = document.getElementById('reloadPlayerBtn');

    const handleQuickVideo = () => {
      if (!quickInput) return;
      const raw = quickInput.value.trim();
      if (!raw) {
        this.showToast('Please enter a YouTube video URL or ID!', 'warning');
        return;
      }
      let videoId = raw;
      if (typeof UrlHub !== 'undefined') {
        const ext = UrlHub.extractVideoId(raw);
        if (ext) videoId = ext;
      }
      const iframe = document.getElementById('lessonVideoIframe');
      const directYtBtn = document.getElementById('directYoutubeLinkBtn');
      if (iframe) {
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
      }
      if (directYtBtn) {
        directYtBtn.href = `https://www.youtube.com/watch?v=${videoId}`;
      }
      this.showToast('Playing custom YouTube video!', 'success');
    };

    if (quickPlayBtn) quickPlayBtn.addEventListener('click', handleQuickVideo);
    if (quickInput) {
      quickInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleQuickVideo();
      });
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', () => {
        const id = this.activeTopic ? this.activeTopic.videoId : 'WUvTyaaNkzM';
        const url = `https://www.youtube.com/watch?v=${id}`;
        navigator.clipboard.writeText(url).then(() => {
          this.showToast('YouTube link copied to clipboard!', 'success');
        }).catch(() => {
          this.showToast(url, 'info');
        });
      });
    }

    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        const iframe = document.getElementById('lessonVideoIframe');
        if (iframe && this.activeTopic) {
          iframe.src = `https://www.youtube.com/embed/${this.activeTopic.videoId}?autoplay=1&enablejsapi=1&rel=0`;
          this.showToast('Player reloaded & synced.', 'info');
        }
      });
    }

    // Subnav tabs (Notes / Formulas / Quiz)
    const subnavBtns = document.querySelectorAll('.subnav-btn');
    const subtabs = document.querySelectorAll('.subtab-content');

    subnavBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        subnavBtns.forEach(b => b.classList.remove('active'));
        subtabs.forEach(s => s.classList.remove('active'));

        const target = e.currentTarget.getAttribute('data-subtab');
        e.currentTarget.classList.add('active');
        const activeSub = document.getElementById(`subtab-${target}`);
        if (activeSub) activeSub.classList.add('active');
      });
    });

    // Topic Stepper buttons (Previous / Next)
    const prevTopicBtn = document.getElementById('prevTopicBtn');
    const nextTopicBtn = document.getElementById('nextTopicBtn');

    if (prevTopicBtn) {
      prevTopicBtn.addEventListener('click', () => {
        const currentIdx = STUDY_DATABASE.topics.findIndex(t => t.id === this.activeTopic.id);
        const prevIdx = (currentIdx - 1 + STUDY_DATABASE.topics.length) % STUDY_DATABASE.topics.length;
        this.loadTopic(STUDY_DATABASE.topics[prevIdx]);
        const card = document.getElementById('activeLessonCard');
        if (card) card.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (nextTopicBtn) {
      nextTopicBtn.addEventListener('click', () => {
        const currentIdx = STUDY_DATABASE.topics.findIndex(t => t.id === this.activeTopic.id);
        const nextIdx = (currentIdx + 1) % STUDY_DATABASE.topics.length;
        this.loadTopic(STUDY_DATABASE.topics[nextIdx]);
        const card = document.getElementById('activeLessonCard');
        if (card) card.scrollIntoView({ behavior: 'smooth' });
        if (window.confetti) window.confetti({ particleCount: 35, spread: 50 });
      });
    }

    // PDF Export Buttons for current topic
    const topExportBtn = document.getElementById('exportCurrentTopicPdfBtn');
    const bottomExportBtn = document.getElementById('bottomExportPdfBtn');

    [topExportBtn, bottomExportBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.exportCurrentLessonPdf();
        });
      }
    });

    this.renderTopicsList();
  },

  renderTopicsList(searchQuery = '') {
    const list = document.getElementById('topicsList');
    const countBadge = document.getElementById('topicCountBadge');
    if (!list) return;

    let filtered = STUDY_DATABASE.topics;

    // Filter by subject
    if (this.activeFilterSubject !== 'all') {
      filtered = filtered.filter(t => t.subject === this.activeFilterSubject);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(q) ||
        t.subjectName.toLowerCase().includes(q) ||
        t.level.toLowerCase().includes(q)
      );
    }

    if (countBadge) countBadge.textContent = `${filtered.length} Topics`;
    list.innerHTML = '';

    if (filtered.length === 0) {
      list.innerHTML = `<div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No matching topics found.</div>`;
      return;
    }

    filtered.forEach(topic => {
      const item = document.createElement('div');
      item.className = `topic-item ${this.activeTopic && this.activeTopic.id === topic.id ? 'active' : ''}`;
      item.setAttribute('data-id', topic.id);

      item.innerHTML = `
        <div class="topic-item-top">
          <span class="topic-sub-badge">${topic.subjectName}</span>
          <span class="topic-item-meta"><i class="fa-solid fa-star gold-star"></i> ${topic.rating}</span>
        </div>
        <div class="topic-item-title">${topic.title}</div>
        <div class="topic-item-meta">
          <span><i class="fa-regular fa-clock"></i> ${topic.duration}</span>
          <span><i class="fa-solid fa-signal"></i> ${topic.level}</span>
        </div>
      `;

      item.addEventListener('click', () => {
        this.loadTopic(topic);
      });

      list.appendChild(item);
    });
  },

  loadTopic(topic) {
    if (!topic) return;
    this.activeTopic = topic;

    // Update active highlight in topics list
    document.querySelectorAll('.topic-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-id') === topic.id);
    });

    // Update Header Metadata
    const badge = document.getElementById('activeSubjectBadge');
    const title = document.getElementById('activeLessonTitle');
    const duration = document.getElementById('activeLessonDuration');
    const level = document.getElementById('activeLessonLevel');
    const rating = document.getElementById('activeLessonRating');
    const stepperName = document.getElementById('stepperTopicName');
    const directYtBtn = document.getElementById('directYoutubeLinkBtn');

    if (badge) badge.textContent = topic.subjectName;
    if (title) title.textContent = topic.title;
    if (duration) duration.textContent = topic.duration;
    if (level) level.textContent = topic.level;
    if (rating) rating.textContent = topic.rating;
    if (stepperName) stepperName.textContent = topic.title;

    // Direct YouTube link button
    if (directYtBtn) {
      directYtBtn.href = `https://www.youtube.com/watch?v=${topic.videoId}`;
    }

    // Update Video Iframe Embed
    const iframe = document.getElementById('lessonVideoIframe');
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${topic.videoId}?enablejsapi=1&rel=0`;
    }

    // Update Chapters Bar with working jump handlers
    const chaptersBar = document.getElementById('videoChaptersBar');
    if (chaptersBar && topic.chapters) {
      chaptersBar.innerHTML = '';
      topic.chapters.forEach((ch, idx) => {
        const btn = document.createElement('button');
        btn.className = `chapter-btn ${idx === 0 ? 'active' : ''}`;
        btn.innerHTML = `<i class="fa-solid fa-play" style="font-size: 0.65rem;"></i> ${ch.title} (${ch.time})`;

        // Calculate seconds
        const parts = ch.time.split(':').map(Number);
        let seconds = 0;
        if (parts.length === 2) {
          seconds = parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        }

        btn.addEventListener('click', () => {
          chaptersBar.querySelectorAll('.chapter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (iframe) {
            iframe.src = `https://www.youtube.com/embed/${topic.videoId}?start=${seconds}&autoplay=1&enablejsapi=1&rel=0`;
          }
          this.showToast(`Playing chapter: ${ch.title} (${ch.time})`, 'info');
        });

        chaptersBar.appendChild(btn);
      });
    }

    // Render Study Notes
    const notesArea = document.getElementById('activeLessonNotes');
    if (notesArea) {
      notesArea.innerHTML = topic.notes;
    }

    // Render Formulas Cheatsheet Grid
    const formulasArea = document.getElementById('activeLessonFormulas');
    if (formulasArea && topic.formulas) {
      formulasArea.innerHTML = '';
      topic.formulas.forEach(f => {
        const card = document.createElement('div');
        card.className = 'formula-card';
        card.innerHTML = `
          <div class="formula-title">${f.title}</div>
          <div class="formula-math">${f.math}</div>
          <div class="formula-desc">${f.desc}</div>
        `;
        formulasArea.appendChild(card);
      });
    }

    // Render Practice Quiz
    const quizArea = document.getElementById('activeLessonQuiz');
    if (quizArea && topic.quiz) {
      quizArea.innerHTML = '';
      topic.quiz.forEach((q, qIndex) => {
        const card = document.createElement('div');
        card.className = 'quiz-card';

        let optsHtml = '';
        q.options.forEach((opt, optIndex) => {
          optsHtml += `
            <button class="quiz-opt-btn" data-q="${qIndex}" data-opt="${optIndex}">
              <span>${opt}</span>
              <i class="fa-regular fa-circle"></i>
            </button>
          `;
        });

        card.innerHTML = `
          <div class="quiz-q-num">QUESTION ${qIndex + 1} OF ${topic.quiz.length}</div>
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">${optsHtml}</div>
          <div class="quiz-explanation" id="quiz-exp-${qIndex}">
            <strong>Explanation:</strong> ${q.explanation}
          </div>
        `;

        // Handle answer selection
        card.querySelectorAll('.quiz-opt-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const selectedOpt = parseInt(e.currentTarget.getAttribute('data-opt'));
            const correctOpt = q.answer;
            const expBox = card.querySelector('.quiz-explanation');

            // Disable other buttons for this question
            card.querySelectorAll('.quiz-opt-btn').forEach(b => {
              b.style.pointerEvents = 'none';
              const oIndex = parseInt(b.getAttribute('data-opt'));
              if (oIndex === correctOpt) {
                b.classList.add('correct');
                b.querySelector('i').className = 'fa-solid fa-circle-check';
              }
            });

            if (selectedOpt === correctOpt) {
              if (window.confetti) window.confetti({ particleCount: 40, spread: 60 });
              App.showToast('Correct Answer! Well done!', 'success');
            } else {
              e.currentTarget.classList.add('wrong');
              e.currentTarget.querySelector('i').className = 'fa-solid fa-circle-xmark';
              App.showToast('Incorrect. Review explanation below.', 'warning');
            }

            if (expBox) expBox.style.display = 'block';
          });
        });

        quizArea.appendChild(card);
      });
    }
  },

  /**
   * Global Search Bar
   */
  setupSearch() {
    const input = document.getElementById('globalSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');

    if (!input) return;

    input.addEventListener('input', () => {
      const q = input.value;
      if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';

      // Always switch to lessons view if searching
      this.switchTab('lessons');
      this.renderTopicsList(q);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        clearBtn.style.display = 'none';
        this.renderTopicsList('');
      });
    }
  },

  /**
   * Daily Study Streak and Time Tracker
   */
  setupStatsTracker() {
    let studyMins = parseInt(localStorage.getItem('edupulse_study_mins') || '45');
    const minsElem = document.getElementById('todayStudyMins');

    // Increment 1 minute every 60 seconds
    setInterval(() => {
      studyMins++;
      localStorage.setItem('edupulse_study_mins', studyMins);
      if (minsElem) minsElem.textContent = `${studyMins}m`;
    }, 60000);
  },

  /**
   * Toast Notification Helper
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      'success': 'fa-solid fa-circle-check',
      'info': 'fa-solid fa-circle-info',
      'warning': 'fa-solid fa-triangle-exclamation'
    };
    const icon = iconMap[type] || 'fa-solid fa-bell';

    toast.innerHTML = `
      <i class="${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  },

  exportCurrentLessonPdf() {
    if (this.activeTopic && typeof PdfExporter !== 'undefined') {
      PdfExporter.exportTopic(this.activeTopic);
    } else {
      this.showToast('Generating lesson PDF notes...', 'info');
    }
  },

  toggleTheaterMode() {
    const lessonsGrid = document.querySelector('.lessons-grid');
    const theaterText = document.getElementById('theaterModeText');
    const theaterBtn = document.getElementById('theaterModeToggleBtn');
    if (!lessonsGrid) return;
    lessonsGrid.classList.toggle('theater-mode');
    const isTheater = lessonsGrid.classList.contains('theater-mode');
    if (theaterText) theaterText.textContent = isTheater ? 'Exit Theater' : 'Theater Mode';
    if (theaterBtn) {
      const icon = theaterBtn.querySelector('i');
      if (icon) icon.className = isTheater ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
    }
    this.showToast(isTheater ? 'Theater View: Full Width Video' : 'Default View Restored', 'info');
  },

  toggleZenMode() {
    const overlay = document.getElementById('zenModalOverlay');
    if (overlay) overlay.classList.toggle('active');
  },

  handleQuickVideo() {
    const quickInput = document.getElementById('quickYoutubeInput');
    if (!quickInput) return;
    const raw = quickInput.value.trim();
    if (!raw) {
      this.showToast('Please enter a YouTube video URL or ID!', 'warning');
      return;
    }
    let videoId = raw;
    if (typeof UrlHub !== 'undefined') {
      const ext = UrlHub.extractVideoId(raw);
      if (ext) videoId = ext;
    }
    const iframe = document.getElementById('lessonVideoIframe');
    const directYtBtn = document.getElementById('directYoutubeLinkBtn');
    if (iframe) {
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&rel=0`;
    }
    if (directYtBtn) {
      directYtBtn.href = `https://www.youtube.com/watch?v=${videoId}`;
    }
    this.showToast('Playing custom YouTube video!', 'success');
  },

  copyCurrentVideoLink() {
    const id = this.activeTopic ? this.activeTopic.videoId : 'WUvTyaaNkzM';
    const url = `https://www.youtube.com/watch?v=${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showToast('YouTube link copied to clipboard!', 'success');
      }).catch(() => {
        this.showToast(url, 'info');
      });
    } else {
      this.showToast(url, 'info');
    }
  },

  reloadCurrentVideo() {
    const iframe = document.getElementById('lessonVideoIframe');
    if (iframe && this.activeTopic) {
      iframe.src = `https://www.youtube.com/embed/${this.activeTopic.videoId}?autoplay=1&enablejsapi=1&rel=0`;
      this.showToast('Player reloaded & synced.', 'info');
    }
  },

  prevTopic() {
    if (!STUDY_DATABASE || !STUDY_DATABASE.topics) return;
    const currentIdx = STUDY_DATABASE.topics.findIndex(t => t.id === (this.activeTopic ? this.activeTopic.id : ''));
    const prevIdx = (currentIdx - 1 + STUDY_DATABASE.topics.length) % STUDY_DATABASE.topics.length;
    this.loadTopic(STUDY_DATABASE.topics[prevIdx]);
    const card = document.getElementById('activeLessonCard');
    if (card) card.scrollIntoView({ behavior: 'smooth' });
  },

  nextTopic() {
    if (!STUDY_DATABASE || !STUDY_DATABASE.topics) return;
    const currentIdx = STUDY_DATABASE.topics.findIndex(t => t.id === (this.activeTopic ? this.activeTopic.id : ''));
    const nextIdx = (currentIdx + 1) % STUDY_DATABASE.topics.length;
    this.loadTopic(STUDY_DATABASE.topics[nextIdx]);
    const card = document.getElementById('activeLessonCard');
    if (card) card.scrollIntoView({ behavior: 'smooth' });
    if (window.confetti) window.confetti({ particleCount: 35, spread: 50 });
  }
};

if (typeof window !== 'undefined') {
  window.App = App;
}

// Auto-run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}
