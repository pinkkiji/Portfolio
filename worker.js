export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === '/') path = '/index.html';

    const assetRequest = new Request(new URL(path, request.url));
    const response = await env.ASSETS.fetch(assetRequest);

    if (!path.endsWith('.html') && path.includes('.')) {
      return response;
    }

    try {
      if (response.status === 404) return new Response('Not Found', { status: 404 });

      const headerFile = await env.ASSETS.fetch(new Request(new URL('/header.html', request.url)));
      const headFile = await env.ASSETS.fetch(new Request(new URL('/head.html', request.url)));
      const pageText = await response.text();
      const headerText = await headerFile.text();
      const headText = await headFile.text();

      const finalHtml = pageText
        .replace('<!-- HEAD -->', headText)
        .replace('<!-- HEADER -->', headerText);

      return new Response(finalHtml, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }
};