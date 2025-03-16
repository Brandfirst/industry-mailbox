
/**
 * Functions for fixing layout issues and ensuring snapshot visibility
 */

/**
 * Fix absolutely positioned elements
 * 
 * @param doc The document to apply centering to
 */
export const fixAbsolutePositioning = (doc: Document): void => {
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
 * Make special adjustments for snapshot mode to ensure content is visible
 * 
 * @param doc The document to apply adjustments to
 */
export const ensureSnapshotVisibility = (doc: Document): void => {
  // Make sure no container is limiting the height too much
  const containers = doc.querySelectorAll('div, section, article, main');
  containers.forEach(el => {
    if (el instanceof HTMLElement) {
      // Override any max-height that might cut off content
      el.style.setProperty('max-height', 'none', 'important');
      
      // Ensure all headers and important content is visible
      if (el.tagName === 'HEADER' || 
          el.className.includes('header') || 
          el.id.includes('header') ||
          el.querySelector('h1, h2, h3')) {
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
      }
    }
  });
  
  // Make sure images are handled properly
  const images = doc.querySelectorAll('img');
  images.forEach(img => {
    img.style.setProperty('max-width', '100%', 'important');
    img.style.setProperty('height', 'auto', 'important');
    img.style.setProperty('display', 'block', 'important');
    img.style.setProperty('margin', '0 auto', 'important');
  });
  
  // Center all tables
  const tables = doc.querySelectorAll('table');
  tables.forEach(table => {
    if (table instanceof HTMLTableElement) {
      table.style.setProperty('margin', '0 auto', 'important');
      table.style.setProperty('float', 'none', 'important');
    }
  });
  
  // Fix any overflow issues
  doc.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
  doc.body.style.setProperty('overflow-x', 'hidden', 'important');
};
