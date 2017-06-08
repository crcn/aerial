import { IMessage } from "@tandem/mesh";

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
export interface IHTTPHeaders {
  age?: string;
  cacheControl?: string;
  expires?: string;
  accept?: string;
  acceptCharset?: string;
  acceptEncoding?: string;
  acceptLanguage?: string;
  cookie?: string;
  setCookie?: string;
  contentLength?: number;
  contentType?: string;
  contentEncoding?: string;
  contentLanguage?: string;
  location?: string;
  host?: string;
  referer?: string;
  refererPolicy?: string;
  userAgent?: string;
}

// http://www.restapitutorial.com/httpstatuscodes.html
export enum HTTPStatusType {

  // success
  OK = 200,
  CREATED = 201,
  NON_AUTHORITIVE_INFORMATION = 203,
  NO_CONTENT = 204,
  RESET_CONTENT = 205,
  PARTIAL_CONTENT = 206,
  MULTI_STATUS = 207,
  ALREADY_REPORTED = 208,
  IM_USED = 226,

  // redirect
  MULTIPLE_CHOISES = 300,
  MOVED_PERMANENTLY = 301,
  FOUND = 302,
  SEE_OTHER = 303,
  NOT_MODIFIED = 304,
  USE_PROXY = 205,
  TEMPORARY_REDIRECT = 307,
  PERMANENT_REDIRECT = 308,

  // client error
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  PROXY_AUTHENTICATION_REQUIRED = 407,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  GONE = 410,
  LENGTH_REQUIRED = 411,
  PRECONDITION_FALIED = 4012,
  REQUEST_ENTITY_TOO_LARGE = 413,
  REQUEST_URI_TOO_LONG = 414,
  UNSUPPORTED_MEDIA_TYPE = 415,
  REQUESTED_RANGE_NOT_SATISFIED = 416,
  EXPECTATION_FAILED = 417,
  IM_A_TEAPOT = 418,
  ENHANCE_YOUR_CALM = 420,
  UNPROCESSABLE_ENTITY = 422,
  LOCKED = 423,
  FAILED_DEPENDENCY = 424,
  TOO_MANY_REQUESTS = 429,
  REQUESTHEADER_FIELDS_TOO_LARGE = 431,
  NO_RESPONSE = 444,
  RETRY_WITH = 449,
  UNAVAILABLE_FOR_LEGAL_REASONS = 451,
  CLIENT_COSED_REQUEST = 499,

  // server error
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 53,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
  VARIANT_ALSO_NEGOTIATES = 506,
  INSUFFICIENT_STORAGE = 501,
  LOOP_DETECTED = 508,
  BANDWIDTH_LIMIT_EXCEEDED = 509,
  NOT_EXTENDED = 510,
  NTETWORK_AUTHENTICATION_REQUIRED = 511,
  NETWORK_READ_TIMEOUT_ERROR = 590,
  NETWORK_CONNECT_TIMEOUT_ERROR = 599
}

// TODO - HTTPRequest & HTTPResponse classes should be somewhere else such as @tandem/synthetic-server
export class HTTPRequest implements IMessage {
  static readonly HTTP_REQUEST = "httpRequest";
  readonly type = HTTPRequest.HTTP_REQUEST;
  constructor(readonly method: string, readonly url: string, readonly headers: IHTTPHeaders = {}) {

  }
}

// maintaining the codebase conventions here... >.>
export class HTTPResponse implements IMessage {
  static readonly HTTP_RESPONSE = "httpResponse";
  readonly type = HTTPResponse.HTTP_RESPONSE;
  constructor(readonly status: HTTPStatusType, readonly headers: IHTTPHeaders = {}) {

  }
}
