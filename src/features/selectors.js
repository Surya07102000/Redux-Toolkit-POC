import { createSelector } from '@reduxjs/toolkit';

// ============================================================================
// COUNTER SELECTORS
// ============================================================================
export const selectCounterValue = (state) => state.counter.value;

export const selectCounterIsEven = createSelector(
  [selectCounterValue],
  (value) => value % 2 === 0
);

export const selectCounterIsPositive = createSelector(
  [selectCounterValue],
  (value) => value > 0
);

// ============================================================================
// TODO SELECTORS
// ============================================================================
export const selectTodos = (state) => state.todos.list;
export const selectTodosStatus = (state) => state.todos.status;
export const selectTodosError = (state) => state.todos.error;

export const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.completed)
);

export const selectPendingTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => !todo.completed)
);

export const selectTodosCount = createSelector(
  [selectTodos],
  (todos) => todos.length
);

export const selectCompletedTodosCount = createSelector(
  [selectCompletedTodos],
  (completedTodos) => completedTodos.length
);

export const selectPendingTodosCount = createSelector(
  [selectPendingTodos],
  (pendingTodos) => pendingTodos.length
);

export const selectTodosCompletionPercentage = createSelector(
  [selectTodosCount, selectCompletedTodosCount],
  (total, completed) => total > 0 ? Math.round((completed / total) * 100) : 0
);

export const selectTodosByUserId = (userId) => createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.userId === userId)
);

// ============================================================================
// USER SELECTORS
// ============================================================================
export const selectUser = (state) => state.user.userData;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserToken = (state) => state.user.token;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectLoginAttempts = (state) => state.user.loginAttempts;
export const selectLastLoginTime = (state) => state.user.lastLoginTime;

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || 'guest'
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === 'admin'
);

export const selectUserDisplayName = createSelector(
  [selectUser],
  (user) => user?.name || user?.username || 'Guest'
);

