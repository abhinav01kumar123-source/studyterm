/* ==========================================================================
   EDUPULSE PDF EXPORT ENGINE
   Generates clean, professionally formatted PDF handouts & cheatsheets
   ========================================================================== */

const PdfExporter = {
  /**
   * Export an active curriculum topic into a beautiful study handout PDF
   */
  exportTopic(topic) {
    if (!topic) return;

    // Build offscreen printable template
    const printContainer = document.createElement('div');
    printContainer.className = 'pdf-export-document';
    printContainer.style.padding = '30px';
    printContainer.style.fontFamily = "'Plus Jakarta Sans', Arial, sans-serif";
    printContainer.style.color = '#1e293b';
    printContainer.style.background = '#ffffff';
    printContainer.style.lineHeight = '1.6';

    const formulasHtml = topic.formulas.map(f => `
      <div style="margin-bottom: 12px; padding: 10px 14px; background: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 4px;">
        <div style="font-weight: 700; color: #4338ca; font-size: 13px; text-transform: uppercase;">${f.title}</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 14px; color: #b45309; margin: 4px 0; font-weight: 600;">${f.math}</div>
        <div style="font-size: 12px; color: #64748b;">${f.desc}</div>
      </div>
    `).join('');

    const quizHtml = topic.quiz.map((q, idx) => `
      <div style="margin-bottom: 14px; padding: 10px; border-bottom: 1px dashed #cbd5e1;">
        <div style="font-weight: 600; font-size: 13px; color: #0f172a;">Q${idx + 1}. ${q.question}</div>
        <div style="margin-top: 4px; font-size: 12px; color: #15803d; font-weight: 600;">Answer: ${q.options[q.answer]}</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 2px;"><em>Explanation:</em> ${q.explanation}</div>
      </div>
    `).join('');

    printContainer.innerHTML = `
      <div style="border-bottom: 2px solid #6366f1; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <span style="display: inline-block; padding: 3px 10px; background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 700; border-radius: 12px; text-transform: uppercase;">${topic.subjectName}</span>
          <h1 style="font-size: 22px; color: #0f172a; margin: 8px 0 4px 0; font-weight: 800;">${topic.title}</h1>
          <div style="font-size: 12px; color: #64748b;">Difficulty: ${topic.level} | Read Time: ${topic.duration}</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #94a3b8;">
          <div style="font-weight: 700; color: #6366f1; font-size: 13px;">EduPulse Study Notes</div>
          <div>Generated on: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; color: #1e1b4b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">Detailed Study Notes & Summary</h2>
        <div style="font-size: 13px; color: #334155;">
          ${topic.notes}
        </div>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 16px; color: #1e1b4b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">Key Formulas & Core Theorems</h2>
        ${formulasHtml}
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 16px; color: #1e1b4b; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px;">Practice Questions & Solutions</h2>
        ${quizHtml}
      </div>

      <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8;">
        EduPulse • 100% Distraction-Free Study Platform • Keep Learning & Revising
      </div>
    `;

    // Trigger PDF download via html2pdf
    const opt = {
      margin: 10,
      filename: `${topic.title.replace(/[^a-zA-Z0-9]/g, '_')}_Cheatsheet.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(printContainer).save().then(() => {
        App.showToast('Study Cheatsheet PDF downloaded successfully!', 'success');
        if (window.confetti) {
          window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });
        }
      }).catch(err => {
        console.error('PDF generation error:', err);
        App.showToast('Falling back to print window...', 'info');
        this.printFallback(printContainer);
      });
    } else {
      this.printFallback(printContainer);
    }
  },

  /**
   * Export custom Markdown or Text Notes to PDF
   */
  exportCustomNote(title, contentHtml) {
    const printContainer = document.createElement('div');
    printContainer.style.padding = '30px';
    printContainer.style.fontFamily = "'Plus Jakarta Sans', Arial, sans-serif";
    printContainer.style.color = '#1e293b';
    printContainer.style.background = '#ffffff';
    printContainer.style.lineHeight = '1.7';

    printContainer.innerHTML = `
      <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
          <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: 800;">${title || 'Study Cheatsheet'}</h1>
          <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Created with EduPulse Notepad</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #94a3b8;">
          <div>Date: ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <div style="font-size: 13.5px; color: #334155;">
        ${contentHtml}
      </div>
      <div style="margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 11px; color: #94a3b8;">
        EduPulse Study Companion • Verified Revision Notes
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `${(title || 'Study_Notes').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(printContainer).save().then(() => {
        App.showToast('Note PDF generated and downloaded!', 'success');
        if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
      });
    } else {
      this.printFallback(printContainer);
    }
  },

  /**
   * Export Flashcard deck to printable flashcard sheet
   */
  exportFlashcardDeck(deckName, cards) {
    if (!cards || cards.length === 0) return;

    const printContainer = document.createElement('div');
    printContainer.style.padding = '25px';
    printContainer.style.fontFamily = "'Plus Jakarta Sans', Arial, sans-serif";
    printContainer.style.color = '#1e293b';

    const cardsGrid = cards.map((c, i) => `
      <div style="break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 8px; padding: 14px; margin-bottom: 14px; background: #f8fafc;">
        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 700; margin-bottom: 6px;">
          <span>CARD #${i + 1}</span>
          <span>${c.category || 'Topic'}</span>
        </div>
        <div style="font-weight: 700; font-size: 14px; color: #0f172a; margin-bottom: 8px;">Q: ${c.question}</div>
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #166534; font-weight: 600; padding: 6px 10px; background: #dcfce7; border-radius: 4px; margin-bottom: 6px;">
          A: ${c.answer}
        </div>
        ${c.tip ? `<div style="font-size: 11px; color: #64748b;"><em>Tip:</em> ${c.tip}</div>` : ''}
      </div>
    `).join('');

    printContainer.innerHTML = `
      <div style="border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-bottom: 18px;">
        <h1 style="font-size: 20px; color: #065f46; margin: 0; font-weight: 800;">${deckName.toUpperCase()} FLASHCARD DECK</h1>
        <div style="font-size: 12px; color: #64748b;">Printable Spaced-Repetition Study Cards (${cards.length} cards)</div>
      </div>
      <div>${cardsGrid}</div>
    `;

    const opt = {
      margin: 10,
      filename: `${deckName}_Flashcards.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(printContainer).save().then(() => {
        App.showToast('Flashcard Deck PDF downloaded!', 'success');
        if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
      });
    } else {
      this.printFallback(printContainer);
    }
  },

  /**
   * Fallback for printing using new browser window
   */
  printFallback(element) {
    const printWin = window.open('', '_blank');
    printWin.document.write('<html><head><title>EduPulse Study Notes</title>');
    printWin.document.write('</head><body>');
    printWin.document.write(element.innerHTML);
    printWin.document.write('</body></html>');
    printWin.document.close();
    printWin.focus();
    printWin.print();
    printWin.close();
  }
};

if (typeof window !== 'undefined') {
  window.PdfExporter = PdfExporter;
}
