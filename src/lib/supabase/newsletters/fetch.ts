
/**
 * This file re-exports all newsletter fetching functionality
 * from the specialized files to maintain backward compatibility.
 */

export { getNewsletterById } from './fetchSingle';
export { getNewslettersFromEmailAccount } from './fetchFromAccount';
export { getAllNewsletters } from './fetchAll';