export const selectUserInitials = createSelector(
  [selectUserDisplayName],
  (displayName) => {
    return displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
);

export const selectCanLogin = createSelector(
  [selectLoginAttempts],
  (attempts) => attempts < 3
);

// ============================================================================
// UI SELECTORS
// ============================================================================
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

export const selectIsDarkTheme = createSelector(
  [selectTheme],
  (theme) => theme === 'dark'
);

export const selectActiveNotifications = createSelector(
  [selectNotifications],
  (notifications) => notifications.filter(notification => 
    !notification.dismissed && 
    (Date.now() - new Date(notification.timestamp).getTime()) < (notification.duration || 5000)
  )
);

export const selectNotificationCount = createSelector(
  [selectActiveNotifications],
  (notifications) => notifications.length
);

export const selectHasErrors = createSelector(
  [selectErrors],
  (errors) => Object.values(errors).some(error => error !== null)
);

export const selectGlobalError = createSelector(
  [selectErrors],
  (errors) => errors.global
);

export const selectIsAnyModalOpen = createSelector(
  [selectModals],
  (modals) => Object.values(modals).some(isOpen => isOpen)
);

export const selectIsGlobalLoading = createSelector(
  [selectLoading],
  (loading) => loading.global
);

// ============================================================================
// POSTS SELECTORS
// ============================================================================
export const selectPosts = (state) => state.posts.posts;
export const selectCurrentPost = (state) => state.posts.currentPost;
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
export const selectPostsFilters = (state) => state.posts.filters;
export const selectPostsPagination = (state) => state.posts.pagination;
export const selectDrafts = (state) => state.posts.drafts;
export const selectFavorites = (state) => state.posts.favorites;
export const selectPostCache = (state) => state.posts.postCache;

export const selectFilteredPosts = createSelector(
  [selectPosts, selectPostsFilters],
  (posts, filters) => {
    let filtered = [...posts];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.body.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filter (if you have categories)
    if (filters.category !== 'all') {
      // This would filter by category if you have that field
      // filtered = filtered.filter(post => post.category === filters.category);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'author':
          aValue = a.userId;
          bValue = b.userId;
          break;
        case 'date':
        default:
          aValue = new Date(a.id); // Using id as proxy for date
          bValue = new Date(b.id);
          break;
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }
);

export const selectPaginatedPosts = createSelector(
  [selectFilteredPosts, selectPostsPagination],
  (filtered, pagination) => {
    const { currentPage, itemsPerPage } = pagination;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
  }
);

export const selectIsPostFavorite = (postId) => createSelector(
  [selectFavorites],
  (favorites) => favorites.includes(postId)
);

export const selectFavoritePosts = createSelector(
  [selectPosts, selectFavorites],
  (posts, favorites) => posts.filter(post => favorites.includes(post.id))
);

export const selectPostsByUser = (userId) => createSelector(
  [selectPosts],
  (posts) => posts.filter(post => post.userId === userId)
);

export const selectDraftCount = createSelector(
  [selectDrafts],
  (drafts) => drafts.length
);

export const selectHasDrafts = createSelector(
  [selectDraftCount],
  (count) => count > 0
);

// ============================================================================
// COMBINED SELECTORS
// ============================================================================

// App-wide loading state
export const selectIsAppLoading = createSelector(
  [selectIsGlobalLoading, selectUserLoading, selectTodosStatus, selectPostsStatus],
  (globalLoading, userLoading, todosStatus, postsStatus) => 
    globalLoading || userLoading || todosStatus === 'loading' || postsStatus === 'loading'
);

// App-wide error state
export const selectAppErrors = createSelector(
  [selectUserError, selectTodosError, selectPostsError, selectGlobalError],
  (userError, todosError, postsError, globalError) => ({
    user: userError,
    todos: todosError,
    posts: postsError,
    global: globalError,
    hasAny: !!(userError || todosError || postsError || globalError),
  })
);

// User permissions
export const selectUserPermissions = createSelector(
  [selectIsAdmin, selectIsAuthenticated],
  (isAdmin, isAuthenticated) => ({
    canCreatePosts: isAuthenticated,
    canEditPosts: isAuthenticated,
    canDeletePosts: isAdmin,
    canManageUsers: isAdmin,
    canViewAdminPanel: isAdmin,
  })
);

// Dashboard statistics
export const selectDashboardStats = createSelector(
  [selectTodosCount, selectCompletedTodosCount, selectPosts, selectDraftCount, selectFavoritePosts],
  (totalTodos, completedTodos, posts, draftCount, favoritePosts) => ({
    totalTodos,
    completedTodos,
    pendingTodos: totalTodos - completedTodos,
    totalPosts: posts.length,
    draftCount,
    favoritePostsCount: favoritePosts.length,
    completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
  })
);

// Search results
export const selectSearchResults = createSelector(
  [selectFilteredPosts, selectTodos],
  (filteredPosts, todos) => ({
    posts: filteredPosts,
    todos: todos,
    totalResults: filteredPosts.length + todos.length,
  })
);

// ============================================================================
// UTILITY SELECTORS
// ============================================================================

// Memoized selectors for performance
export const selectMemoizedUser = createSelector(
  [selectUser],
  (user) => user
);

export const selectMemoizedTodos = createSelector(
  [selectTodos],
  (todos) => todos
);

export const selectMemoizedPosts = createSelector(
  [selectPosts],
  (posts) => posts
);

// Selectors with parameters
export const createSelectItemById = (itemType) => (id) => (state) => {
  switch (itemType) {
    case 'todo':
      return state.todos.list.find(todo => todo.id === id);
    case 'post':
      return state.posts.posts.find(post => post.id === id);
    case 'user':
      return state.user.userData;
    default:
      return null;
  }
};

// Conditional selectors
export const selectConditionalData = createSelector(
  [selectIsAuthenticated, selectUser, selectTodos],
  (isAuthenticated, user, todos) => {
    if (!isAuthenticated) {
      return { message: 'Please log in to view data' };
    }
    
    return {
      user,
      todos: todos.slice(0, 5), // Show only first 5 todos
      message: 'Welcome back!',
    };
  }
);
