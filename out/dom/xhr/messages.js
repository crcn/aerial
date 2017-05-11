"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// http://www.restapitutorial.com/httpstatuscodes.html
var HTTPStatusType;
(function (HTTPStatusType) {
    // success
    HTTPStatusType[HTTPStatusType["OK"] = 200] = "OK";
    HTTPStatusType[HTTPStatusType["CREATED"] = 201] = "CREATED";
    HTTPStatusType[HTTPStatusType["NON_AUTHORITIVE_INFORMATION"] = 203] = "NON_AUTHORITIVE_INFORMATION";
    HTTPStatusType[HTTPStatusType["NO_CONTENT"] = 204] = "NO_CONTENT";
    HTTPStatusType[HTTPStatusType["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    HTTPStatusType[HTTPStatusType["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    HTTPStatusType[HTTPStatusType["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    HTTPStatusType[HTTPStatusType["ALREADY_REPORTED"] = 208] = "ALREADY_REPORTED";
    HTTPStatusType[HTTPStatusType["IM_USED"] = 226] = "IM_USED";
    // redirect
    HTTPStatusType[HTTPStatusType["MULTIPLE_CHOISES"] = 300] = "MULTIPLE_CHOISES";
    HTTPStatusType[HTTPStatusType["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    HTTPStatusType[HTTPStatusType["FOUND"] = 302] = "FOUND";
    HTTPStatusType[HTTPStatusType["SEE_OTHER"] = 303] = "SEE_OTHER";
    HTTPStatusType[HTTPStatusType["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HTTPStatusType[HTTPStatusType["USE_PROXY"] = 205] = "USE_PROXY";
    HTTPStatusType[HTTPStatusType["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    HTTPStatusType[HTTPStatusType["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    // client error
    HTTPStatusType[HTTPStatusType["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPStatusType[HTTPStatusType["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPStatusType[HTTPStatusType["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HTTPStatusType[HTTPStatusType["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPStatusType[HTTPStatusType["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTPStatusType[HTTPStatusType["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HTTPStatusType[HTTPStatusType["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HTTPStatusType[HTTPStatusType["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    HTTPStatusType[HTTPStatusType["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HTTPStatusType[HTTPStatusType["CONFLICT"] = 409] = "CONFLICT";
    HTTPStatusType[HTTPStatusType["GONE"] = 410] = "GONE";
    HTTPStatusType[HTTPStatusType["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    HTTPStatusType[HTTPStatusType["PRECONDITION_FALIED"] = 4012] = "PRECONDITION_FALIED";
    HTTPStatusType[HTTPStatusType["REQUEST_ENTITY_TOO_LARGE"] = 413] = "REQUEST_ENTITY_TOO_LARGE";
    HTTPStatusType[HTTPStatusType["REQUEST_URI_TOO_LONG"] = 414] = "REQUEST_URI_TOO_LONG";
    HTTPStatusType[HTTPStatusType["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    HTTPStatusType[HTTPStatusType["REQUESTED_RANGE_NOT_SATISFIED"] = 416] = "REQUESTED_RANGE_NOT_SATISFIED";
    HTTPStatusType[HTTPStatusType["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    HTTPStatusType[HTTPStatusType["IM_A_TEAPOT"] = 418] = "IM_A_TEAPOT";
    HTTPStatusType[HTTPStatusType["ENHANCE_YOUR_CALM"] = 420] = "ENHANCE_YOUR_CALM";
    HTTPStatusType[HTTPStatusType["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HTTPStatusType[HTTPStatusType["LOCKED"] = 423] = "LOCKED";
    HTTPStatusType[HTTPStatusType["FAILED_DEPENDENCY"] = 424] = "FAILED_DEPENDENCY";
    HTTPStatusType[HTTPStatusType["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HTTPStatusType[HTTPStatusType["REQUESTHEADER_FIELDS_TOO_LARGE"] = 431] = "REQUESTHEADER_FIELDS_TOO_LARGE";
    HTTPStatusType[HTTPStatusType["NO_RESPONSE"] = 444] = "NO_RESPONSE";
    HTTPStatusType[HTTPStatusType["RETRY_WITH"] = 449] = "RETRY_WITH";
    HTTPStatusType[HTTPStatusType["UNAVAILABLE_FOR_LEGAL_REASONS"] = 451] = "UNAVAILABLE_FOR_LEGAL_REASONS";
    HTTPStatusType[HTTPStatusType["CLIENT_COSED_REQUEST"] = 499] = "CLIENT_COSED_REQUEST";
    // server error
    HTTPStatusType[HTTPStatusType["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HTTPStatusType[HTTPStatusType["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HTTPStatusType[HTTPStatusType["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HTTPStatusType[HTTPStatusType["SERVICE_UNAVAILABLE"] = 53] = "SERVICE_UNAVAILABLE";
    HTTPStatusType[HTTPStatusType["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HTTPStatusType[HTTPStatusType["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
    HTTPStatusType[HTTPStatusType["VARIANT_ALSO_NEGOTIATES"] = 506] = "VARIANT_ALSO_NEGOTIATES";
    HTTPStatusType[HTTPStatusType["INSUFFICIENT_STORAGE"] = 501] = "INSUFFICIENT_STORAGE";
    HTTPStatusType[HTTPStatusType["LOOP_DETECTED"] = 508] = "LOOP_DETECTED";
    HTTPStatusType[HTTPStatusType["BANDWIDTH_LIMIT_EXCEEDED"] = 509] = "BANDWIDTH_LIMIT_EXCEEDED";
    HTTPStatusType[HTTPStatusType["NOT_EXTENDED"] = 510] = "NOT_EXTENDED";
    HTTPStatusType[HTTPStatusType["NTETWORK_AUTHENTICATION_REQUIRED"] = 511] = "NTETWORK_AUTHENTICATION_REQUIRED";
    HTTPStatusType[HTTPStatusType["NETWORK_READ_TIMEOUT_ERROR"] = 590] = "NETWORK_READ_TIMEOUT_ERROR";
    HTTPStatusType[HTTPStatusType["NETWORK_CONNECT_TIMEOUT_ERROR"] = 599] = "NETWORK_CONNECT_TIMEOUT_ERROR";
})(HTTPStatusType = exports.HTTPStatusType || (exports.HTTPStatusType = {}));
// TODO - HTTPRequest & HTTPResponse classes should be somewhere else such as @tandem/synthetic-server
var HTTPRequest = (function () {
    function HTTPRequest(method, url, headers) {
        if (headers === void 0) { headers = {}; }
        this.method = method;
        this.url = url;
        this.headers = headers;
        this.type = HTTPRequest.HTTP_REQUEST;
    }
    return HTTPRequest;
}());
HTTPRequest.HTTP_REQUEST = "httpRequest";
exports.HTTPRequest = HTTPRequest;
// maintaining the codebase conventions here... >.>
var HTTPResponse = (function () {
    function HTTPResponse(status, headers) {
        if (headers === void 0) { headers = {}; }
        this.status = status;
        this.headers = headers;
        this.type = HTTPResponse.HTTP_RESPONSE;
    }
    return HTTPResponse;
}());
HTTPResponse.HTTP_RESPONSE = "httpResponse";
exports.HTTPResponse = HTTPResponse;
//# sourceMappingURL=messages.js.map