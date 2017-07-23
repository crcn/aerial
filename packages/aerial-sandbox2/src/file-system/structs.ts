export const FILE      = "FILE";
export const DIRECTORY = "DIRECTORY";

export type Document = {
  name: string;
}

export type File = Document;

export type Directory = Document & {
  files: Array<File | Directory>;
}

