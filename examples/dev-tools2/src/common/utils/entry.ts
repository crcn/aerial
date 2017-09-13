import * as md5 from "md5";

export const getFilePathHash = filePath => `${md5(filePath)}`;