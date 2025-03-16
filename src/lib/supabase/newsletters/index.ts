
// Export all newsletter-related functionality
export * from './types';
export * from './analytics';
export * from './frequency-analytics';
export * from './manage';
export * from './search';
export * from './save';

// Re-export these with explicit names to avoid ambiguity
export { 
  fetchNewsletter, 
  fetchNewsletters, 
  fetchNewslettersByCategory 
} from './fetch';

export { 
  fetchAllNewsletters, 
  fetchAllNewslettersBySender 
} from './fetchAll';

export { 
  getNewsletterFromEmailAccount,
  getNewslettersFromEmailAccount 
} from './fetchFromAccount';

export { 
  fetchSingleNewsletter 
} from './fetchSingle';

export {
  updateSenderCategory,
  updateSenderBrand
} from './account';
