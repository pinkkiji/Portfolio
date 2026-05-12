export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === '/') path = '/index.html';
    if (!path.includes('.')) path += '.html';

    try {
      const pageFile = await env.ASSETS.fetch(new Request(new URL(path, request.url)));
      const headerFile = await env.ASSETS.fetch(new Request(new URL('/header.html', request.url)));

      if (pageFile.status === 404) return new Response('Not Found', { status: 404 });

      let pageText = await pageFile.text();
      const headerText = await headerFile.text();

      const finalHtml = pageText.replace('<!-- HEADER -->', headerText);

      return new Response(finalHtml, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }
};
