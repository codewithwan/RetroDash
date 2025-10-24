import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { playBeep } from '../utils/sound';
import { STORAGE_KEYS } from '../utils/storage';

function TodoModule() {
  const [todos, setTodos] = useLocalStorage(STORAGE_KEYS.TODOS, []);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const addTodo = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    
    if (text === '') return;
    
    const todo = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, todo]);
    setInputValue('');
    playBeep();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
    playBeep();
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    playBeep();
  };

  const clearCompletedTodos = useCallback(() => {
    const hadCompleted = todos.some(t => t.completed);
    if (hadCompleted) {
      setTodos(todos.filter(todo => !todo.completed));
      playBeep();
    }
  }, [todos, setTodos]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName !== 'INPUT') {
        // Focus todo input with '1'
        if (e.key === '1') {
          e.preventDefault();
          inputRef.current?.focus();
          playBeep();
        }
        // Clear completed with 'C'
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey) {
          e.preventDefault();
          clearCompletedTodos();
        }
      }
      
      // Clear all data with Ctrl+K
      if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
        e.preventDefault();
        if (confirm('Clear all data? This cannot be undone.')) {
          setTodos([]);
          playBeep();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [todos, clearCompletedTodos, setTodos]);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <section className="module" id="todo-module">
      <div className="module-header">
        <h2>[1] TODO LIST</h2>
        <span className="module-status" id="todo-status">{completedCount}/{totalCount}</span>
      </div>
      <div className="module-content">
        <form onSubmit={addTodo} className="todo-form">
          <input 
            ref={inputRef}
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="> Add new task..." 
            autoComplete="off"
            maxLength="80"
          />
        </form>
        <ul className="todo-list">
          {todos.length === 0 ? (
            <li style={{ color: 'var(--terminal-dim)', padding: '10px' }}>
              No tasks yet. Add one above!
            </li>
          ) : (
            todos.map(todo => (
              <li 
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                tabIndex="0"
              >
                <span className="todo-text">{todo.text}</span>
                <div className="todo-controls">
                  <button 
                    className="todo-btn" 
                    onClick={() => toggleTodo(todo.id)}
                    title="Toggle complete"
                  >
                    {todo.completed ? '[ ]' : '[X]'}
                  </button>
                  <button 
                    className="todo-btn" 
                    onClick={() => deleteTodo(todo.id)}
                    title="Delete task"
                  >
                    [D]
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}

export default TodoModule;
