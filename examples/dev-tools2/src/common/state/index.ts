
export type BundleEntryInfo = {
  buildTimestamp: number;
  filePath: string;
};

export type BundleInfo = {
  [identifer: string]: BundleEntryInfo;
};