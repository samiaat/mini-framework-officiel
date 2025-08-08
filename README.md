# Simple JavaScript Framework

Welcome to the documentation for this simple JavaScript framework. This document explains how the framework works and how to use it to build user interfaces.

## Features

- **Declarative UI**: Describe your UI with simple JavaScript functions and objects, and the framework will handle the rendering to the DOM.
- **Component-Based**: Build your application as a tree of components, making your code more modular and reusable.
- **State Management**: A simple Redux-like store is provided for centralized state management.
- **Routing**: A basic hash-based router is included to handle different views in your application.
- **Inversion of Control**: The framework handles the application's lifecycle, so you can focus on building your components.

## How it Works: The Virtual DOM

This framework is based on the concept of a **Virtual DOM (VDOM)**. Instead of manipulating the real DOM directly, you create a lightweight representation of your UI using JavaScript objects. These objects are called "virtual nodes" or "VNodes".

When the state of your application changes, the framework creates a new VDOM tree and compares it to the previous one. It then calculates the most efficient way to update the real DOM to match the new VDOM. This approach simplifies UI development and can lead to better performance.

## Creating UI with `createElement`

The core of the framework is the `createElement` function. It allows you to create VNodes that describe your UI.

### Function Signature

```javascript
createElement(tag, props, ...children);
```

- `tag` (string): The HTML tag name of the element (e.g., `'div'`, `'p'`, `'button'`).
- `props` (object): An object containing the attributes and event handlers for the element.
- `children` (...VNode | ...string): The child elements or text content of the element.

### Creating an Element

To create a simple `div` element, you can do the following:

```javascript
import { createElement } from "./framework/index.js";

const myDiv = createElement("div", {});
```

### Adding Attributes

To add attributes to an element, pass them in the `props` object:

```javascript
const myInput = createElement("input", {
  type: "text",
  placeholder: "Enter your name",
  class: "my-input-class",
});
```

### Adding Events

Events are also added through the `props` object. The event names are in camelCase and start with `on` (e.g., `onclick`, `onkeydown`).

```javascript
const myButton = createElement(
  "button",
  {
    onclick: () => alert("Button clicked!"),
  },
  "Click Me"
);
```

### Nesting Elements

You can nest elements by passing them as children to the `createElement` function:

```javascript
const app = createElement(
  "div",
  { class: "container" },
  createElement("h1", {}, "My App"),
  createElement("p", {}, "Welcome to my application."),
  myButton // You can also pass variables that hold VNodes
);
```

## The Framework Class

To run your application, you need to use the `Framework` class. This class takes your application's root component, reducer, initial state, and the root DOM element as arguments.

```javascript
import Framework from "./framework/index.js";
import App from "./App.js"; // Your root component
import reducer from "./reducer.js";

const initialState = {
  /* ... */
};
const rootElement = document.getElementById("root");

const framework = new Framework({
  app: App,
  reducer,
  initialState,
  rootElement,
});

framework.start();
```

The `framework.start()` method initializes the store, sets up the router, and renders your application to the specified root element.

## Why it Works this Way

This framework is designed to be simple and easy to understand. By using a declarative approach with `createElement`, you can build complex UIs without having to worry about the details of DOM manipulation. The framework handles the "how", so you can focus on the "what".

The separation of concerns between the framework and the application code (inversion of control) makes your application more maintainable and easier to test. Your components are just pure functions that return VNodes, which makes them highly predictable.

This architecture is inspired by popular frameworks like React and Vue.js, but it is much simpler and intended for educational purposes.
