
/**
 * Functions for handling tables and elements with fixed widths
 */

/**
 * Center tables
 * 
 * @param doc The document to apply centering to
 */
export const centerTables = (doc: Document): void => {
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    if (table instanceof HTMLTableElement) {
      table.setAttribute('align', 'center');
      table.style.setProperty('margin-left', 'auto', 'important');
      table.style.setProperty('margin-right', 'auto', 'important');
      table.style.setProperty('float', 'none', 'important');
      table.style.setProperty('max-width', '100%', 'important');
      
      // Make table layout automatically adjust
      table.style.setProperty('table-layout', 'auto', 'important');
      
      // Handle tables with fixed widths
      const width = table.getAttribute('width');
      if (width) {
        // Convert fixed widths to max-width to prevent overflow
        table.style.setProperty('width', 'auto', 'important');
        table.style.setProperty('max-width', '100%', 'important');
      }
    }
  });
};

/**
 * Adjust elements with fixed widths to fit container
 * 
 * @param doc The document to apply adjustments to
 */
export const adjustFixedWidthElements = (doc: Document): void => {
  // Find elements with explicit width attributes or inline width styles
  const fixedWidthElements = doc.querySelectorAll('[width], [style*="width"]');
  
  fixedWidthElements.forEach(el => {
    if (el instanceof HTMLElement) {
      // For non-table elements, always ensure they're responsive
      if (el.tagName !== 'TABLE') {
        el.style.setProperty('width', 'auto', 'important');
        el.style.setProperty('max-width', '100%', 'important');
      } else {
        // For tables, ensure they're centered
        el.style.setProperty('margin-left', 'auto', 'important');
        el.style.setProperty('margin-right', 'auto', 'important');
      }
      
      // Remove any min-width that might cause overflow
      el.style.setProperty('min-width', '0', 'important');
    }
  });
  
  // Fix common newsletter layout issues with specific element types
  const elementTypes = ['td', 'th', 'div', 'p', 'span', 'img'];
  
  elementTypes.forEach(type => {
    const elements = doc.querySelectorAll(type);
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        // Prevent overflow by setting max-width
        el.style.setProperty('max-width', '100%', 'important');
        // Make sure images scale properly
        if (type === 'img') {
          el.style.setProperty('height', 'auto', 'important');
          el.style.setProperty('display', 'inline-block', 'important');
          el.style.setProperty('margin', '0 auto', 'important');
        }
      }
    });
  });
};
