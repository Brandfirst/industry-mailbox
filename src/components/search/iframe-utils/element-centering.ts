
/**
 * Apply centering to elements in the document that might cause layout issues
 * This version preserves original layout while fixing centering issues
 * 
 * @param doc The document to apply centering to
 */
export const forceCentering = (doc: Document): void => {
  try {
    applyBodyCentering(doc);
    centerNewsletterWrapper(doc);
    centerContainerElements(doc);
    centerTables(doc);
    centerTextElements(doc);
    fixAbsolutePositioning(doc);
    adjustFixedWidthElements(doc);
  } catch (error) {
    console.error("Error applying centering:", error);
  }
};

/**
 * Apply centering styles to the body element
 * 
 * @param doc The document to apply centering to
 */
const applyBodyCentering = (doc: Document): void => {
  if (doc.body) {
    doc.body.style.setProperty('margin', '0 auto', 'important');
    doc.body.style.setProperty('text-align', 'center', 'important');
    doc.body.style.setProperty('padding', '0', 'important');
    doc.body.style.setProperty('width', '100%', 'important');
    doc.body.style.setProperty('max-width', '100%', 'important');
    doc.body.style.setProperty('box-sizing', 'border-box', 'important');
    doc.body.style.setProperty('overflow-x', 'hidden', 'important');
    doc.body.style.setProperty('display', 'flex', 'important');
    doc.body.style.setProperty('flex-direction', 'column', 'important');
    doc.body.style.setProperty('align-items', 'center', 'important');
    doc.body.style.setProperty('justify-content', 'flex-start', 'important');
  }
};

/**
 * Center the main newsletter wrapper
 * 
 * @param doc The document to apply centering to
 */
const centerNewsletterWrapper = (doc: Document): void => {
  const newsletterWrapper = doc.querySelector('.newsletter-wrapper');
  if (newsletterWrapper instanceof HTMLElement) {
    newsletterWrapper.style.setProperty('margin', '0 auto', 'important');
    newsletterWrapper.style.setProperty('width', '100%', 'important');
    newsletterWrapper.style.setProperty('max-width', '100%', 'important');
    newsletterWrapper.style.setProperty('overflow-x', 'hidden', 'important');
    newsletterWrapper.style.setProperty('display', 'block', 'important');
    newsletterWrapper.style.setProperty('text-align', 'center', 'important');
  }
};

/**
 * Center container elements
 * 
 * @param doc The document to apply centering to
 */
const centerContainerElements = (doc: Document): void => {
  const containerSelectors = [
    '.container', '.wrapper', '[class*="container"]', '[class*="wrapper"]', 
    '.email-body', '.email-content', '.main', '.content',
    '[class*="body"]', '[class*="main"]', '[class*="content"]', '[class*="inner"]',
    'div[width]', 'div[align="center"]'
  ];
  
  const containers = doc.querySelectorAll(containerSelectors.join(', '));
  containers.forEach(el => {
    const element = el as HTMLElement;
    if (element) {
      element.style.setProperty('margin-left', 'auto', 'important');
      element.style.setProperty('margin-right', 'auto', 'important');
      element.style.setProperty('float', 'none', 'important');
      element.style.setProperty('width', '100%', 'important');
      element.style.setProperty('max-width', '100%', 'important');
    }
  });
};

/**
 * Center tables
 * 
 * @param doc The document to apply centering to
 */
const centerTables = (doc: Document): void => {
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
 * Center text elements
 * 
 * @param doc The document to apply centering to
 */
const centerTextElements = (doc: Document): void => {
  const textElements = doc.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, span, section, article, header, footer, main');
  textElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.setProperty('margin-left', 'auto', 'important');
      el.style.setProperty('margin-right', 'auto', 'important');
      el.style.setProperty('max-width', '100%', 'important');
      
      // Ensure text doesn't overflow
      el.style.setProperty('word-wrap', 'break-word', 'important');
      el.style.setProperty('overflow-wrap', 'break-word', 'important');
    }
  });
};

/**
 * Fix absolutely positioned elements
 * 
 * @param doc The document to apply centering to
 */
const fixAbsolutePositioning = (doc: Document): void => {
  const absoluteElements = doc.querySelectorAll('[style*="position: absolute"], [style*="position:absolute"]');
  absoluteElements.forEach(el => {
    if (el instanceof HTMLElement) {
      el.style.setProperty('position', 'relative', 'important');
      el.style.setProperty('left', 'auto', 'important');
      el.style.setProperty('right', 'auto', 'important');
    }
  });
};

/**
 * Adjust elements with fixed widths to fit container
 * 
 * @param doc The document to apply adjustments to
 */
const adjustFixedWidthElements = (doc: Document): void => {
  // Find elements with explicit width attributes or inline width styles
  const fixedWidthElements = doc.querySelectorAll('[width], [style*="width"]');
  
  fixedWidthElements.forEach(el => {
    if (el instanceof HTMLElement) {
      // For non-table elements, always ensure they're responsive
      if (el.tagName !== 'TABLE') {
        el.style.setProperty('width', 'auto', 'important');
        el.style.setProperty('max-width', '100%', 'important');
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
        }
      }
    });
  });
};
