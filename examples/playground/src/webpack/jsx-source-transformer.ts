import babel = require("babel-core");
import babylon =  require("babylon");
import { Visitor, NodePath } from "babel-traverse";
import sm = require("source-map");
import {
  NullLiteral,
  CallExpression,
  SourceLocation,
  ObjectProperty,
  ObjectExpression,
  Identifier,
  objectProperty,
  objectExpression,
  stringLiteral
} from "babel-types";

declare var module;

// TODO - consider other prefixes here instead of react
module.exports = function(content, contentMap) {
  this.cacheable();
  if (!contentMap) return content;

  const lines = content.split("\n");
  const transformHTMLStrings = true;
  const sourceMapConsumer = new sm.SourceMapConsumer(contentMap);

  function isJSXCall(call: CallExpression) {
    return /^React.createElement/.test(getSourceChunk(call.loc));
  }

  function getSourceChunk(loc: SourceLocation) {
    const chunk = lines.slice(loc.start.line - 1, loc.end.line);
    chunk[0] = chunk[0].substr(loc.start.column);
    chunk[chunk.length - 1] = chunk[chunk.length - 1].substr(0, loc.end.column);
    return chunk.join("\n");
  }

  function transformJSXElementCall(elementCall: CallExpression) {
    const attrArg = elementCall.arguments[1];
    if (attrArg.type === "ObjectExpression") {
      const objExpression = <ObjectExpression>attrArg;
      const originalPosition = sourceMapConsumer.originalPositionFor(elementCall.loc.start);

      const source = {
        kind: null,
        uri: `file://` + originalPosition.source,
        start: {
          line: originalPosition.line,
          column: originalPosition.column,
        },
      };

      // attributes which cannot be edited by Tandem
      const disableAttributes = [];

      for (const property of objExpression.properties) {
        const { key, value } = <ObjectProperty>property;

        if (value.type !== "StringLiteral") {
          disableAttributes.push((<Identifier>key).name);
        }
      }

      if (disableAttributes.length) {
        objExpression.properties.push(
          objectProperty(
            stringLiteral("data-_readonly"),
            stringLiteral(JSON.stringify(disableAttributes))
          )
        );
      }

      objExpression.properties.push(
        objectProperty(
          stringLiteral("data-_source"),
          stringLiteral(JSON.stringify(source))
        )
      );

    // React.createElement("div", null, ["child"]);
    } else if ((attrArg as any).type === "NullLiteral") {
      elementCall.arguments[1] = objectExpression([]);
      transformJSXElementCall(elementCall);
    }
  }


  const tandemPlugin = {
    visitor: <Visitor>{
      CallExpression(path) {
        if (isJSXCall(path.node)) {
          transformJSXElementCall(path.node);
        }
      }
    }
  };

  const contentAST = babylon.parse(content);
  const { code, map, ast } = babel.transformFromAst(contentAST, content, {
    inputSourceMap: contentMap,
    plugins: [tandemPlugin]
  });

  return code;
}