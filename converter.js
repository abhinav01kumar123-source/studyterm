/* ==========================================================================
   EDUPULSE UNIVERSAL FILE CONVERTER
   100% Client-Side, Secure, Instant File & Document Conversion
   ========================================================================== */

const Converter = {
  selectedImagesForPdf: [],
  currentCrossImage: null,
  currentCsvData: null,

  init() {
    this.setupTabs();
    this.setupImageToPdf();
    this.setupTextToPdf();
    this.setupImageCross();
    this.setupCsvConverter();
  },

  /**
   * Switch between conversion modes
   */
  setupTabs() {
    const tabBtns = document.querySelectorAll('.conv-tab-btn');
    const panels = document.querySelectorAll('.conv-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        const target = e.currentTarget.getAttribute('data-conv-mode');
        e.currentTarget.classList.add('active');
        const activePanel = document.getElementById(`conv-${target}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });
  },

  /**
   * 1. Images to PDF Converter
   */
  setupImageToPdf() {
    const dropZone = document.getElementById('imgPdfDropZone');
    const input = document.getElementById('imgPdfInput');
    const clearBtn = document.getElementById('clearImgPdfBtn');
    const generateBtn = document.getElementById('generateImgPdfBtn');

    if (!dropZone || !input) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
      });
    });

    dropZone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      this.handleImagesForPdf(files);
    });

    dropZone.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
        input.click();
      }
    });

    input.addEventListener('change', (e) => {
      this.handleImagesForPdf(e.target.files);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.selectedImagesForPdf = [];
        this.renderImageThumbnails();
      });
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', () => {
        this.convertImagesToPdf();
      });
    }
  },

  handleImagesForPdf(fileList) {
    if (!fileList || fileList.length === 0) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedImagesForPdf.push({
            name: file.name,
            src: e.target.result
          });
          this.renderImageThumbnails();
        };
        reader.readAsDataURL(file);
      }
    }
    App.showToast(`Added images. Ready for PDF conversion!`, 'info');
  },

  renderImageThumbnails() {
    const container = document.getElementById('imgPdfPreviews');
    const grid = document.getElementById('imgThumbnailsGrid');
    const countBadge = document.getElementById('imgPdfCount');

    if (!container || !grid) return;

    if (this.selectedImagesForPdf.length === 0) {
      container.style.display = 'none';
      return;
    }

    container.style.display = 'block';
    countBadge.textContent = this.selectedImagesForPdf.length;
    grid.innerHTML = '';

    this.selectedImagesForPdf.forEach((img, idx) => {
      const card = document.createElement('div');
      card.className = 'thumb-card';
      card.innerHTML = `
        <img src="${img.src}" alt="${img.name}">
        <span class="thumb-page-badge">Page ${idx + 1}</span>
        <button class="remove-thumb" data-idx="${idx}" title="Remove page"><i class="fa-solid fa-xmark"></i></button>
      `;

      card.querySelector('.remove-thumb').addEventListener('click', (e) => {
        const removeIdx = parseInt(e.currentTarget.getAttribute('data-idx'));
        this.selectedImagesForPdf.splice(removeIdx, 1);
        this.renderImageThumbnails();
      });

      grid.appendChild(card);
    });
  },

  convertImagesToPdf() {
    if (this.selectedImagesForPdf.length === 0) {
      App.showToast('Please select at least 1 image first!', 'warning');
      return;
    }

    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      App.showToast('PDF library is loading, please try again.', 'warning');
      return;
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    let processedCount = 0;

    this.selectedImagesForPdf.forEach((imgData, index) => {
      const img = new Image();
      img.src = imgData.src;

      img.onload = () => {
        if (index > 0) pdf.addPage();

        // Calculate aspect fit within page
        const imgRatio = img.width / img.height;
        const pageRatio = pageWidth / pageHeight;

        let renderWidth = pageWidth - 20; // 10mm margins
        let renderHeight = renderWidth / imgRatio;

        if (renderHeight > (pageHeight - 20)) {
          renderHeight = pageHeight - 20;
          renderWidth = renderHeight * imgRatio;
        }

        const xPos = (pageWidth - renderWidth) / 2;
        const yPos = (pageHeight - renderHeight) / 2;

        pdf.addImage(img, 'JPEG', xPos, yPos, renderWidth, renderHeight);

        processedCount++;
        if (processedCount === this.selectedImagesForPdf.length) {
          pdf.save(`Study_Images_Compilation_${Date.now()}.pdf`);
          App.showToast('Images successfully compiled into PDF!', 'success');
          if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
        }
      };
    });
  },

  /**
   * 2. Text / Markdown to PDF Converter
   */
  setupTextToPdf() {
    const convertBtn = document.getElementById('convertTxtToPdfBtn');
    const fileInput = document.getElementById('loadTxtFileInput');
    const editor = document.getElementById('txtEditorArea');
    const titleInput = document.getElementById('txtDocTitle');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (editor) editor.value = evt.target.result;
            if (titleInput && !titleInput.value) {
              titleInput.value = file.name.replace(/\.[^/.]+$/, "");
            }
            App.showToast(`Loaded ${file.name}`, 'info');
          };
          reader.readAsText(file);
        }
      });
    }

    if (convertBtn) {
      convertBtn.addEventListener('click', () => {
        const text = editor ? editor.value.trim() : '';
        const docTitle = (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : 'Study Document';

        if (!text) {
          App.showToast('Please enter or paste some text/notes to convert!', 'warning');
          return;
        }

        // Render Markdown to HTML if marked is available
        let renderedHtml = '';
        if (window.marked) {
          renderedHtml = window.marked.parse(text);
        } else {
          renderedHtml = `<pre style="white-space: pre-wrap; font-family: monospace;">${text}</pre>`;
        }

        PdfExporter.exportCustomNote(docTitle, renderedHtml);
      });
    }
  },

  /**
   * 3. Image Cross Format Converter (PNG, JPG, WEBP)
   */
  setupImageCross() {
    const dropZone = document.getElementById('imgCrossDropZone');
    const input = document.getElementById('imgCrossInput');
    const controls = document.getElementById('imgCrossControls');
    const preview = document.getElementById('crossImgPreview');
    const meta = document.getElementById('crossImgMeta');
    const slider = document.getElementById('crossQualitySlider');
    const qualityVal = document.getElementById('qualityVal');
    const downloadBtn = document.getElementById('downloadCrossImgBtn');

    if (!input) return;

    if (dropZone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.add('drag-over');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropZone.classList.remove('drag-over');
        });
      });

      dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file) this.loadCrossImage(file);
      });

      dropZone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
          input.click();
        }
      });
    }

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.loadCrossImage(file);
    });

    if (slider && qualityVal) {
      slider.addEventListener('input', () => {
        qualityVal.textContent = `${slider.value}%`;
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        this.downloadCrossConvertedImage();
      });
    }
  },

  loadCrossImage(file) {
    const preview = document.getElementById('crossImgPreview');
    const meta = document.getElementById('crossImgMeta');
    const controls = document.getElementById('imgCrossControls');

    const reader = new FileReader();
    reader.onload = (e) => {
      this.currentCrossImage = {
        name: file.name,
        src: e.target.result,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type
      };

      if (preview) preview.src = e.target.result;
      if (meta) meta.textContent = `${file.type.toUpperCase()} • ${this.currentCrossImage.size}`;
      if (controls) controls.style.display = 'grid';

      App.showToast('Image loaded. Select desired format!', 'info');
    };
    reader.readAsDataURL(file);
  },

  downloadCrossConvertedImage() {
    if (!this.currentCrossImage) {
      App.showToast('No image selected!', 'warning');
      return;
    }

    const selectedFormat = document.querySelector('input[name="targetFormat"]:checked').value;
    const quality = parseInt(document.getElementById('crossQualitySlider').value) / 100;

    const img = new Image();
    img.src = this.currentCrossImage.src;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      // For JPEG background filling
      if (selectedFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const extMap = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/webp': 'webp'
      };
      const ext = extMap[selectedFormat] || 'png';
      const baseName = this.currentCrossImage.name.replace(/\.[^/.]+$/, "");

      canvas.toBlob((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${baseName}_converted.${ext}`;
        link.click();
        URL.revokeObjectURL(link.href);

        App.showToast(`Image converted & downloaded as .${ext}!`, 'success');
      }, selectedFormat, quality);
    };
  },

  /**
   * 4. CSV / Table Data to PDF & JSON
   */
  setupCsvConverter() {
    const fileInput = document.getElementById('csvFileInput');
    const sampleBtn = document.getElementById('loadSampleCsvBtn');
    const exportPdfBtn = document.getElementById('exportCsvToPdfBtn');
    const exportJsonBtn = document.getElementById('exportCsvToJsonBtn');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            this.parseAndRenderCsv(evt.target.result);
          };
          reader.readAsText(file);
        }
      });
    }

    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        this.parseAndRenderCsv(STUDY_DATABASE.sampleCsv);
        App.showToast('Loaded sample study timetable CSV!', 'info');
      });
    }

    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        this.exportCsvToPdf();
      });
    }

    if (exportJsonBtn) {
      exportJsonBtn.addEventListener('click', () => {
        this.exportCsvToJson();
      });
    }
  },

  parseAndRenderCsv(csvString) {
    const lines = csvString.trim().split(/\r?\n/);
    if (lines.length < 2) {
      App.showToast('CSV file is empty or missing headers', 'warning');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(line => line.split(',').map(c => c.trim()));

    this.currentCsvData = { headers, rows };

    // Render Preview Table
    const wrapper = document.getElementById('csvTableWrapper');
    const actionsBar = document.getElementById('csvActionsBar');

    let tableHtml = '<table class="preview-table"><thead><tr>';
    headers.forEach(h => {
      tableHtml += `<th>${h}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    rows.forEach(r => {
      tableHtml += '<tr>';
      r.forEach(cell => {
        tableHtml += `<td>${cell}</td>`;
      });
      tableHtml += '</tr>';
    });
    tableHtml += '</tbody></table>';

    if (wrapper) wrapper.innerHTML = tableHtml;
    if (actionsBar) actionsBar.style.display = 'flex';
  },

  exportCsvToPdf() {
    if (!this.currentCsvData) return;

    const wrapper = document.getElementById('csvTableWrapper');
    const printContainer = document.createElement('div');
    printContainer.style.padding = '30px';
    printContainer.style.fontFamily = "'Plus Jakarta Sans', Arial, sans-serif";
    printContainer.style.color = '#1e293b';

    printContainer.innerHTML = `
      <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px;">
        <h1 style="font-size: 22px; color: #0f172a; margin: 0; font-weight: 800;">Study Schedule & Data Table</h1>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Converted from CSV by EduPulse</div>
      </div>
      <div>
        ${wrapper.innerHTML}
      </div>
      <div style="margin-top: 24px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 11px; color: #94a3b8;">
        EduPulse Study Companion • Distraction-free Study Tools
      </div>
    `;

    // Apply clean print table borders
    const tbl = printContainer.querySelector('table');
    if (tbl) {
      tbl.style.width = '100%';
      tbl.style.borderCollapse = 'collapse';
      printContainer.querySelectorAll('th, td').forEach(cell => {
        cell.style.border = '1px solid #cbd5e1';
        cell.style.padding = '8px 10px';
        cell.style.fontSize = '12px';
      });
      printContainer.querySelectorAll('th').forEach(th => {
        th.style.background = '#f1f5f9';
        th.style.color = '#0f172a';
      });
    }

    const opt = {
      margin: 10,
      filename: `Study_Schedule_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(printContainer).save().then(() => {
        App.showToast('Schedule PDF exported successfully!', 'success');
      });
    } else {
      PdfExporter.printFallback(printContainer);
    }
  },

  exportCsvToJson() {
    if (!this.currentCsvData) return;

    const { headers, rows } = this.currentCsvData;
    const jsonResult = rows.map(row => {
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = row[i] || '';
      });
      return obj;
    });

    const jsonString = JSON.stringify(jsonResult, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Study_Data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(link.href);

    if (typeof App !== 'undefined' && App.showToast) {
      App.showToast('CSV converted and downloaded as JSON!', 'success');
    }
  }
};

if (typeof window !== 'undefined') {
  window.Converter = Converter;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Converter.init());
  } else {
    Converter.init();
  }
}
