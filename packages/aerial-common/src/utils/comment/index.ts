export function parseCommentMetadata(name: string, code: string): any[] {
  const comments = code.match(/\/\*[\s\S]+?\*\//g) || [];

  const matches = [];

  for (const comment of comments) {
    const match = comment.match(/\/\*\s?(\w+):/);
    if (match && match[1] === name) {
      const json = comment.match(/\/\*\w+:\s*([\s\S]+)\*\//)[1];
      matches.push(JSON.parse(json));
    }
  }

  return matches;
}