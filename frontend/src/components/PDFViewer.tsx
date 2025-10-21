import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAppStore } from '@/services/store';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer: React.FC = () => {
  const { pdfUrl, currentPage, setCurrentPage, setTotalPages, nextPage, previousPage } =
    useAppStore();
  const [loading, setLoading] = useState(false);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      previousPage();
    }
  };

  if (!pdfUrl) {
    return (
      <div style={styles.container}>
        <div style={styles.placeholder}>
          <h2>Geen PDF geladen</h2>
          <p>Upload een PDF bestand om te beginnen</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={styles.container}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      onClick={nextPage}
    >
      {loading && <div style={styles.loading}>Laden...</div>}

      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadStart={() => setLoading(true)}
        loading={<div style={styles.loading}>PDF wordt geladen...</div>}
        error={<div style={styles.error}>Fout bij het laden van PDF</div>}
      >
        <Page
          pageNumber={currentPage}
          width={window.innerWidth}
          renderTextLayer={true}
          renderAnnotationLayer={true}
        />
      </Document>

      <div style={styles.pageIndicator}>
        Pagina {currentPage} van {useAppStore.getState().totalPages}
      </div>

      <div style={styles.instructions}>
        Klik overal of druk op → voor volgende pagina
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    position: 'relative',
    outline: 'none',
    cursor: 'pointer',
  },
  placeholder: {
    textAlign: 'center',
    color: '#888',
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#fff',
    fontSize: '18px',
  },
  error: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    color: '#ff6b6b',
    fontSize: '18px',
  },
  pageIndicator: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '16px',
  },
  instructions: {
    position: 'absolute',
    bottom: '20px',
    left: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#888',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

export default PDFViewer;
