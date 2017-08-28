import { } from "aerial-common2";

export const publicActionFactory = <TFunc extends Function>(factory: TFunc): TFunc => ((...args) => ({
  $public: true,
  ...(factory(...args) as any)
})) as any as TFunc;

export const isPublicAction = (type: string, action: any) => {
  return Boolean(action && action.$public);
}