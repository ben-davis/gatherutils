import React from 'react';

const createReactClass = React.createClass;

function createClass(funcOrObject) {
  if (typeof funcOrObject === 'function') {
    return funcOrObject;
  }

  return createReactClass(funcOrObject);
}

export default createClass;
