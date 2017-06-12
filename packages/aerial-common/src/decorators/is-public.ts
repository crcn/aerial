/**
 * flags a property as public so that a remote API / service
 * can execute it. Used in services/io.ts
 */

export default (proto, name) => {

  if (!proto.__publicProperties) {
    proto.__publicProperties = [];
  }

  proto.__publicProperties.push(name);
};
