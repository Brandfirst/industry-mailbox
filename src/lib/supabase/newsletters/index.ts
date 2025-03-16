
// Export all newsletter-related functionality
export * from './types';
export * from './analytics';
export * from './frequency-analytics';
export * from './manage';
export * from './search';
export * from './save';

// Import and re-export with explicit names
import { getNewslettersByCategory as getNewslettersByCategoryImport } from './fetch';
import { getAllNewsletters } from './fetchAll';
import { getNewslettersFromEmailAccount } from './fetchFromAccount';
import { getNewsletterById } from './fetchSingle';
import { updateSenderCategory, updateSenderBrand } from './manage';

// Re-export with explicit names
export { 
  getNewslettersByCategoryImport as getNewslettersByCategory
};

export { 
  getAllNewsletters
};

export { 
  getNewslettersFromEmailAccount
};

export {
  getNewsletterById as getNewsletter
};

export {
  updateSenderCategory,
  updateSenderBrand
};
