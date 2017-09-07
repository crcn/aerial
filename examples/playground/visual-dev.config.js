

module.exports = {

  port: Number(process.env.PORT || 8080),

  vscode: {
    devServerScript: ["node", "../dev-tools2/lib/back-end/entry.js"] 
  },

  // TODO - possible
  editSourceContent: require("./lib/webpack/edit-ts-content"),
  sourceFilePattern: __dirname + "/src/**/*-preview.tsx",
  webpackConfigPath: __dirname + "/webpack-dev.config.js",
  getEntryIndexHTML: ({ entryName, filePath }) => `
    <html>
      <head>
        <title>${filePath}</title>
        <link rel="stylesheet" href="${entryName}.bundle.css">
      </head>
      <body>
        <div id="mount"></div>
        <script type="text/javascript" src="${entryName}.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react.js"></script>
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/react/15.6.1/react-dom.js"></script>
        <script>
          window.getSourceUri = (uri) => \`\${location.protocol}\/\/\${location.host}/file/\${encodeURIComponent(uri)}\`;
          ReactDOM.render(
            React.createElement(entry.default || entry.Preview),
            document.getElementById("mount")
          );
        </script>
      </body>
    </html>
  `
};