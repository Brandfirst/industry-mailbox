
/**
 * Main file that orchestrates all centering operations
 * by importing specialized functions from other modules
 */
import { applyBodyCentering } from './centering/body-styling';
import { centerNewsletterWrapper, centerContainerElements, centerTextElements } from './centering/content-centering';
import { centerTables, adjustFixedWidthElements } from './centering/table-handling';
import { fixAbsolutePositioning, ensureSnapshotVisibility } from './centering/layout-fixes';

/**
 * Apply centering to elements in the document that might cause layout issues
 * This version preserves original layout while fixing centering issues
 * 
 * @param doc The document to apply centering to
 * @param isSnapshot Whether this is a snapshot/thumbnail view
 */
export const forceCentering = (doc: Document, isSnapshot: boolean = false): void => {
  try {
    applyBodyCentering(doc, isSnapshot);
    centerNewsletterWrapper(doc, isSnapshot);
    centerContainerElements(doc);
    centerTables(doc);
    centerTextElements(doc);
    fixAbsolutePositioning(doc);
    adjustFixedWidthElements(doc);
    
    // For snapshots, make additional adjustments to ensure visibility
    if (isSnapshot) {
      ensureSnapshotVisibility(doc);
    }
  } catch (error) {
    console.error("Error applying centering:", error);
  }
};
