const URI_PROTOCOL_ID_REGEX = /^\w+:\/\//;

export const hasURIProtocol = (value) => URI_PROTOCOL_ID_REGEX.test(value);
export const removeURIProtocol = (value) => value.replace(URI_PROTOCOL_ID_REGEX, "");

export const parseURI = (value) => {
  // if (value.subd)
}

export const getProtocol = (value) => (/^\w+:/.exec(value) || [])[0];


export function createDataUrl(content: Buffer|string, mimeType: string = "text/plain") {
  
  if (!(content instanceof Buffer)) {
    content = new Buffer(content, "utf8");
  }

  return `data:${mimeType},${content.toString("base64")}`;
}