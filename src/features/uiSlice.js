import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    // Theme management
    theme: 'light', // 'light' or 'dark'
    
    // Modal management
    modals: {
      loginModal: false,
      profileModal: false,
      confirmModal: false,
      settingsModal: false,
    },
    
    // Notification system
    notifications: [],
    
    // Loading states
    loading: {
      global: false,
      counter: false,
      todos: false,
      user: false,
      posts: false,
    },
    
    // Sidebar and navigation
    sidebarOpen: false,
    activeTab: 'dashboard',
    
    // UI preferences
    preferences: {
      animations: true,
      soundEnabled: true,
      compactMode: false,
      autoSave: true,
    },
    
    // Error states
    errors: {
      global: null,
      network: null,
      validation: null,
    },
    
    // Success messages
    successMessages: [],
  },
  reducers: {
    // Theme actions
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Persist theme to localStorage
      localStorage.setItem('theme', action.payload);
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
    },
    
    // Modal actions
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(modal => {
        state.modals[modal] = false;
      });
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: action.payload.type || 'info', // 'success', 'error', 'warning', 'info'
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: new Date().toISOString(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading actions
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      if (state.loading.hasOwnProperty(key)) {
        state.loading[key] = value;
      }
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Tab navigation
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    
    // Preferences actions
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      // Persist preferences to localStorage
      localStorage.setItem('uiPreferences', JSON.stringify(state.preferences));
    },
    resetPreferences: (state) => {
      state.preferences = {
        animations: true,
        soundEnabled: true,
        compactMode: false,
        autoSave: true,
      };
      localStorage.removeItem('uiPreferences');
    },
    
    // Error actions
    setError: (state, action) => {
      const { type, message } = action.payload;
      state.errors[type] = message;
    },
    clearError: (state, action) => {
      const errorType = action.payload || 'global';
      state.errors[errorType] = null;
    },
    clearAllErrors: (state) => {
      state.errors = {
        global: null,
        network: null,
        validation: null,
      };
    },
    
    // Success message actions
    addSuccessMessage: (state, action) => {
      const message = {
        id: Date.now() + Math.random(),
        message: action.payload,
        timestamp: new Date().toISOString(),
      };
      state.successMessages.push(message);
    },
    removeSuccessMessage: (state, action) => {
      state.successMessages = state.successMessages.filter(
        msg => msg.id !== action.payload
      );
    },
    clearSuccessMessages: (state) => {
      state.successMessages = [];
    },
    
    // Initialize UI from localStorage
    initializeUI: (state) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        state.theme = savedTheme;
      }
      
      const savedPreferences = localStorage.getItem('uiPreferences');
      if (savedPreferences) {
        try {
          state.preferences = { ...state.preferences, ...JSON.parse(savedPreferences) };
        } catch (error) {
          console.error('Failed to parse saved UI preferences:', error);
        }
      }
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setLoading,
  setGlobalLoading,
  toggleSidebar,
  setSidebarOpen,
  setActiveTab,
  updatePreferences,
  resetPreferences,
  setError,
  clearError,
  clearAllErrors,
  addSuccessMessage,
  removeSuccessMessage,
  clearSuccessMessages,
  initializeUI,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectModals = (state) => state.ui.modals;
export const selectModal = (modalName) => (state) => state.ui.modals[modalName];
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoading = (state) => state.ui.loading;
export const selectIsLoading = (key) => (state) => state.ui.loading[key];
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectActiveTab = (state) => state.ui.activeTab;
export const selectPreferences = (state) => state.ui.preferences;
export const selectErrors = (state) => state.ui.errors;
export const selectError = (type) => (state) => state.ui.errors[type];
export const selectSuccessMessages = (state) => state.ui.successMessages;

export default uiSlice.reducer;
