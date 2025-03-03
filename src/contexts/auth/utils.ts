
import { RefObject } from "react";

// Safe function to remove items from localStorage
export const safeRemoveFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(`Could not remove '${key}' from localStorage:`, e);
  }
};

// Clean potentially corrupted localStorage items
export const cleanLocalStorage = (): void => {
  try {
    // First try to clear known problematic items
    safeRemoveFromLocalStorage('professional');
    
    // Try to fix corrupted "professional" item
    try {
      const professionalItem = localStorage.getItem('professional');
      if (professionalItem) {
        try {
          // Try to parse it to verify it's valid JSON
          JSON.parse(professionalItem);
        } catch (parseError) {
          // If parsing fails, it's corrupted. Try to reset it
          localStorage.setItem('professional', 'null');
          localStorage.removeItem('professional');
          console.log("Fixed corrupted 'professional' item");
        }
      }
    } catch (e) {
      console.warn("Error checking/fixing 'professional' item:", e);
    }
    
    // Clean any Supabase-related items
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('supabase.') || key === 'professional')) {
          keysToRemove.push(key);
        }
      }
      
      // Remove the collected keys
      keysToRemove.forEach(key => {
        try {
          // Try to parse the item to check if it's valid JSON (if expected to be)
          const item = localStorage.getItem(key);
          if (item && (key.includes('token') || key === 'professional')) {
            try {
              JSON.parse(item);
            } catch (e) {
              // Item is corrupted, remove it
              console.log(`Removing corrupted localStorage item: ${key}`);
              safeRemoveFromLocalStorage(key);
            }
          }
        } catch (checkError) {
          // Error checking the item, so we'll try to remove it
          safeRemoveFromLocalStorage(key);
        }
      });
      
      console.log("Local storage cleared successfully");
    } catch (e) {
      console.error("Error clearing localStorage:", e);
    }
  } catch (e) {
    console.error("Exception during localStorage cleanup:", e);
  }
};

// Helper to check if localStorage items are corrupted
export const checkLocalStorageCorruption = (): void => {
  try {
    // Check 'professional' item for corruption
    try {
      const professionalItem = localStorage.getItem('professional');
      if (professionalItem !== null) {
        try {
          JSON.parse(professionalItem);
        } catch (e) {
          console.warn("Found corrupted 'professional' item in localStorage, removing it");
          // Try to fix it by setting to null first, then removing
          try {
            localStorage.setItem('professional', 'null');
          } catch (setError) {
            console.warn("Could not reset 'professional' item:", setError);
          }
          safeRemoveFromLocalStorage('professional');
        }
      }
    } catch (e) {
      console.error("Error checking 'professional' localStorage item:", e);
    }
    
    // Check other key localStorage items for corruption
    try {
      const keysToCheck = ['supabase.auth.token'];
      for (const key of keysToCheck) {
        const item = localStorage.getItem(key);
        if (item !== null) {
          try {
            JSON.parse(item);
          } catch (e) {
            console.warn(`Found corrupted '${key}' item in localStorage, removing it`);
            try {
              // For token items, try to set to valid JSON first
              localStorage.setItem(key, '{"currentSession":null,"expiresAt":0}');
            } catch (setError) {
              console.warn(`Could not reset '${key}' item:`, setError);
            }
            safeRemoveFromLocalStorage(key);
          }
        }
      }
    } catch (e) {
      console.error("Error checking localStorage items:", e);
    }
  } catch (e) {
    console.error("Error accessing localStorage:", e);
  }
};
