
// Re-export all functions from the split files
export { 
  getNewslettersFromEmailAccount 
} from './account';

export { 
  getFeaturedNewsletters,
  searchNewsletters 
} from './search';

export { 
  getSenderStats
} from './analytics';

export {
  getSenderFrequencyData,
  getTopSendersFrequency
} from './frequency-analytics';
