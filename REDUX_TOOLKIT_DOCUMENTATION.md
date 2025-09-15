# Redux Toolkit Implementation Documentation

## Overview

This project demonstrates a comprehensive implementation of Redux Toolkit for state management in a React application. The implementation includes multiple feature slices, custom hooks, selectors, middleware, and RTK Query for API management.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Store Configuration](#store-configuration)
3. [Feature Slices](#feature-slices)
4. [Custom Hooks](#custom-hooks)
5. [Selectors](#selectors)
6. [RTK Query API](#rtk-query-api)
7. [Middleware](#middleware)
8. [Usage Examples](#usage-examples)
9. [Best Practices](#best-practices)
10. [Performance Considerations](#performance-considerations)

## Project Structure

```
src/
├── app/
│   └── store.js                 # Store configuration
├── features/
│   ├── counterSlice.js         # Counter feature slice
│   ├── todoSlice.js            # Todo management slice
│   ├── userSlice.js            # User authentication slice
│   ├── uiSlice.js              # UI state management slice
│   ├── postsSlice.js           # Posts management slice
│   ├── apiSlice.js             # RTK Query API slice
│   ├── selectors.js            # Memoized selectors
│   └── index.js                # Feature exports
├── hooks/
│   └── useRedux.js             # Custom Redux hooks
└── App.jsx                     # Main application component
```

## Store Configuration

### Enhanced Store Setup

The store is configured with:
- Multiple feature reducers
- Custom middleware for logging and error handling
- Redux DevTools integration
- RTK Query API slice integration

```javascript
// src/app/store.js
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
    user: userReducer,
    ui: uiReducer,
    posts: postsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [apiSlice.util.resetApiState.type],
      },
    })
      .concat(apiSlice.middleware)
      .concat(loggerMiddleware)
      .concat(errorMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});
```

## Feature Slices

### 1. Counter Slice

Simple counter with increment, decrement, and reset actions.

```javascript
// Features
- increment: Increase counter by 1
- decrement: Decrease counter by 1
- reset: Reset counter to 0

// State
{ value: 0 }
```

### 2. Todo Slice

Comprehensive todo management with async operations.

```javascript
// Features
- fetchTodos: Async thunk to fetch todos from API
- addTodo: Add new todo
- deleteTodo: Remove todo by ID
- toggleTodo: Toggle completion status
- clearError: Clear error state

// State
{
  list: [],
  status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
  error: null
}
```

### 3. User Slice

Authentication and user management.

```javascript
// Features
- loginUser: Async login with credentials
- logoutUser: Async logout
- fetchUserProfile: Fetch user profile
- updateProfile: Update user profile
- clearError: Clear authentication errors

// State
{
  userData: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null
}
```

### 4. UI Slice

Global UI state management.

```javascript
// Features
- Theme management (light/dark)
- Modal state management
- Notification system
- Loading states
- Error handling
- User preferences

// State
{
  theme: 'light',
  modals: { loginModal: false, profileModal: false, ... },
  notifications: [],
  loading: { global: false, counter: false, ... },
  preferences: { animations: true, soundEnabled: true, ... },
  errors: { global: null, network: null, ... }
}
```

### 5. Posts Slice

Blog posts management with filtering and pagination.

```javascript
// Features
- fetchPosts: Fetch posts from API
- createPost: Create new post
- updatePost: Update existing post
- deletePost: Delete post
- Search and filtering
- Pagination
- Favorites management
- Draft management

// State
{
  posts: [],
  currentPost: null,
  status: 'idle',
  error: null,
  filters: { search: '', category: 'all', ... },
  pagination: { currentPage: 1, totalPages: 1, ... },
  drafts: [],
  favorites: []
}
```

## Custom Hooks

### useRedux Hooks

Custom hooks that encapsulate Redux logic and provide a clean API.

```javascript
// Counter hook
const { value, increment, decrement, reset } = useCounter();

// Todos hook
const { todos, status, error, addTodo, deleteTodo, toggleTodo } = useTodos();

// User hook
const { user, isAuthenticated, login, logout, updateProfile } = useUser();

// UI hook
const { theme, toggleTheme, openModal, closeModal, addNotification } = useUI();

// Posts hook
const { posts, createPost, updatePost, deletePost, toggleFavorite } = usePosts();

// Combined app hook
const { counter, todos, user, ui, posts } = useApp();

// Notifications hook
const { showSuccess, showError, showWarning, showInfo } = useNotifications();

// Modal hook
const { isOpen, open, close, toggle } = useModal('modalName');
```

## Selectors

### Memoized Selectors

Using `createSelector` for performance optimization.

```javascript
// Basic selectors
const selectCounterValue = (state) => state.counter.value;
const selectTodos = (state) => state.todos.list;

// Computed selectors
const selectCompletedTodos = createSelector(
  [selectTodos],
  (todos) => todos.filter(todo => todo.completed)
);

const selectTodosCompletionPercentage = createSelector(
  [selectTodosCount, selectCompletedTodosCount],
  (total, completed) => total > 0 ? Math.round((completed / total) * 100) : 0
);

// Complex selectors
const selectDashboardStats = createSelector(
  [selectTodosCount, selectCompletedTodosCount, selectPosts, selectDraftCount],
  (totalTodos, completedTodos, posts, draftCount) => ({
    totalTodos,
    completedTodos,
    pendingTodos: totalTodos - completedTodos,
    totalPosts: posts.length,
    draftCount,
    completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0,
  })
);
```

## RTK Query API

### API Slice Configuration

Comprehensive API management with caching and invalidation.

```javascript
// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// API endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User', 'Post', 'Comment', 'Todo'],
  endpoints: (builder) => ({
    // User endpoints
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User'],
    }),
    // Post endpoints
    getPosts: builder.query({
      query: ({ page = 1, limit = 10, userId } = {}) => {
        const params = new URLSearchParams();
        params.append('_page', page);
        params.append('_limit', limit);
        if (userId) params.append('userId', userId);
        return `/posts?${params.toString()}`;
      },
      providesTags: ['Post'],
    }),
    // ... more endpoints
  }),
});
```

### Generated Hooks

RTK Query automatically generates hooks for all endpoints:

```javascript
// Query hooks
const { data: users, isLoading, error } = useGetUsersQuery();
const { data: posts } = useGetPostsQuery({ page: 1, limit: 10 });

// Mutation hooks
const [createPost, { isLoading: isCreating }] = useCreatePostMutation();
const [updatePost] = useUpdatePostMutation();
const [deletePost] = useDeletePostMutation();
```

## Middleware

### Custom Middleware

```javascript
// Logging middleware
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('New state:', store.getState());
  return result;
};

// Error handling middleware
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux Error:', error);
    return next(action);
  }
};
```

## Usage Examples

### Basic Counter Usage

```javascript
import { useCounter } from './hooks/useRedux';

function CounterComponent() {
  const { value, increment, decrement, reset } = useCounter();
  
  return (
    <div>
      <h2>Counter: {value}</h2>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Todo Management

```javascript
import { useTodos } from './hooks/useRedux';

function TodoComponent() {
  const { todos, addTodo, deleteTodo, toggleTodo, status } = useTodos();
  const [newTodo, setNewTodo] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      addTodo(newTodo.trim());
      setNewTodo('');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add todo..."
        />
        <button type="submit">Add</button>
      </form>
      
      {status === 'loading' && <div>Loading...</div>}
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.title}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Authentication Flow

```javascript
import { useUser, useNotifications } from './hooks/useRedux';

function LoginComponent() {
  const { login, isAuthenticated, user, error } = useUser();
  const { showSuccess, showError } = useNotifications();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials).unwrap();
      showSuccess('Login successful!');
    } catch (error) {
      showError('Login failed: ' + error);
    }
  };
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleLogin({
        username: formData.get('username'),
        password: formData.get('password'),
      });
    }}>
      <input name="username" placeholder="Username" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
```

### UI State Management

```javascript
import { useUI, useModal, useNotifications } from './hooks/useRedux';

function AppComponent() {
  const { theme, toggleTheme, addNotification } = useUI();
  const { showSuccess, showError } = useNotifications();
  const loginModal = useModal('loginModal');
  
  return (
    <div className={`app ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <header>
        <button onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <button onClick={loginModal.open}>Login</button>
      </header>
      
      {loginModal.isOpen && (
        <div className="modal-overlay" onClick={loginModal.close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            {/* Login form */}
          </div>
        </div>
      )}
    </div>
  );
}
```

## Best Practices

### 1. Slice Organization

- Keep slices focused on single features
- Use descriptive action names
- Include loading and error states
- Use `createAsyncThunk` for async operations

### 2. Selector Usage

- Use `createSelector` for computed values
- Keep selectors pure and memoized
- Group related selectors together
- Use parameterized selectors for reusability

### 3. Custom Hooks

- Encapsulate Redux logic in custom hooks
- Provide clean, intuitive APIs
- Use `useCallback` for action creators
- Combine related functionality

### 4. Error Handling

- Handle errors consistently across slices
- Provide user-friendly error messages
- Use notifications for user feedback
- Log errors for debugging

### 5. Performance

- Use memoized selectors
- Avoid unnecessary re-renders
- Implement proper loading states
- Use RTK Query for API caching

## Performance Considerations

### 1. Memoization

```javascript
// Good: Memoized selector
const selectFilteredPosts = createSelector(
  [selectPosts, selectPostsFilters],
  (posts, filters) => {
    // Expensive filtering logic
    return posts.filter(post => 
      post.title.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
);

// Bad: Non-memoized selector
const selectFilteredPosts = (state) => {
  // This runs on every state change
  return state.posts.posts.filter(post => 
    post.title.toLowerCase().includes(state.posts.filters.search.toLowerCase())
  );
};
```

### 2. Component Optimization

```javascript
// Good: Using memoized selectors
const MyComponent = () => {
  const posts = useSelector(selectFilteredPosts);
  // Component only re-renders when filtered posts change
};

// Bad: Using non-memoized selectors
const MyComponent = () => {
  const posts = useSelector(state => 
    state.posts.posts.filter(post => 
      post.title.includes(state.posts.filters.search)
    )
  );
  // Component re-renders on every state change
};
```

### 3. RTK Query Caching

```javascript
// RTK Query automatically caches data
const { data: posts, isLoading } = useGetPostsQuery();
// Data is cached and shared across components
// Automatic refetching and invalidation
```

## Conclusion

This Redux Toolkit implementation provides:

- **Comprehensive state management** with multiple feature slices
- **Type-safe operations** with proper TypeScript integration
- **Performance optimization** with memoized selectors
- **Clean APIs** with custom hooks
- **Robust error handling** and loading states
- **Modern patterns** using RTK Query for API management
- **Developer experience** with Redux DevTools and logging

The implementation follows Redux Toolkit best practices and provides a solid foundation for scalable React applications.
