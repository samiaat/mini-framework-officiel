import { createElement, render, mount } from './dom.js';
import { createStore } from './state.js';
import { createRouter } from './router.js';

const createApp = (component, target) => {
    let currentVNode = component();
    let rootNode = render(currentVNode);
    mount(rootNode, target);

    return () => {
        const newVNode = component();
        const newRootNode = render(newVNode);
        rootNode.replaceWith(newRootNode);
        currentVNode = newVNode;
        rootNode = newRootNode;
    };
};

export default class Framework {
  constructor({ app, reducer, initialState, rootElement }) {
    this.app = app;
    this.reducer = reducer;
    this.initialState = initialState;
    this.rootElement = rootElement;
    this.store = null;
  }

  start() {
    this.store = createStore(this.reducer, this.initialState);

    //  store globally 
    window.store = this.store;

    const update = createApp(this.app, this.rootElement);
    this.store.subscribe(update);
    createRouter(this.store);
  }
}

export { createElement };
