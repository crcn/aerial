module.exports = {

  // TODO - point to PC
  sourceFilePattern: __dirname + "/src/**/*.tsx",
  webpackConfigPath: __dirname + "/webpack-base.config.js",
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
          const Component = entry.default || entry.Preview;

          if (!Component) {
            throw new Error('"default" or "Preview" not found in module exports.');
          }

          ReactDOM.render(React.createElement(Component), document.getElementById("mount"));

        </script>
      </body>
    </html>
  `
};