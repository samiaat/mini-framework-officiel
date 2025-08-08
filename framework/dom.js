import { applyEventHandlers } from './event.js';

export const createElement = (tag, props, ...children) => {
  return {
    tag,
    props: props || {},
    children: children.flat(),
  };
};


export const render = (vnode) => {
  if (vnode === null || vnode === undefined || typeof vnode === 'boolean') {
    return document.createTextNode('');
  }

  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(vnode.toString());
  }

  const { tag, props, children } = vnode;

  const element = document.createElement(tag);

  applyEventHandlers(element, props);

  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on')) {
      continue; 
    }

    if (key === 'ref') {
      // Handle ref callbacks to get a direct reference to the DOM element.
      if (typeof value === 'function') {
        value(element);
      }
    } else if (key === 'checked' || key === 'value' || key === 'disabled' || key === 'autofocus') {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  }

  // Recursively render 
  for (const child of children) {
    element.appendChild(render(child));
  }

  return element;
};



export const mount = (node, target) => {
  target.innerHTML = '';
  target.appendChild(node);
  return node;
};
