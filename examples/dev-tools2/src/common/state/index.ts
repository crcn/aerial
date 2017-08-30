
export type BundleEntryInfo = {
  buildTimestamp: number;
};

export type BundleInfo = {
  [identifer: string]: BundleEntryInfo;
};