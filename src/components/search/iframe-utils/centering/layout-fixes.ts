
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
      // Only change position if element is out of viewport
      const rect = el.getBoundingClientRect();
      if (rect.left < 0 || rect.right > window.innerWidth) {
        el.style.setProperty('position', 'relative', 'important');
        el.style.setProperty('left', 'auto', 'important');
        el.style.setProperty('right', 'auto', 'important');
      }
    }
  });
};

/**
 * Make special adjustments for snapshot mode to ensure content is visible
 * 
 * @param doc The document to apply adjustments to
 */
export const ensureSnapshotVisibility = (doc: Document): void => {
  // Find the main content area
  const mainContent = doc.querySelector('.newsletter-wrapper');
  if (mainContent instanceof HTMLElement) {
    mainContent.style.setProperty('display', 'block', 'important');
    mainContent.style.setProperty('width', '100%', 'important');
    mainContent.style.setProperty('max-width', '100%', 'important');
    mainContent.style.setProperty('overflow-x', 'hidden', 'important');
  }
  
  // Make sure no container is limiting the height too much
  const containers = doc.querySelectorAll('div, section, article, main');
  containers.forEach(el => {
    if (el instanceof HTMLElement) {
      // Override any max-height that might cut off content
      el.style.setProperty('max-height', 'none', 'important');
      
      // Preserve width constraints but ensure they're centered
      if (el.style.width && el.style.width !== '100%') {
        el.style.setProperty('margin-left', 'auto', 'important');
        el.style.setProperty('margin-right', 'auto', 'important');
      }
      
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
    img.style.setProperty('display', 'inline-block', 'important');
    img.style.setProperty('margin', '0 auto', 'important');
  });
  
  // Preserve text alignment in cells
  const cells = doc.querySelectorAll('td, th');
  cells.forEach(cell => {
    if (cell instanceof HTMLElement) {
      // Preserve alignment attributes
      const align = cell.getAttribute('align');
      if (align) {
        cell.style.setProperty('text-align', align, 'important');
      }
    }
  });
  
  // Fix any overflow issues
  doc.documentElement.style.setProperty('overflow-x', 'hidden', 'important');
  doc.body.style.setProperty('overflow-x', 'hidden', 'important');
  
  // Make sure the document scales properly
  doc.body.style.setProperty('transform-origin', 'top center', 'important');
};
