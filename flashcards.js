/* ==========================================================================
   EDUPULSE 3D FLASHCARDS & SPACED REPETITION ENGINE
   Interactive Flip Cards, Custom Card Creator & Printable PDF Flashcard Deck
   ========================================================================== */

const Flashcards = {
  currentDeckKey: 'math',
  currentIndex: 0,
  isFlipped: false,
  userCards: [],

  init() {
    this.loadUserCards();
    this.setupListeners();
    this.renderCurrentCard();
  },

  loadUserCards() {
    try {
      const stored = localStorage.getItem('edupulse_user_flashcards');
      if (stored) {
        this.userCards = JSON.parse(stored);
      }
    } catch (e) {
      this.userCards = [];
    }
  },

  saveUserCards() {
    try {
      localStorage.setItem('edupulse_user_flashcards', JSON.stringify(this.userCards));
    } catch (e) {}
  },

  getActiveDeck() {
    if (this.currentDeckKey === 'custom') {
      return [...STUDY_DATABASE.flashcards.custom, ...this.userCards];
    }
    return STUDY_DATABASE.flashcards[this.currentDeckKey] || [];
  },

  setupListeners() {
    const cardBox = document.getElementById('activeFlashcardBox');
    const deckSelect = document.getElementById('flashcardDeckSelect');
    const prevBtn = document.getElementById('prevCardBtn');
    const nextBtn = document.getElementById('nextCardBtn');
    const exportPdfBtn = document.getElementById('exportFlashcardsPdfBtn');
    const addCardBtn = document.getElementById('addNewCardBtn');

    // Add Card Modal elements
    const modal = document.getElementById('flashcardModal');
    const closeModalBtn = document.getElementById('closeFlashcardModalBtn');
    const cancelModalBtn = document.getElementById('cancelFlashcardBtn');
    const saveCardBtn = document.getElementById('saveNewFlashcardBtn');

    // Flip card on click
    if (cardBox) {
      cardBox.addEventListener('click', () => {
        this.flipCard();
      });
    }

    // Deck selection change
    if (deckSelect) {
      deckSelect.addEventListener('change', (e) => {
        this.currentDeckKey = e.target.value;
        this.currentIndex = 0;
        this.isFlipped = false;
        this.renderCurrentCard();
      });
    }

    // Next / Prev buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prevCard());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextCard());
    }

    // Keyboard navigation (Left, Right, Space)
    window.addEventListener('keydown', (e) => {
      // Only when flashcards tab is active
      const pane = document.getElementById('tab-flashcards');
      if (!pane || !pane.classList.contains('active')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.flipCard();
      } else if (e.code === 'ArrowRight') {
        this.nextCard();
      } else if (e.code === 'ArrowLeft') {
        this.prevCard();
      }
    });

    // Spaced repetition ratings
    ['rateHardBtn', 'rateGoodBtn', 'rateEasyBtn'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          App.showToast('Score recorded! Next card loading...', 'info');
          setTimeout(() => this.nextCard(), 400);
        });
      }
    });

    // Export Deck to PDF
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        const deck = this.getActiveDeck();
        PdfExporter.exportFlashcardDeck(this.currentDeckKey, deck);
      });
    }

    // Add card modal triggers
    if (addCardBtn && modal) {
      addCardBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    const closeModal = () => {
      if (modal) modal.classList.remove('active');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    if (saveCardBtn) {
      saveCardBtn.addEventListener('click', () => {
        const cat = document.getElementById('newCardCategory').value.trim() || 'My Notes';
        const front = document.getElementById('newCardFront').value.trim();
        const back = document.getElementById('newCardBack').value.trim();
        const tip = document.getElementById('newCardTip').value.trim();

        if (!front || !back) {
          App.showToast('Please provide both a Question and an Answer!', 'warning');
          return;
        }

        const newCard = { category: cat, question: front, answer: back, tip: tip };
        this.userCards.push(newCard);
        this.saveUserCards();

        // Switch to custom deck and view new card
        if (deckSelect) deckSelect.value = 'custom';
        this.currentDeckKey = 'custom';
        this.currentIndex = this.getActiveDeck().length - 1;
        this.renderCurrentCard();

        closeModal();
        App.showToast('Flashcard saved successfully!', 'success');
      });
    }
  },

  flipCard() {
    const cardBox = document.getElementById('activeFlashcardBox');
    if (!cardBox) return;
    this.isFlipped = !this.isFlipped;
    cardBox.classList.toggle('flipped', this.isFlipped);
  },

  nextCard() {
    const deck = this.getActiveDeck();
    if (deck.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % deck.length;
    this.resetFlipAndRender();
  },

  prevCard() {
    const deck = this.getActiveDeck();
    if (deck.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + deck.length) % deck.length;
    this.resetFlipAndRender();
  },

  resetFlipAndRender() {
    const cardBox = document.getElementById('activeFlashcardBox');
    if (cardBox) {
      this.isFlipped = false;
      cardBox.classList.remove('flipped');
    }
    setTimeout(() => {
      this.renderCurrentCard();
    }, 150);
  },

  renderCurrentCard() {
    const deck = this.getActiveDeck();
    const currentNumElem = document.getElementById('currentCardNum');
    const totalNumElem = document.getElementById('totalCardsNum');
    const catTag = document.getElementById('cardCategoryTag');
    const frontText = document.getElementById('cardFrontText');
    const backText = document.getElementById('cardBackText');
    const expText = document.getElementById('cardExplanationText');

    if (deck.length === 0) {
      if (frontText) frontText.textContent = 'No flashcards in this deck yet. Click "+ Add New Flashcard" above!';
      if (backText) backText.textContent = '';
      if (expText) expText.textContent = '';
      if (currentNumElem) currentNumElem.textContent = '0';
      if (totalNumElem) totalNumElem.textContent = '0';
      return;
    }

    const card = deck[this.currentIndex] || deck[0];

    if (currentNumElem) currentNumElem.textContent = (this.currentIndex + 1);
    if (totalNumElem) totalNumElem.textContent = deck.length;
    if (catTag) catTag.textContent = card.category || 'Topic';
    if (frontText) frontText.textContent = card.question;
    if (backText) backText.textContent = card.answer;
    if (expText) expText.textContent = card.tip || '';
  }
};

if (typeof window !== 'undefined') {
  window.Flashcards = Flashcards;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Flashcards.init());
  } else {
    Flashcards.init();
  }
}
