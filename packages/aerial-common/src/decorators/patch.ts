export const patchable = () => {
  return (proto: any, property: string = undefined, descriptor: any = undefined) => {
   const patchableProperties = proto.__patchableProperties = (proto.__patchableProperties || []).concat();
   if (patchableProperties.indexOf(property) === -1) {
     patchableProperties.push(property);
   }
  };
};

export const getPatchableProperties = (instance: any): Array<string> => {
  return instance.__patchableProperties || [];
};