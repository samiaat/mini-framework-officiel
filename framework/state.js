export const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = [];

  const getState = () => state;

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener) => {
    listeners.push(listener);

    // Return an unsubscribe function for cleanup.
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  // Dispatch a dummy action on creation to populate the initial state.
  dispatch({ type: '@@INIT' });

  return { getState, dispatch, subscribe };
};
