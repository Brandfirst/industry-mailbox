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
    scaleContentToFit(doc);
  } catch (error) {
    console.error("Error applying centering:", error);
  }
};

/**
 * Scale content to fit within the viewport
 * 
 * @param doc The document to apply scaling to
 */
const scaleContentToFit = (doc: Document): void => {
  if (doc.body) {
    // Find the first significant container element
    const containerElements = doc.querySelectorAll('table, div[width], [class*="container"], [class*="wrapper"]');
    
    if (containerElements.length > 0) {
      // Get the widest element to determine scaling
      let maxWidth = 0;
      let widestElement: Element | null = null;
      
      containerElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > maxWidth) {
          maxWidth = rect.width;
          widestElement = el;
        }
      });
      
      if (widestElement && maxWidth > window.innerWidth) {
        // Calculate scale factor to fit the content
        const scaleFactor = (window.innerWidth / maxWidth) * 0.95; // 95% of available space
        
        // Apply scale transform to the body
        doc.body.style.setProperty('transform', `scale(${scaleFactor})`, 'important');
        doc.body.style.setProperty('transform-origin', 'center top', 'important');
        doc.body.style.setProperty('width', '100%', 'important');
        doc.body.style.setProperty('height', 'auto', 'important');
      }
    }
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
    doc.body.style.setProperty('overflow', 'hidden', 'important');
    doc.body.style.setProperty('display', 'flex', 'important');
    doc.body.style.setProperty('flex-direction', 'column', 'important');
    doc.body.style.setProperty('align-items', 'center', 'important');
    doc.body.style.setProperty('justify-content', 'flex-start', 'important');
    doc.body.style.setProperty('transform-origin', 'center top', 'important');
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
    newsletterWrapper.style.setProperty('width', 'auto', 'important');
    newsletterWrapper.style.setProperty('max-width', '100%', 'important');
    newsletterWrapper.style.setProperty('overflow', 'hidden', 'important');
    newsletterWrapper.style.setProperty('display', 'block', 'important');
    newsletterWrapper.style.setProperty('text-align', 'center', 'important');
    newsletterWrapper.style.setProperty('transform', 'scale(0.95)', 'important');
    newsletterWrapper.style.setProperty('transform-origin', 'center top', 'important');
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
      element.style.setProperty('width', 'auto', 'important');
      element.style.setProperty('max-width', '100%', 'important');
      element.style.setProperty('transform', 'translateX(-50%)', 'important');
      element.style.setProperty('left', '50%', 'important');
      element.style.setProperty('position', 'relative', 'important');
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
      table.style.setProperty('width', 'auto', 'important');
      table.style.setProperty('transform', 'translateX(-50%)', 'important');
      table.style.setProperty('left', '50%', 'important');
      table.style.setProperty('position', 'relative', 'important');
      
      // Handle tables with fixed widths
      const width = table.getAttribute('width');
      if (width) {
        const numWidth = parseInt(width, 10);
        if (!isNaN(numWidth) && numWidth > 0) {
          // Set a max-width instead of a fixed width to prevent overflow
          table.style.setProperty('max-width', `${numWidth}px`, 'important');
          table.style.setProperty('width', 'auto', 'important');
        }
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
