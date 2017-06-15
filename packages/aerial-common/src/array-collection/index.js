/**
 * ES5 compatible subclassing of arrays.
 */


function ArrayCollection() {
  Array.prototype.push.apply(this, arguments);
}

ArrayCollection.prototype = [];

ArrayCollection.create = function() {
  var proto = [];
  proto["__proto__"] =  Object.create(this.prototype);
  
  try {
    console.log(this);
    // try the es5 route
    return this.apply(proto, arguments);
  } catch(e) {

    // es6 enabled
    return new this(...arguments);
  }
};

exports.ArrayCollection = ArrayCollection;

// export class ArrayCollection<T> extends Array<T> {

//   protected constructor(...items: T[]) {
//     super(...items);
//     return this;
//   }

//   static create<T>(...items: T[]): ArrayCollection<T> {
//     const proto = [];
//     proto["__proto__"] =  Object.create(this.prototype);

//     // for (const key in Object.create(this.prototype)) {
//     //   // proto[key] = this.prototype[key];
//     // }

//     // try the es5 route
//     try {
//       return this.apply(proto, items);
//     } catch(e) {
//       console.log("ERRING", e.stack)
//       return new this(...items);
//     }
//   }
// }