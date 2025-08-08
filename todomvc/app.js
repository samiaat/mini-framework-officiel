import Framework, { createElement } from '../framework/index.js';

// --- UTILS ---
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// --- CONSTANTS ---
const ENTER_KEY = 13;
const ESCAPE_KEY = 27;

// --- STATE MANAGEMENT ---
const initialState = {
  todos: [],
  filter: 'all', 
  editing: null, 
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: uuid(), title: action.payload, completed: false }],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    case 'DESTROY_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
      };
    case 'START_EDITING':
      return { ...state, editing: action.payload };
    case 'CANCEL_EDITING':
      return { ...state, editing: null };
    case 'FINISH_EDITING':
      return {
        ...state,
        editing: null,
        todos: state.todos.map(todo =>
          todo.id === state.editing ? { ...todo, title: action.payload } : todo
        ),
      };
    case 'CLEAR_COMPLETED':
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed),
      };
    case 'TOGGLE_ALL':
        const areAllCompleted = state.todos.every(todo => todo.completed);
        return {
            ...state,
            todos: state.todos.map(todo => ({...todo, completed: !areAllCompleted}))
        };
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    default:
      return state;
  }
}

// --- COMPONENTS ---

function HeaderComponent() {
  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      const title = e.target.value.trim();
      if (title) {
        window.store.dispatch({ type: 'ADD_TODO', payload: title });
        e.target.value = '';
      }
    }
  };

  return createElement('header', { class: 'header' },
    createElement('h1', {}, 'todos'),
    createElement('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      autofocus: true,
      onkeydown: handleKeyDown,
    })
  );
}

function TodoItemComponent({ todo, isEditing }) {
  const handleToggle = () => window.store.dispatch({ type: 'TOGGLE_TODO', payload: todo.id });
  const handleDestroy = () => window.store.dispatch({ type: 'DESTROY_TODO', payload: todo.id });
  const handleStartEditing = () => window.store.dispatch({ type: 'START_EDITING', payload: todo.id });

  const handleFinishEditing = e => {
    if (e.keyCode === ENTER_KEY) {
      const title = e.target.value.trim();
      if (title) {
        window.store.dispatch({ type: 'FINISH_EDITING', payload: title });
      } else {
        handleDestroy();
      }
    } else if (e.keyCode === ESCAPE_KEY) {
      window.store.dispatch({ type: 'CANCEL_EDITING' });
    }
  };

  const liClass = `${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`;

  return createElement('li', { class: liClass, 'data-id': todo.id },
    createElement('div', { class: 'view' },
      createElement('input', { class: 'toggle', type: 'checkbox', checked: todo.completed, onchange: handleToggle }),
      createElement('label', { ondblclick: handleStartEditing }, todo.title),
      createElement('button', { class: 'destroy', onclick: handleDestroy })
    ),
    isEditing && createElement('input', {
      class: 'edit',
      value: todo.title,
      onkeydown: handleFinishEditing,
      onblur: () => window.store.dispatch({ type: 'CANCEL_EDITING' }),
      ref: (input) => input && input.focus(),
    })
  );
}

function MainComponent({ todos, filter, editing }) {
    const visibleTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const allCompleted = todos.every(t => t.completed);

    if (todos.length === 0) {
        return null;
    }

    return createElement('section', { class: 'main' },
        createElement('input', { id: 'toggle-all', class: 'toggle-all', type: 'checkbox', checked: allCompleted, onchange: () => window.store.dispatch({type: 'TOGGLE_ALL'}) }),
        createElement('label', { for: 'toggle-all' }, 'Mark all as complete'),
        createElement('ul', { class: 'todo-list' },
            ...visibleTodos.map(todo => TodoItemComponent({ todo, isEditing: editing === todo.id }))
        )
    );
}

function FooterComponent({ todos, filter }) {
  if (todos.length === 0) {
    return null;
  }

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.length - activeCount;
  const itemText = activeCount === 1 ? 'item' : 'items';

  return createElement('footer', { class: 'footer' },
    createElement('span', { class: 'todo-count' },
      createElement('strong', {}, activeCount), ` ${itemText} left`
    ),
    createElement('ul', { class: 'filters' },
      createElement('li', {}, createElement('a', { href: '#/', class: filter === 'all' ? 'selected' : '' }, 'All')),
      createElement('li', {}, createElement('a', { href: '#/active', class: filter === 'active' ? 'selected' : '' }, 'Active')),
      createElement('li', {}, createElement('a', { href: '#/completed', class: filter === 'completed' ? 'selected' : '' }, 'Completed'))
    ),
    completedCount > 0 && createElement('button', { class: 'clear-completed', onclick: () => window.store.dispatch({ type: 'CLEAR_COMPLETED' }) }, 'Clear completed')
  );
}

function App() {
  const state = window.store.getState();
  const { todos, filter, editing } = state;
  return createElement('div', {},
    createElement('section', { class: 'todoapp' },
      HeaderComponent(),
      MainComponent({ todos, filter, editing }),
      FooterComponent({ todos, filter })
    ),
    createElement('footer', { class: 'info' },
      createElement('p', {}, 'Double-click to edit a todo'),
      createElement('p', {}, 'Created by Jules'),
      createElement('p', {}, 'Part of TodoMVC')
    )
  );
}

// --- INITIALIZATION ---
const rootElement = document.getElementById('root');
const framework = new Framework({
    app: App,
    reducer,
    initialState,
    rootElement
});

framework.start();
