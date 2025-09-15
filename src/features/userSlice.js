import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock user data - in a real app, this would come from an API
const mockUsers = [
  { id: 1, username: 'john_doe', email: 'john@example.com', name: 'John Doe', role: 'admin' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', name: 'Jane Smith', role: 'user' },
  { id: 3, username: 'bob_wilson', email: 'bob@example.com', name: 'Bob Wilson', role: 'user' },
];

// Async thunk for login
export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, validate credentials with API
      const user = mockUsers.find(u => u.username === username);
      
      if (!user || password !== 'password') {
        throw new Error('Invalid credentials');
      }
      
      // Simulate token generation
      const token = `mock_token_${user.id}_${Date.now()}`;
      
      return { user, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call to invalidate token
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user } = getState();
      if (!user.token) {
        throw new Error('No authentication token');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return current user data (in real app, fetch from API)
      return user.userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userData: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    loginAttempts: 0,
    lastLoginTime: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
      }
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
    },
    // Action to simulate token expiration
    expireToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.userData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.userData = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginTime = new Date().toISOString();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userData = null;
        state.token = null;
        state.error = action.payload;
        state.loginAttempts += 1;
      })
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.userData = null;
        state.token = null;
        state.error = null;
        state.loginAttempts = 0;
        state.lastLoginTime = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // If profile fetch fails due to auth issues, logout user
        if (action.payload.includes('token')) {
          state.isAuthenticated = false;
          state.userData = null;
          state.token = null;
        }
      });
  },
});

export const { clearError, updateProfile, resetLoginAttempts, expireToken } = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user.userData;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectUserToken = (state) => state.user.token;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;
export const selectLoginAttempts = (state) => state.user.loginAttempts;
export const selectLastLoginTime = (state) => state.user.lastLoginTime;

export default userSlice.reducer;
