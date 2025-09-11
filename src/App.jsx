import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from './features/counterSlice';
import { fetchTodos, addTodo, deleteTodo, toggleTodo, clearError } from './features/todoSlice';

export default function App() {
  const count = useSelector((state) => state.counter.value);
  const { list, status, error } = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch(addTodo(newTodo.trim()));
      setNewTodo('');
    }
  };

  return (
    <div className="card">
      <h1 style={{ textAlign: 'center', margin: '0 0 32px 0', fontSize: '32px', fontWeight: '700', color: 'var(--text-color)' }}>
        Redux Toolkit POC
      </h1>

      <section className="section">
        <h2>Counter</h2>
        <div className="counter-display">{count}</div>
        <div className="button-group">
          <button className="btn-primary" onClick={() => dispatch(increment())}>
            +1
          </button>
          <button className="btn-secondary" onClick={() => dispatch(decrement())}>
            -1
          </button>
          <button className="btn-danger" onClick={() => dispatch(reset())}>
            Reset
          </button>
        </div>
      </section>

      <section className="section">
        <h2>Todos (Async)</h2>
        
        {/* Add Todo Form */}
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

        {/* Error Display */}
        {error && (
          <div className="error-message">
            <span>Error: {error}</span>
            <button 
              className="btn-danger" 
              onClick={() => dispatch(clearError())}
              style={{ padding: '8px 16px', fontSize: '12px' }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Loading State */}
        {status === 'loading' && <div className="loading">Loading todos...</div>}
        
        {/* Todo List */}
        {list.length > 0 && (
          <ul className="todo-list">
            {list.map(todo => (
              <li key={todo.id} className="todo-item">
                <span 
                  className={`todo-text ${todo.completed ? 'completed' : ''}`}
                  onClick={() => dispatch(toggleTodo(todo.id))}
                >
                  {todo.title}
                </span>
                <button 
                  className="btn-danger"
                  onClick={() => dispatch(deleteTodo(todo.id))}
                  style={{ padding: '8px 16px', fontSize: '12px' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        
        {/* Empty State */}
        {status === 'succeeded' && list.length === 0 && (
          <div className="empty-state">
            No todos yet. Add one above!
          </div>
        )}
      </section>
    </div>
  );
}
