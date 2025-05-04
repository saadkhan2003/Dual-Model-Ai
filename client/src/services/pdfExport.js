import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked for safe HTML
marked.setOptions({
  headerIds: false,
  mangle: false
});

// Helper to convert markdown to clean text
const markdownToText = (markdown) => {
  const html = marked(markdown);
  const text = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
  return text.replace(/\n\s*\n/g, '\n').trim();
};

// Helper to create code block styling
const createCodeBlockStyle = (doc) => ({
  fillColor: [40, 44, 52],
  textColor: [171, 178, 191],
  fontSize: 9,
  font: 'Courier',
  cellPadding: 8
});

const createMessageStyle = (doc, isUser) => ({
  fillColor: isUser ? [239, 241, 243] : [255, 255, 255],
  textColor: [0, 0, 0],
  fontSize: 10,
  font: 'Helvetica',
  cellPadding: 10
});

// Main export function
export const exportToPDF = async (messages, metadata = {}) => {
  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set document metadata
  doc.setProperties({
    title: 'Chat Export',
    subject: 'AI Chat Conversation Export',
    author: 'Dual-AI Chat',
    keywords: 'chat, ai, export',
    creator: 'Dual-AI Chat'
  });

  // Add header
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Dual-AI Chat Export', 20, 20);

  // Add metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const date = new Date().toLocaleString();
  doc.text(`Generated: ${date}`, 20, 30);

  // Start content position
  let yPos = 40;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);

  // Process each message
  for (const message of messages) {
    const isUser = message.role === 'user';
    const messageStyle = createMessageStyle(doc, isUser);

    // Split content into regular text and code blocks
    const parts = message.content.split('```');
    
    parts.forEach((part, index) => {
      const isCode = index % 2 === 1;
      
      if (isCode) {
        // Handle code block
        const codeStyle = createCodeBlockStyle(doc);
        
        // Extract language if specified
        const firstLineBreak = part.indexOf('\n');
        const language = firstLineBreak > 0 ? part.substring(0, firstLineBreak) : '';
        const code = firstLineBreak > 0 ? part.substring(firstLineBreak + 1) : part;
        
        // Add language label if present
        if (language) {
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text(language, margin, yPos);
          yPos += 5;
        }
        
        // Add code block
        doc.autoTable({
          startY: yPos,
          margin: { left: margin, right: margin },
          tableWidth: contentWidth,
          styles: codeStyle,
          body: [[code]],
          theme: 'plain'
        });
        
        yPos = doc.lastAutoTable.finalY + 5;
      } else {
        // Handle regular text
        if (part.trim()) {
          const text = markdownToText(part);
          doc.autoTable({
            startY: yPos,
            margin: { left: margin, right: margin },
            tableWidth: contentWidth,
            styles: messageStyle,
            body: [[text]],
            theme: 'plain'
          });
          yPos = doc.lastAutoTable.finalY + 5;
        }
      }
      
      // Check if we need a new page
      if (yPos > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPos = 20;
      }
    });
  }

  // Add footer with page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `chat-export-${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
};