import React, { useEffect, useState } from 'react';
import { useApp, useNotifications, useModal } from './hooks/useRedux';
// Selectors are available but we will derive simple values from hooks to avoid malformed state usage here
import RTKQueryExample from './components/RTKQueryExample';

export default function App() {
  const { counter, todos, user, ui, posts } = useApp();
  const notifications = useNotifications();
  const loginModal = useModal('loginModal');
  const profileModal = useModal('profileModal');
  
  // Local state
  const [newTodo, setNewTodo] = useState('');
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Derived values from hooks (avoid calling selectors with incomplete state objects)
  const count = counter.value;
  const todosCount = todos.todos.length;
  const completedCount = todos.todos.filter(t => t.completed).length;
  const completionPercentage = todosCount > 0 ? Math.round((completedCount / todosCount) * 100) : 0;
  const isAuthenticated = user.isAuthenticated;
  const displayName = user.user?.name || user.user?.username || 'Guest';
  const theme = ui.theme;
  const activeNotifications = ui.notifications;
  const stats = {
    totalTodos: todosCount,
    completionRate: completionPercentage,
    totalPosts: posts.posts.length,
    draftCount: posts.drafts.length,
  };

  // Initialize app
  useEffect(() => {
    ui.initializeUI();
    todos.fetchTodos();
    posts.fetchPosts();
  }, []);

  // Auto-dismiss notifications
  useEffect(() => {
    activeNotifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          notifications.removeNotification(notification.id);
        }, notification.duration);
      }
    });
  }, [activeNotifications, notifications]);

  // Event handlers
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      todos.addTodo(newTodo.trim());
      setNewTodo('');
      notifications.showSuccess('Todo added successfully!');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      username: formData.get('username'),
      password: formData.get('password'),
    };
    
    user.login(credentials)
      .unwrap()
      .then(() => {
        notifications.showSuccess(`Welcome back, ${credentials.username}!`);
        loginModal.close();
      })
      .catch((error) => {
        notifications.showError(error || 'Login failed');
      });
  };

  const handleLogout = () => {
    user.logout();
    notifications.showInfo('Logged out successfully');
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.body.trim()) {
      posts.createPost(newPost);
      setNewPost({ title: '', body: '' });
      notifications.showSuccess('Post created successfully!');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    posts.setSearchFilter(searchTerm);
    notifications.showInfo(`Searching for: ${searchTerm}`);
  };

  return (
    <div className={`app ${theme === 'dark' ? 'dark-theme' : ''}`}>
      {/* Header */}
      <header className="app-header">
        <h1>Redux Toolkit POC</h1>
        <div className="header-controls">
          <button 
            className="btn-secondary" 
            onClick={ui.toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {isAuthenticated ? (
            <div className="user-menu">
              <span>Welcome, {displayName}!</span>
              <button className="btn-primary" onClick={profileModal.open}>
                Profile
              </button>
              <button className="btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-primary" onClick={loginModal.open}>
              Login
            </button>
          )}
        </div>
      </header>

      {/* Notifications */}
      {activeNotifications.length > 0 && (
        <div className="notifications-container">
          {activeNotifications.map(notification => (
            <div key={notification.id} className={`notification notification-${notification.type}`}>
              <span>{notification.message}</span>
              <button 
                onClick={() => notifications.removeNotification(notification.id)}
                className="notification-close"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main Content */}
      <main className="app-main">
        {/* Dashboard Stats */}
        <section className="section stats-section">
          <h2>Dashboard</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Counter</h3>
              <div className="stat-value">{count}</div>
            </div>
            <div className="stat-card">
              <h3>Todos</h3>
              <div className="stat-value">{stats.totalTodos}</div>
              <div className="stat-subtitle">{stats.completionRate}% complete</div>
            </div>
            <div className="stat-card">
              <h3>Posts</h3>
              <div className="stat-value">{stats.totalPosts}</div>
            </div>
            <div className="stat-card">
              <h3>Drafts</h3>
              <div className="stat-value">{stats.draftCount}</div>
            </div>
          </div>
        </section>

        {/* Counter Section */}
        <section className="section">
          <h2>Counter</h2>
          <div className="counter-display">{count}</div>
          <div className="button-group">
            <button className="btn-primary" onClick={counter.increment}>
              +1
            </button>
            <button className="btn-secondary" onClick={counter.decrement}>
              -1
            </button>
            <button className="btn-danger" onClick={counter.reset}>
              Reset
            </button>
          </div>
        </section>

        {/* Todos Section */}
        <section className="section">
          <h2>Todos ({todosCount})</h2>
          <div className="todos-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span>{completedCount}/{todosCount} completed</span>
          </div>
          
          <form className="todo-form" onSubmit={handleAddTodo}>
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
            />
            <button type="submit" className="btn-success">
              Add Todo
            </button>
          </form>

          {todos.error && (
            <div className="error-message">
              <span>Error: {todos.error}</span>
              <button 
                className="btn-danger" 
                onClick={todos.clearError}
                style={{ padding: '8px 16px', fontSize: '12px' }}
              >
                Clear
              </button>
            </div>
          )}

          {todos.status === 'loading' && <div className="loading">Loading todos...</div>}
          
          {todos.todos.length > 0 && (
            <ul className="todo-list">
              {todos.todos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <span 
                    className={`todo-text ${todo.completed ? 'completed' : ''}`}
                    onClick={() => todos.toggleTodo(todo.id)}
                  >
                    {todo.title}
                  </span>
                  <button 
                    className="btn-danger"
                    onClick={() => todos.deleteTodo(todo.id)}
                    style={{ padding: '8px 16px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
          
          {todos.status === 'succeeded' && todos.todos.length === 0 && (
            <div className="empty-state">
              No todos yet. Add one above!
            </div>
          )}
        </section>

        {/* Posts Section */}
        {isAuthenticated && (
          <section className="section">
            <h2>Posts</h2>
            
            {/* Search */}
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
              />
              <button type="submit" className="btn-primary">Search</button>
            </form>

            {/* Create Post */}
            <form className="post-form" onSubmit={handleCreatePost}>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post title..."
              />
              <textarea
                value={newPost.body}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                placeholder="Post content..."
                rows="3"
              />
              <button type="submit" className="btn-success">Create Post</button>
            </form>

            {posts.status === 'loading' && <div className="loading">Loading posts...</div>}
            
            {posts.posts.length > 0 && (
              <div className="posts-grid">
                {posts.posts.slice(0, 5).map(post => (
                  <div key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <p>{post.body.substring(0, 100)}...</p>
                    <div className="post-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => posts.toggleFavorite(post.id)}
                      >
                        {posts.favorites.includes(post.id) ? '❤️' : '🤍'} Favorite
                      </button>
                      <button 
                        className="btn-danger"
                        onClick={() => posts.deletePost(post.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* RTK Query Example Section */}
        <section className="section">
          <h2>RTK Query Example</h2>
          <p>This section demonstrates RTK Query for API management with automatic caching, background refetching, and optimistic updates.</p>
          <RTKQueryExample />
        </section>
      </main>

      {/* Login Modal */}
      {loginModal.isOpen && (
        <div className="modal-overlay" onClick={loginModal.close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={loginModal.close}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Login
                </button>
              </div>
            </form>
            <p className="login-hint">Try: john_doe / password</p>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileModal.isOpen && (
        <div className="modal-overlay" onClick={profileModal.close}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Profile</h2>
            {user.user && (
              <div className="profile-info">
                <p><strong>Name:</strong> {user.user.name}</p>
                <p><strong>Email:</strong> {user.user.email}</p>
                <p><strong>Role:</strong> {user.user.role}</p>
                <p><strong>Username:</strong> {user.user.username}</p>
              </div>
            )}
            <div className="modal-actions">
              <button className="btn-primary" onClick={profileModal.close}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
