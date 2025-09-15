import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  // Counter actions
  increment,
  decrement,
  reset,
  
  // Todo actions
  addTodo,
  deleteTodo,
  toggleTodo,
  clearTodoError,
  fetchTodos,
  
  // User actions
  loginUser,
  logoutUser,
  clearUserError,
  updateProfile,
  
  // UI actions
  setTheme,
  toggleTheme,
  openModal,
  closeModal,
  addNotification,
  removeNotification,
  setLoading,
  toggleSidebar,
  setActiveTab,
  updatePreferences,
  setUIError,
  clearUIError,
  initializeUI,
  
  // Posts actions
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  setSearchFilter,
  setCategoryFilter,
  clearPostsFilters,
  toggleFavorite,
  saveDraft,
  deleteDraft,
} from '../features';

// ============================================================================
// COUNTER HOOKS
// ============================================================================
export const useCounter = () => {
  const dispatch = useDispatch();
  const value = useSelector(state => state.counter.value);
  
  const handleIncrement = useCallback(() => dispatch(increment()), [dispatch]);
  const handleDecrement = useCallback(() => dispatch(decrement()), [dispatch]);
  const handleReset = useCallback(() => dispatch(reset()), [dispatch]);
  
  return {
    value,
    increment: handleIncrement,
    decrement: handleDecrement,
    reset: handleReset,
  };
};

// ============================================================================
// TODO HOOKS
// ============================================================================
export const useTodos = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos.list);
  const status = useSelector(state => state.todos.status);
  const error = useSelector(state => state.todos.error);
  
  const handleAddTodo = useCallback((title) => dispatch(addTodo(title)), [dispatch]);
  const handleDeleteTodo = useCallback((id) => dispatch(deleteTodo(id)), [dispatch]);
  const handleToggleTodo = useCallback((id) => dispatch(toggleTodo(id)), [dispatch]);
  const handleFetchTodos = useCallback(() => dispatch(fetchTodos()), [dispatch]);
  const handleClearError = useCallback(() => dispatch(clearTodoError()), [dispatch]);
  
  return {
    todos,
    status,
    error,
    addTodo: handleAddTodo,
    deleteTodo: handleDeleteTodo,
    toggleTodo: handleToggleTodo,
    fetchTodos: handleFetchTodos,
    clearError: handleClearError,
  };
};

// ============================================================================
// USER HOOKS
// ============================================================================
export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.userData);
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const token = useSelector(state => state.user.token);
  const isLoading = useSelector(state => state.user.isLoading);
  const error = useSelector(state => state.user.error);
  const loginAttempts = useSelector(state => state.user.loginAttempts);
  
  const handleLogin = useCallback((credentials) => dispatch(loginUser(credentials)), [dispatch]);
  const handleLogout = useCallback(() => dispatch(logoutUser()), [dispatch]);
  const handleClearError = useCallback(() => dispatch(clearUserError()), [dispatch]);
  const handleUpdateProfile = useCallback((updates) => dispatch(updateProfile(updates)), [dispatch]);
  
  return {
    user,
    isAuthenticated,
    token,
    isLoading,
    error,
    loginAttempts,
    login: handleLogin,
    logout: handleLogout,
    clearError: handleClearError,
    updateProfile: handleUpdateProfile,
  };
};

// ============================================================================
// UI HOOKS
// ============================================================================
export const useUI = () => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.ui.theme);
  const modals = useSelector(state => state.ui.modals);
  const notifications = useSelector(state => state.ui.notifications);
  const loading = useSelector(state => state.ui.loading);
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen);
  const activeTab = useSelector(state => state.ui.activeTab);
  const preferences = useSelector(state => state.ui.preferences);
  const errors = useSelector(state => state.ui.errors);
  
  const handleSetTheme = useCallback((theme) => dispatch(setTheme(theme)), [dispatch]);
  const handleToggleTheme = useCallback(() => dispatch(toggleTheme()), [dispatch]);
  const handleOpenModal = useCallback((modalName) => dispatch(openModal(modalName)), [dispatch]);
  const handleCloseModal = useCallback((modalName) => dispatch(closeModal(modalName)), [dispatch]);
  const handleAddNotification = useCallback((notification) => dispatch(addNotification(notification)), [dispatch]);
  const handleRemoveNotification = useCallback((id) => dispatch(removeNotification(id)), [dispatch]);
  const handleSetLoading = useCallback((key, value) => dispatch(setLoading({ key, value })), [dispatch]);
  const handleToggleSidebar = useCallback(() => dispatch(toggleSidebar()), [dispatch]);
  const handleSetActiveTab = useCallback((tab) => dispatch(setActiveTab(tab)), [dispatch]);
  const handleUpdatePreferences = useCallback((prefs) => dispatch(updatePreferences(prefs)), [dispatch]);
  const handleSetError = useCallback((error) => dispatch(setUIError(error)), [dispatch]);
  const handleClearError = useCallback((type) => dispatch(clearUIError(type)), [dispatch]);
  const handleInitializeUI = useCallback(() => dispatch(initializeUI()), [dispatch]);
  
  return {
    theme,
    modals,
    notifications,
    loading,
    sidebarOpen,
    activeTab,
    preferences,
    errors,
    setTheme: handleSetTheme,
    toggleTheme: handleToggleTheme,
    openModal: handleOpenModal,
    closeModal: handleCloseModal,
    addNotification: handleAddNotification,
    removeNotification: handleRemoveNotification,
    setLoading: handleSetLoading,
    toggleSidebar: handleToggleSidebar,
    setActiveTab: handleSetActiveTab,
    updatePreferences: handleUpdatePreferences,
    setError: handleSetError,
    clearError: handleClearError,
    initializeUI: handleInitializeUI,
  };
};

