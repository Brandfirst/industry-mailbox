
/**
 * Font handling utilities for newsletter content
 * Ensures proper display of special characters and fallback fonts
 */

/**
 * Adds system font fallbacks to ensure text is still displayed properly
 * even when external fonts can't be loaded
 */
export const getSystemFontCSS = (): string => {
  return `
    /* System font fallbacks with UTF-8 character support */
    * {
      font-family: inherit;
    }
    
    body {
      margin: 0;
      padding: 10px;
    }
    
    /* Enhanced Nordic character support - keep original font */
    @font-face {
      font-family: 'SystemNordic';
      src: local('Arial Unicode MS'), local('Arial'), local('Helvetica');
      unicode-range: U+00C5, U+00C6, U+00D8, U+00E5, U+00E6, U+00F8; /* ÅÆØåæø */
    }
    
    /* Instead of forcing a specific font, we only apply fallbacks */
    .preserve-nordic, [data-has-nordic-chars] * {
      font-family: inherit, 'SystemNordic', Arial Unicode MS, Arial, sans-serif;
    }
    
    /* Make sure UTF-8 Nordic characters display properly without changing font */
    [data-has-nordic-chars] {
      font-family: inherit, 'SystemNordic', Arial Unicode MS, Arial, sans-serif;
    }
  `;
};
