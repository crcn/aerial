export * from "./array";
export * from "./component";
export * from "./html";
export * from "./platform";
export * from "./comment";
export * from "./uri";


const seed = fill0(Math.round(Math.random() * 100), 3);

let _i = 0;
export const createUID = () => {
  const now = new Date();
  return `${seed}${fill0(now.getSeconds())}${_i++}`;
}


function fill0(num, min = 2) {
  let buffer = "" + num;

  while(buffer.length < min) {
    buffer = "0" + buffer;
  }

  return buffer;
}
