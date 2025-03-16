import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Create middleware for saving specific parts of the Redux state to localStorage
export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {
  // First, dispatch the action to update the state
  const result = next(action);

  // Only save to localStorage if running in browser
  if (typeof window === 'undefined') {
    return result;
  }

  // Check if the action is from the layout slice
  if (typeof action === 'object' && action !== null && 'type' in action) {
    const actionType = action.type as string;
    if (actionType.startsWith('layout/')) {
      const state = store.getState() as RootState;
      localStorage.setItem('layoutState', JSON.stringify(state.layout));
    }
  }

  // You can add more slices to persist here as needed

  return result;
};

// Function to load state from localStorage
export const loadState = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    // For layout state
    const layoutState = localStorage.getItem('layoutState');
    
    // You can load more persisted states here
    
    // Return preloaded state
    return {
      layout: layoutState ? JSON.parse(layoutState) : undefined,
      // Add other persisted slices here
    };
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
}; 