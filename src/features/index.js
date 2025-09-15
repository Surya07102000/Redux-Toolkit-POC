// Slices
export { default as counterReducer } from './counterSlice';
export { default as todoReducer } from './todoSlice';
export { default as userReducer } from './userSlice';
export { default as uiReducer } from './uiSlice';
export { default as postsReducer } from './postsSlice';

// Counter actions and selectors
export {
  increment,
  decrement,
  reset,
} from './counterSlice';

// Todo actions and selectors
export {
  fetchTodos,
  addTodo,
  deleteTodo,
  toggleTodo,
  clearError as clearTodoError,
} from './todoSlice';

// User actions and selectors
export {
  loginUser,
  logoutUser,
  fetchUserProfile,
  clearError as clearUserError,
  updateProfile,
  resetLoginAttempts,
  expireToken,
  selectUser,
  selectIsAuthenticated,
  selectUserToken,
  selectUserLoading,
  selectUserError,
  selectLoginAttempts,
  selectLastLoginTime,
} from './userSlice';

// UI actions and selectors
export {
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
  setError as setUIError,
  clearError as clearUIError,
  clearAllErrors,
  addSuccessMessage,
  removeSuccessMessage,
  clearSuccessMessages,
  initializeUI,
  selectTheme,
  selectModals,
  selectModal,
  selectNotifications,
  selectLoading,
  selectIsLoading,
  selectSidebarOpen,
  selectActiveTab,
  selectPreferences,
  selectErrors,
  selectError,
  selectSuccessMessages,
} from './uiSlice';

// Posts actions and selectors
export {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  setSearchFilter,
  setCategoryFilter,
  setSortBy,
  setSortOrder,
  clearFilters as clearPostsFilters,
  setCurrentPage,
  setItemsPerPage,
  clearCurrentPost,
  clearError as clearPostsError,
  saveDraft,
  deleteDraft,
  clearDrafts,
  toggleFavorite,
  clearFavorites,
  clearCache,
  selectPosts,
  selectCurrentPost,
  selectPostsStatus,
  selectPostsError,
  selectPostsFilters,
  selectPostsPagination,
  selectDrafts,
  selectFavorites,
  selectPostCache,
  selectFilteredPosts,
  selectPaginatedPosts,
  selectIsPostFavorite,
} from './postsSlice';

// API slice
export { apiSlice } from './apiSlice';
export {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  useSearchPostsQuery,
  useBatchGetPostsQuery,
} from './apiSlice';

// Selectors
export * from './selectors';

// Hooks
export * from '../hooks/useRedux';
