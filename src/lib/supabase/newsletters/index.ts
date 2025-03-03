
// Re-export everything except the duplicate getNewslettersFromEmailAccount
export * from './fetch';
export * from './manage';
export * from './save';
export * from './types';
export * from './search';
// Remove this duplicate export since it contains getNewslettersFromEmailAccount already exported in fetch.ts
// export * from './account';
export * from './analytics';
export * from './frequency-analytics';

// For backward compatibility, we'll keep these specific exports
export { updateSenderCategory, updateSenderBrand } from './manage';
export {
  saveNewsletter,
  unsaveNewsletter,
  isNewsletterSaved,
  deleteNewsletters
} from './save';

// Instead of importing all from account.ts, let's just re-export other functions from it if needed
// This line would be added if there are other functions in account.ts that we want to export
// export { otherFunction1, otherFunction2 } from './account';
