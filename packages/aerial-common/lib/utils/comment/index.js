"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseCommentMetadata(name, code) {
    var comments = code.match(/\/\*[\s\S]+?\*\//g) || [];
    var matches = [];
    for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
        var comment = comments_1[_i];
        var match = comment.match(/\/\*\s?(\w+):/);
        if (match && match[1] === name) {
            var json = comment.match(/\/\*\w+:\s*([\s\S]+)\*\//)[1];
            matches.push(JSON.parse(json));
        }
    }
    return matches;
}
exports.parseCommentMetadata = parseCommentMetadata;
//# sourceMappingURL=index.js.map