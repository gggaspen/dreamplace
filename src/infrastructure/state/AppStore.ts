import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// App-wide client state interface
export interface AppState {
  // UI State
  isLoading: boolean;
  isMobileNavOpen: boolean;
  isDarkMode: boolean;

  // User preferences
  hasSeenWelcomeMessage: boolean;
  preferredLanguage: string;

  // Error state
  globalError: string | null;

  // Cache invalidation
  lastDataRefresh: number;
}

// Actions interface
export interface AppActions {
  // Loading actions
  setLoading: (loading: boolean) => void;

  // Navigation actions
  toggleMobileNav: () => void;
  closeMobileNav: () => void;

  // Theme actions
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;

  // User preference actions
  markWelcomeMessageSeen: () => void;
  setPreferredLanguage: (language: string) => void;

  // Error actions
  setGlobalError: (error: string | null) => void;
  clearGlobalError: () => void;

  // Cache actions
  refreshData: () => void;

  // Reset actions
  resetAppState: () => void;
}

export type AppStore = AppState & AppActions;

// Initial state
const initialState: AppState = {
  isLoading: false,
  isMobileNavOpen: false,
  isDarkMode: false,
  hasSeenWelcomeMessage: false,
  preferredLanguage: 'es',
  globalError: null,
  lastDataRefresh: Date.now(),
};

// Create the store
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Loading actions
        setLoading: (loading: boolean) =>
          set(state => {
            state.isLoading = loading;
          }),

        // Navigation actions
        toggleMobileNav: () =>
          set(state => {
            state.isMobileNavOpen = !state.isMobileNavOpen;
          }),

        closeMobileNav: () =>
          set(state => {
            state.isMobileNavOpen = false;
          }),

        // Theme actions
        toggleDarkMode: () =>
          set(state => {
            state.isDarkMode = !state.isDarkMode;
          }),

        setDarkMode: (isDark: boolean) =>
          set(state => {
            state.isDarkMode = isDark;
          }),

        // User preference actions
        markWelcomeMessageSeen: () =>
          set(state => {
            state.hasSeenWelcomeMessage = true;
          }),

        setPreferredLanguage: (language: string) =>
          set(state => {
            state.preferredLanguage = language;
          }),

        // Error actions
        setGlobalError: (error: string | null) =>
          set(state => {
            state.globalError = error;
          }),

        clearGlobalError: () =>
          set(state => {
            state.globalError = null;
          }),

        // Cache actions
        refreshData: () =>
          set(state => {
            state.lastDataRefresh = Date.now();
          }),

        // Reset actions
        resetAppState: () => set(() => initialState),
      })),
      {
        name: 'dreamplace-app-store',
        partialize: state => ({
          isDarkMode: state.isDarkMode,
          hasSeenWelcomeMessage: state.hasSeenWelcomeMessage,
          preferredLanguage: state.preferredLanguage,
        }),
      }
    ),
    {
      name: 'DreamPlace App Store',
    }
  )
);

// Selector hooks for common state slices
export const useLoadingState = () => useAppStore(state => state.isLoading);
export const useMobileNavState = () => useAppStore(state => state.isMobileNavOpen);
export const useDarkModeState = () => useAppStore(state => state.isDarkMode);
export const useGlobalError = () => useAppStore(state => state.globalError);
export const usePreferences = () =>
  useAppStore(state => ({
    language: state.preferredLanguage,
    hasSeenWelcome: state.hasSeenWelcomeMessage,
  }));
