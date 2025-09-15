import React from 'react';
import { 
  useGetPostsQuery, 
  useGetUsersQuery, 
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation 
} from '../features/apiSlice';

/**
 * Example component demonstrating RTK Query usage
 * This component shows how to use RTK Query hooks for data fetching and mutations
 */
export default function RTKQueryExample() {
  // Query hooks - automatically handle loading, error, and caching
  const { 
    data: posts, 
    isLoading: postsLoading, 
    error: postsError,
    refetch: refetchPosts 
  } = useGetPostsQuery({ page: 1, limit: 5 });
  
  const { 
    data: users, 
    isLoading: usersLoading, 
    error: usersError 
  } = useGetUsersQuery();

  // Mutation hooks - return trigger function and mutation state
  const [createPost, { 
    isLoading: isCreating, 
    error: createError 
  }] = useCreatePostMutation();
  
  const [updatePost, { 
    isLoading: isUpdating, 
    error: updateError 
  }] = useUpdatePostMutation();
  
  const [deletePost, { 
    isLoading: isDeleting, 
    error: deleteError 
  }] = useDeletePostMutation();

  // Event handlers
  const handleCreatePost = async () => {
    try {
      const newPost = {
        title: 'New Post via RTK Query',
        body: 'This post was created using RTK Query mutation',
        userId: 1
      };
      
      await createPost(newPost).unwrap();
      console.log('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  const handleUpdatePost = async (postId) => {
    try {
      const updates = {
        title: 'Updated Post Title',
        body: 'This post was updated using RTK Query mutation'
      };
      
      await updatePost({ id: postId, ...updates }).unwrap();
      console.log('Post updated successfully!');
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      console.log('Post deleted successfully!');
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  // Loading states
  if (postsLoading || usersLoading) {
    return <div className="loading">Loading data...</div>;
  }

  // Error states
  if (postsError || usersError) {
    return (
      <div className="error-message">
        <h3>Error loading data</h3>
        <p>Posts Error: {postsError?.message || 'Unknown error'}</p>
        <p>Users Error: {usersError?.message || 'Unknown error'}</p>
        <button onClick={refetchPosts} className="btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rtk-query-example">
      <h2>RTK Query Example</h2>
      
      {/* Posts Section */}
      <section className="section">
        <h3>Posts ({posts?.length || 0})</h3>
        <div className="button-group">
          <button 
            onClick={handleCreatePost} 
            className="btn-success"
            disabled={isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Post'}
          </button>
          <button 
            onClick={refetchPosts} 
            className="btn-secondary"
          >
            Refetch Posts
          </button>
        </div>
        
        {createError && (
          <div className="error-message">
            Create Error: {createError.message}
          </div>
        )}
        
        {posts && posts.length > 0 ? (
          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="post-item">
                <h4>{post.title}</h4>
                <p>{post.body}</p>
                <div className="post-actions">
                  <button 
                    onClick={() => handleUpdatePost(post.id)}
                    className="btn-secondary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? 'Updating...' : 'Update'}
                  </button>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="btn-danger"
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No posts available</div>
        )}
      </section>

      {/* Users Section */}
      <section className="section">
        <h3>Users ({users?.length || 0})</h3>
        {users && users.length > 0 ? (
          <div className="users-list">
            {users.slice(0, 3).map(user => (
              <div key={user.id} className="user-item">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
                <p>@{user.username}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No users available</div>
        )}
      </section>

      {/* RTK Query Features Demo */}
      <section className="section">
        <h3>RTK Query Features</h3>
        <div className="features-list">
          <div className="feature-item">
            <h4>✅ Automatic Caching</h4>
            <p>Data is automatically cached and shared across components</p>
          </div>
          <div className="feature-item">
            <h4>✅ Background Refetching</h4>
            <p>Data is automatically refetched when stale</p>
          </div>
          <div className="feature-item">
            <h4>✅ Optimistic Updates</h4>
            <p>UI updates immediately while mutations are in progress</p>
          </div>
          <div className="feature-item">
            <h4>✅ Error Handling</h4>
            <p>Comprehensive error states and retry mechanisms</p>
          </div>
          <div className="feature-item">
            <h4>✅ Loading States</h4>
            <p>Built-in loading states for all operations</p>
          </div>
          <div className="feature-item">
            <h4>✅ Cache Invalidation</h4>
            <p>Automatic cache invalidation on mutations</p>
          </div>
        </div>
      </section>
    </div>
  );
}