// ============================================================================
// POSTS HOOKS
// ============================================================================
export const usePosts = () => {
  const dispatch = useDispatch();
  const posts = useSelector(state => state.posts.posts);
  const currentPost = useSelector(state => state.posts.currentPost);
  const status = useSelector(state => state.posts.status);
  const error = useSelector(state => state.posts.error);
  const filters = useSelector(state => state.posts.filters);
  const pagination = useSelector(state => state.posts.pagination);
  const drafts = useSelector(state => state.posts.drafts);
  const favorites = useSelector(state => state.posts.favorites);
  
  const handleFetchPosts = useCallback(() => dispatch(fetchPosts()), [dispatch]);
  const handleFetchPostById = useCallback((id) => dispatch(fetchPostById(id)), [dispatch]);
  const handleCreatePost = useCallback((postData) => dispatch(createPost(postData)), [dispatch]);
  const handleUpdatePost = useCallback((postId, updates) => dispatch(updatePost({ postId, updates })), [dispatch]);
  const handleDeletePost = useCallback((id) => dispatch(deletePost(id)), [dispatch]);
  const handleSetSearchFilter = useCallback((search) => dispatch(setSearchFilter(search)), [dispatch]);
  const handleSetCategoryFilter = useCallback((category) => dispatch(setCategoryFilter(category)), [dispatch]);
  const handleClearFilters = useCallback(() => dispatch(clearPostsFilters()), [dispatch]);
  const handleToggleFavorite = useCallback((id) => dispatch(toggleFavorite(id)), [dispatch]);
  const handleSaveDraft = useCallback((draft) => dispatch(saveDraft(draft)), [dispatch]);
  const handleDeleteDraft = useCallback((id) => dispatch(deleteDraft(id)), [dispatch]);
  
  return {
    posts,
    currentPost,
    status,
    error,
    filters,
    pagination,
    drafts,
    favorites,
    fetchPosts: handleFetchPosts,
    fetchPostById: handleFetchPostById,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    setSearchFilter: handleSetSearchFilter,
    setCategoryFilter: handleSetCategoryFilter,
    clearFilters: handleClearFilters,
    toggleFavorite: handleToggleFavorite,
    saveDraft: handleSaveDraft,
    deleteDraft: handleDeleteDraft,
  };
};

// ============================================================================
// COMBINED HOOKS
// ============================================================================
export const useApp = () => {
  const counter = useCounter();
  const todos = useTodos();
  const user = useUser();
  const ui = useUI();
  const posts = usePosts();
  
  return {
    counter,
    todos,
    user,
    ui,
    posts,
  };
};

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================
export const useNotifications = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.ui.notifications);
  
  const showSuccess = useCallback((message, title = 'Success') => {
    dispatch(addNotification({
      type: 'success',
      title,
      message,
      duration: 3000,
    }));
  }, [dispatch]);
  
  const showError = useCallback((message, title = 'Error') => {
    dispatch(addNotification({
      type: 'error',
      title,
      message,
      duration: 5000,
    }));
  }, [dispatch]);
  
  const showWarning = useCallback((message, title = 'Warning') => {
    dispatch(addNotification({
      type: 'warning',
      title,
      message,
      duration: 4000,
    }));
  }, [dispatch]);
  
  const showInfo = useCallback((message, title = 'Info') => {
    dispatch(addNotification({
      type: 'info',
      title,
      message,
      duration: 3000,
    }));
  }, [dispatch]);
  
  const removeNotification = useCallback((id) => {
    dispatch(removeNotification(id));
  }, [dispatch]);
  
  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
  };
};

// ============================================================================
// MODAL HOOKS
// ============================================================================
export const useModal = (modalName) => {
  const dispatch = useDispatch();
  const isOpen = useSelector(state => state.ui.modals[modalName]);
  
  const open = useCallback(() => dispatch(openModal(modalName)), [dispatch, modalName]);
  const close = useCallback(() => dispatch(closeModal(modalName)), [dispatch, modalName]);
  const toggle = useCallback(() => isOpen ? close() : open(), [isOpen, open, close]);
  
  return {
    isOpen,
    open,
    close,
    toggle,
  };
};

// ============================================================================
// LOADING HOOKS
// ============================================================================
export const useLoading = (key) => {
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.ui.loading[key]);
  
  const setLoading = useCallback((value) => dispatch(setLoading({ key, value })), [dispatch, key]);
  
  return {
    isLoading,
    setLoading,
  };
};
