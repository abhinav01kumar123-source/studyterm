/* ==========================================================================
   EDUPULSE SMART NOTES & PDF CHEATSHEET CREATOR
   Rich WYSIWYG note editor, LocalStorage persistence, 1-Click PDF export
   ========================================================================== */

const Notes = {
  savedNotes: [],
  activeNoteId: null,

  init() {
    this.loadNotes();
    this.setupToolbar();
    this.setupListeners();
    this.renderNotesList();
    this.selectNote(this.savedNotes[0]?.id || null);
  },

  loadNotes() {
    try {
      const stored = localStorage.getItem('edupulse_saved_notes');
      if (stored) {
        this.savedNotes = JSON.parse(stored);
      }
    } catch (e) {
      this.savedNotes = [];
    }

    // Default starter notes if empty
    if (!this.savedNotes || this.savedNotes.length === 0) {
      this.savedNotes = [
        {
          id: 'note-starter-1',
          title: 'Physics & Math Quick Formulas Cheatsheet',
          date: new Date().toLocaleDateString(),
          content: `
            <h2>Essential Physics Laws</h2>
            <ul>
              <li><strong>Newton's Second Law:</strong> F = m &middot; a</li>
              <li><strong>Kinetic Energy:</strong> KE = 0.5 &middot; m &middot; v&sup2;</li>
              <li><strong>Work Done:</strong> W = F &middot; d &middot; cos(&theta;)</li>
            </ul>

            <h2>Calculus Identities</h2>
            <p>d/dx (sin x) = cos x<br>d/dx (cos x) = -sin x<br>&int; (1/x) dx = ln|x| + C</p>

            <blockquote>
              "Consistency beats intensity every single day. Master the core formulas first."
            </blockquote>
          `
        },
        {
          id: 'note-starter-2',
          title: 'Python DSA & Algorithm Cheatsheet',
          date: new Date().toLocaleDateString(),
          content: `
            <h2>Common Data Structures Big-O</h2>
            <p><strong>Hash Maps (Dictionaries):</strong> O(1) Search, O(1) Insert</p>
            <p><strong>Binary Search:</strong> O(log N) Time on sorted arrays</p>
            <p><strong>Merge Sort:</strong> O(N log N) Time with O(N) extra space</p>

            <h2>Python List Slicing Trick</h2>
            <pre><code># Reverse a list or string instantly
reversed_item = my_list[::-1]</code></pre>
          `
        }
      ];
      this.saveNotes();
    }
  },

  saveNotes() {
    try {
      localStorage.setItem('edupulse_saved_notes', JSON.stringify(this.savedNotes));
    } catch (e) {}
  },

  setupToolbar() {
    const tools = document.querySelectorAll('.editor-toolbar .tool-btn');
    tools.forEach(btn => {
      btn.addEventListener('mousedown', (e) => {
        // Prevent button click from stealing focus away from editor
        e.preventDefault();
      });

      btn.addEventListener('click', (e) => {
        const paper = document.getElementById('notePaperContent');
        if (paper) paper.focus();

        const cmd = e.currentTarget.getAttribute('data-cmd');
        if (!cmd) return;

        if (cmd === 'h1') {
          document.execCommand('formatBlock', false, '<h1>');
        } else if (cmd === 'h2') {
          document.execCommand('formatBlock', false, '<h2>');
        } else if (cmd === 'ul') {
          document.execCommand('insertUnorderedList', false, null);
        } else if (cmd === 'ol') {
          document.execCommand('insertOrderedList', false, null);
        } else if (cmd === 'quote') {
          document.execCommand('formatBlock', false, '<blockquote>');
        } else if (cmd === 'code') {
          document.execCommand('formatBlock', false, '<pre>');
        } else {
          document.execCommand(cmd, false, null);
        }
        this.onContentChange();
      });
    });
  },

  setupListeners() {
    const titleInput = document.getElementById('noteTitleInput');
    const paper = document.getElementById('notePaperContent');
    const newBtn = document.getElementById('createNewNoteBtn');
    const exportPdfBtn = document.getElementById('exportNotePdfBtn');
    const deleteBtn = document.getElementById('deleteCurrentNoteBtn');
    const formulaBtn = document.getElementById('insertFormulaBtn');

    if (titleInput) {
      titleInput.addEventListener('input', () => {
        const note = this.getActiveNote();
        if (note) {
          note.title = titleInput.value.trim() || 'Untitled Study Note';
          this.renderNotesList();
          this.saveNotes();
        }
      });
    }

    if (paper) {
      paper.addEventListener('input', () => {
        this.onContentChange();
      });
    }

    if (newBtn) {
      newBtn.addEventListener('click', () => {
        this.createNewNote();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        this.deleteActiveNote();
      });
    }

    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        const note = this.getActiveNote();
        if (note) {
          PdfExporter.exportCustomNote(note.title, note.content);
        }
      });
    }

    if (formulaBtn) {
      formulaBtn.addEventListener('click', () => {
        const sampleFormulas = [
          "&Delta;E = h &middot; &nu;",
          "F = G &middot; (m1 &middot; m2) / r&sup2;",
          "a&sup2; + b&sup2; = c&sup2;",
          "&int; u dv = uv - &int; v du"
        ];
        const chosen = sampleFormulas[Math.floor(Math.random() * sampleFormulas.length)];
        document.execCommand('insertHTML', false, ` <strong style="font-family: 'JetBrains Mono', monospace; color: #fbbf24; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">${chosen}</strong> `);
        this.onContentChange();
      });
    }
  },

  onContentChange() {
    const note = this.getActiveNote();
    const paper = document.getElementById('notePaperContent');
    if (note && paper) {
      note.content = paper.innerHTML;
      this.saveNotes();

      const pill = document.getElementById('noteAutoSavePill');
      if (pill) {
        pill.innerHTML = '<i class="fa-solid fa-check"></i> Auto-saved';
        setTimeout(() => {
          pill.innerHTML = '<i class="fa-solid fa-cloud"></i> Saved locally';
        }, 1200);
      }
    }
  },

  getActiveNote() {
    return this.savedNotes.find(n => n.id === this.activeNoteId) || this.savedNotes[0];
  },

  createNewNote() {
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'New Study Topic Note',
      date: new Date().toLocaleDateString(),
      content: '<p>Start jotting down key takeaways, derivations, or exam notes...</p>'
    };
    this.savedNotes.unshift(newNote);
    this.saveNotes();
    this.renderNotesList();
    this.selectNote(newNote.id);
    App.showToast('Created new study note!', 'info');
  },

  deleteActiveNote() {
    if (this.savedNotes.length <= 1) {
      App.showToast('You must keep at least 1 note.', 'warning');
      return;
    }
    const idx = this.savedNotes.findIndex(n => n.id === this.activeNoteId);
    if (idx !== -1) {
      this.savedNotes.splice(idx, 1);
      this.saveNotes();
      this.renderNotesList();
      this.selectNote(this.savedNotes[0]?.id);
      App.showToast('Note deleted.', 'info');
    }
  },

  selectNote(id) {
    if (!id) return;
    this.activeNoteId = id;

    const note = this.getActiveNote();
    const titleInput = document.getElementById('noteTitleInput');
    const paper = document.getElementById('notePaperContent');

    if (note) {
      if (titleInput) titleInput.value = note.title;
      if (paper) paper.innerHTML = note.content;
    }

    // Update list active highlight
    document.querySelectorAll('.saved-note-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-id') === id);
    });
  },

  renderNotesList() {
    const list = document.getElementById('savedNotesList');
    if (!list) return;

    list.innerHTML = '';
    this.savedNotes.forEach(note => {
      const item = document.createElement('div');
      item.className = `saved-note-item ${note.id === this.activeNoteId ? 'active' : ''}`;
      item.setAttribute('data-id', note.id);
      item.innerHTML = `
        <div class="note-item-title">${note.title}</div>
        <div class="note-item-date">${note.date}</div>
      `;

      item.addEventListener('click', () => {
        this.selectNote(note.id);
      });

      list.appendChild(item);
    });
  }
};

if (typeof window !== 'undefined') {
  window.Notes = Notes;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Notes.init());
  } else {
    Notes.init();
  }
}
