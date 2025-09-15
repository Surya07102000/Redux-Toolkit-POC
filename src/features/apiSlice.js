import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the base query with common configuration
const baseQuery = fetchBaseQuery({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  prepareHeaders: (headers, { getState }) => {
    // Get the token from the Redux state
    const token = getState().user.token;
    
    // If we have a token, set the authorization header
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Set common headers
    headers.set('content-type', 'application/json');
    headers.set('accept', 'application/json');
    
    return headers;
  },
});

// Base query with retry logic
const baseQueryWithRetry = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Retry logic for failed requests
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.log('Retrying request...');
    result = await baseQuery(args, api, extraOptions);
  }
  
  return result;
};

// Create the API slice
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
    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }],
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
    getPostById: builder.query({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    getPostsByUser: builder.query({
      query: (userId) => `/users/${userId}/posts`,
      providesTags: (result, error, userId) => [
        { type: 'Post', id: 'LIST' },
        ...(result?.map(({ id }) => ({ type: 'Post', id })) || []),
      ],
    }),
    createPost: builder.mutation({
      query: (postData) => ({
        url: '/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: builder.mutation({
      query: ({ id, ...postData }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: postData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
    
    // Comment endpoints
    getComments: builder.query({
      query: (postId) => `/posts/${postId}/comments`,
      providesTags: (result, error, postId) => [
        { type: 'Comment', id: postId },
        ...(result?.map(({ id }) => ({ type: 'Comment', id })) || []),
      ],
    }),
    createComment: builder.mutation({
      query: (commentData) => ({
        url: '/comments',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: postId },
      ],
    }),
    
    // Todo endpoints
    getTodos: builder.query({
      query: ({ userId, completed } = {}) => {
        const params = new URLSearchParams();
        if (userId) params.append('userId', userId);
        if (completed !== undefined) params.append('completed', completed);
        
        return `/todos?${params.toString()}`;
      },
      providesTags: ['Todo'],
    }),
    getTodoById: builder.query({
      query: (id) => `/todos/${id}`,
      providesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
    createTodo: builder.mutation({
      query: (todoData) => ({
        url: '/todos',
        method: 'POST',
        body: todoData,
      }),
      invalidatesTags: ['Todo'],
    }),
    updateTodo: builder.mutation({
      query: ({ id, ...todoData }) => ({
        url: `/todos/${id}`,
        method: 'PUT',
        body: todoData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Todo', id }],
    }),
    deleteTodo: builder.mutation({
      query: (id) => ({
        url: `/todos/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Todo', id }],
    }),
    
    // Search endpoints
    searchPosts: builder.query({
      query: (searchTerm) => `/posts?q=${encodeURIComponent(searchTerm)}`,
      providesTags: (result, error, searchTerm) => [
        { type: 'Post', id: `search-${searchTerm}` },
      ],
    }),
    
    // Batch operations
    batchGetPosts: builder.query({
      query: (postIds) => `/posts?id=${postIds.join('&id=')}`,
      providesTags: (result, error, postIds) => [
        ...(postIds?.map(id => ({ type: 'Post', id })) || []),
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // User hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Post hooks
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  
  // Comment hooks
  useGetCommentsQuery,
  useCreateCommentMutation,
  
  // Todo hooks
  useGetTodosQuery,
  useGetTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
  
  // Search hooks
  useSearchPostsQuery,
  useBatchGetPostsQuery,
} = apiSlice;

// Export the API slice reducer
export default apiSlice.reducer;
