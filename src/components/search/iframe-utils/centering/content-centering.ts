
/**
 * Functions for centering various content elements
 */

/**
 * Center the main newsletter wrapper
 * 
 * @param doc The document to apply centering to
 * @param isSnapshot Whether this is a snapshot/thumbnail view
 */
export const centerNewsletterWrapper = (doc: Document, isSnapshot: boolean = false): void => {
  const newsletterWrapper = doc.querySelector('.newsletter-wrapper');
  if (newsletterWrapper instanceof HTMLElement) {
    newsletterWrapper.style.setProperty('margin', '0 auto', 'important');
    newsletterWrapper.style.setProperty('width', '100%', 'important');
    newsletterWrapper.style.setProperty('max-width', '100%', 'important');
    newsletterWrapper.style.setProperty('overflow-x', 'hidden', 'important');
    newsletterWrapper.style.setProperty('text-align', 'center', 'important');
    newsletterWrapper.style.setProperty('background-color', 'white', 'important');
    
    // For snapshots, we want to show as much as possible of the email
    if (isSnapshot) {
      newsletterWrapper.style.setProperty('overflow-y', 'visible', 'important');
      // Don't limit the height - let it flow naturally
      newsletterWrapper.style.setProperty('max-height', 'none', 'important');
    }
  }
};

/**
 * Center container elements
 * 
 * @param doc The document to apply centering to
 */
export const centerContainerElements = (doc: Document): void => {
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
 * Center text elements
 * 
 * @param doc The document to apply centering to
 */
export const centerTextElements = (doc: Document): void => {
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
