
// Export all newsletter-related functionality
export * from './types';
export * from './analytics';
export * from './frequency-analytics';
export * from './manage';
export * from './search';
export * from './save';

// These files need direct imports and re-exports
import { getNewslettersByCategory } from './fetch';
import { getAllNewsletters, getAllNewslettersBySender } from './fetchAll';
import { getNewslettersFromEmailAccount } from './fetchFromAccount';
import { getNewsletter } from './fetchSingle';
import { updateSenderCategory, updateSenderBrand } from './manage';

// Re-export with explicit names
export { 
  getNewslettersByCategory
};

export { 
  getAllNewsletters,
  getAllNewslettersBySender
};

export { 
  getNewslettersFromEmailAccount
};

export {
  getNewsletter
};

export {
  updateSenderCategory,
  updateSenderBrand
};
