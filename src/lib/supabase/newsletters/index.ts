
export * from './fetch';
export * from './manage';
export * from './save';
export * from './types';

// Export specific functions from fetch
export { getSenderStats, getSenderFrequencyData } from './fetch';

// Export specific functions from manage
export { updateSenderCategory, updateSenderBrand } from './manage';

// Export specific functions for saved newsletters
export {
  saveNewsletter,
  unsaveNewsletter,
  isNewsletterSaved,
  deleteNewsletters
} from './save';
