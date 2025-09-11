import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// fetch a few todos from jsonplaceholder
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: { 
    list: [], 
    status: 'idle', 
    error: null 
  },
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload,
        completed: false,
        userId: 1
      };
      state.list.unshift(newTodo);
    },
    deleteTodo: (state, action) => {
      state.list = state.list.filter(todo => todo.id !== action.payload);
    },
    toggleTodo: (state, action) => {
      const todo = state.list.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
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
  },
});

export const { addTodo, deleteTodo, toggleTodo, clearError } = todoSlice.actions;
export default todoSlice.reducer;