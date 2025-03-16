/**
 * Functions for styling the body and main container elements
 */

/**
 * Apply centering styles to the body element
 * 
 * @param doc The document to apply centering to
 * @param isSnapshot Whether this is a snapshot/thumbnail view
 */
export const applyBodyCentering = (doc: Document, isSnapshot: boolean = false): void => {
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
    
    // Remove any font-size overrides that might be too small
    const computedStyle = window.getComputedStyle(doc.body);
    const fontSize = parseInt(computedStyle.fontSize);
    if (fontSize < 12) {
      doc.body.style.setProperty('font-size', '14px', 'important');
    }
    
    // Snapshot adjustments
    if (isSnapshot) {
      // Keep body visible but prevent scrolling
      doc.body.style.setProperty('overflow-y', 'visible', 'important');
    }
  }
};
