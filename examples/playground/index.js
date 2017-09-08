// used for code editor extensions

exports.getEntryHTML = function({ useFileProtocol = true }) {
  const filePrefix = useFileProtocol ? `file://${__dirname}` : "";
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Aerial view</title>
    <link rel="stylesheet" href="${filePrefix}/lib/front-end/entry.bundle.css"></script>
  </head>
  <body>
    <div id="application"></div>
    <script type="text/javascript" src="${filePrefix}/lib/front-end/entry.bundle.js"></script>
  </body>
</html>
`;
}