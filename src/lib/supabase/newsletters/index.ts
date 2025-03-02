export * from './fetch';
export * from './manage';
export * from './save';
export * from './types';
export * from './search';
export * from './account';
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
