# Redux Toolkit POC

A comprehensive Proof of Concept (POC) demonstrating Redux Toolkit implementation for state management in a React application. This project showcases modern Redux patterns, custom hooks, selectors, middleware, and RTK Query for API management with a beautiful, responsive UI.

## 🚀 Live Demo

The application is running at `http://localhost:5173/` and features:
- **Modern UI Design** with gradient background and card-based layout
- **Interactive Counter** with styled buttons and animations
- **Dynamic Todo List** with CRUD operations and async data fetching
- **User Authentication** with login/logout functionality
- **Theme System** with light/dark mode toggle
- **Notification System** with toast notifications
- **Modal Management** for user interactions
- **Posts Management** with filtering and favorites
- **RTK Query Integration** for advanced API management
- **Responsive Design** that works on all screen sizes

## 🔐 Login (Mock Auth)

Use the built‑in mock credentials to log in:

- Username: `john_doe` (or `jane_smith`, `bob_wilson`)
- Password: `password`

After login, you’ll see a welcome message, Profile button, and the Posts section actions become available.

## ✨ Features

### Core Redux Toolkit Features
- **Centralized Store Configuration** with Redux DevTools integration
- **Feature Slices** for organized state management
- **Custom Middleware** for logging and error handling
- **Memoized Selectors** for performance optimization
- **Custom Hooks** for clean component APIs

### Feature Slices
- **Counter Slice** - Simple counter with increment/decrement/reset
- **Todo Slice** - Todo management with async operations
- **User Slice** - Authentication and user profile management
- **UI Slice** - Global UI state (theme, modals, notifications)
- **Posts Slice** - Blog posts with filtering, pagination, and favorites

### Advanced Features
- **RTK Query** - Modern data fetching with caching and background updates
- **Theme System** - Light/dark theme with persistence
- **Notification System** - Toast notifications with auto-dismiss
- **Modal Management** - Centralized modal state
- **Error Handling** - Comprehensive error states and recovery
- **Loading States** - Granular loading indicators

### UI/UX Features
- **Modern Design**: Beautiful gradient background with card-based layout
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Color-coded Actions**: Intuitive button colors (blue for primary, red for danger, green for success)
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages with clear actions

## 📁 Project Structure

```
src/
├── app/
│   └── store.js                 # Store configuration
├── features/
│   ├── counterSlice.js         # Counter feature
│   ├── todoSlice.js            # Todo management
│   ├── userSlice.js            # User authentication
│   ├── uiSlice.js              # UI state management
│   ├── postsSlice.js           # Posts management
│   ├── apiSlice.js             # RTK Query API
│   ├── selectors.js            # Memoized selectors
│   └── index.js                # Feature exports
├── hooks/
│   └── useRedux.js             # Custom Redux hooks
├── components/
│   └── RTKQueryExample.jsx     # RTK Query demo
├── App.jsx                     # Main application
├── main.jsx                    # Application entry point
├── index.css                   # Modern CSS with custom properties
└── index.html                  # HTML entry point
```

## 🎯 Features Implemented

### 1. Counter Feature
- **Increment, decrement, and reset actions**
- **Large, prominent counter display**
- **Styled buttons with hover effects**
- **Simple synchronous state management**
- **Demonstrates basic Redux Toolkit patterns**

### 2. Todo Feature
- **Async Operations**: Fetch todos from JSONPlaceholder API
- **CRUD Operations**: Add, delete, and toggle todos
- **Loading States**: Proper handling of pending, fulfilled, and rejected states
- **Error Handling**: User-friendly error messages with retry capability
- **Interactive UI**: Click to toggle todos, styled delete buttons
- **Form Validation**: Prevents empty todo submissions

## 🛠️ Redux Toolkit Best Practices

### 1. Store Configuration
```javascript
export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
  },
});
```

### 2. Slice Creation
```javascript
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    reset: (state) => { state.value = 0; },
  },
});
```

### 3. Async Thunks with Error Handling
```javascript
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
```

### 4. Extra Reducers for Async Operations
```javascript
extraReducers: (builder) => {
  builder
    .addCase(fetchTodos.pending, (state) => { 
      state.status = 'loading';
      state.error = null;
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.list = action.payload;
    })
    .addCase(fetchTodos.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload || 'Failed to fetch todos';
    });
}
```

### 5. Modern CSS with Custom Properties
```css
:root {
  --primary-color: #6366f1;
  --danger-color: #ef4444;
  --success-color: #10b981;
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   ```
   http://localhost:5173/
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Login**
   - Click the Login button on the top right
   - Enter one of the mock usernames and `password`
   - Explore posts, favorites, and notifications

## 🎨 UI/UX Highlights

- **Gradient Background**: Beautiful purple-to-blue gradient
- **Card-based Layout**: Clean, modern design with shadows and rounded corners
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects and smooth animations
- **Color-coded Actions**: Intuitive button styling
- **Loading States**: Visual feedback for async operations
- **Error Handling**: User-friendly error messages

## 📚 Key Learning Points

1. **Redux Toolkit reduces boilerplate** compared to traditional Redux
2. **createSlice** automatically generates action creators and reducers
3. **createAsyncThunk** simplifies async operations with proper loading states
4. **Immer** allows writing "mutative" code that's actually immutable
5. **configureStore** sets up Redux DevTools and middleware automatically
6. **Proper error handling** with rejectWithValue for better UX
7. **Modular state management** with feature-based slices
8. **Modern CSS** with custom properties and responsive design
9. **Component composition** with clean separation of concerns

## 🛠️ Dependencies

- **@reduxjs/toolkit**: Modern Redux toolkit
- **react-redux**: React bindings for Redux
- **react**: UI library
- **vite**: Build tool and dev server

## 🧭 Project Usage Guide

- Counter: Click +1, -1, Reset to update the global counter
- Todos: Add a todo, toggle by clicking the text, delete with the button
- Theme: Toggle light/dark mode with the header button
- Notifications: Actions show toasts; they auto‑dismiss
- Posts: After logging in, create a post, search, and mark favorites
- RTK Query: See `components/RTKQueryExample.jsx` for query/mutation usage

## 🧰 Developer Notes

- Store is at `src/app/store.js` (lowercase `app`). Import via `./app/store`
- Feature exports are centralized in `src/features/index.js`
- Custom hooks are in `src/hooks/useRedux.js`
- API endpoints live in `src/features/apiSlice.js` (RTK Query)

## ❗ Troubleshooting

- Import error for `./app/store`: ensure the folder is `app` (lowercase) and the file exists
- Unexpected "type" in store: remove TypeScript-only exports from JS files
- UI is blank: open DevTools Console and check for missing named exports; align names with `src/features/index.js`
- RTK Query network errors: this demo calls `jsonplaceholder.typicode.com`; ensure you have internet access

## 🎯 What You'll Learn

This project demonstrates:
- ✅ Redux fundamentals (state, actions, reducers, store)
- ✅ Redux Toolkit features (configureStore, createSlice, createAsyncThunk)
- ✅ React integration (useSelector, useDispatch, Provider)
- ✅ Async operations with proper loading states
- ✅ Error handling and user feedback
- ✅ Modern UI/UX design principles
- ✅ Responsive web design
- ✅ Best practices for maintainable code

## 🚀 Next Steps

After understanding this implementation, you can:
- Add more complex state management patterns
- Implement user authentication
- Add data persistence
- Create more sophisticated UI components
- Integrate with real APIs
- Add testing with Jest and React Testing Library

---

**Happy Learning!** 🎉 This project provides a solid foundation for understanding Redux Toolkit and modern React development.