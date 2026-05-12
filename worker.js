export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path === '/') path = '/index.html';

    // 1. まず、要求されたファイルをそのまま取得する
    const assetRequest = new Request(new URL(path, request.url));
    const response = await env.ASSETS.fetch(assetRequest);

    // 2. HTMLファイル以外（CSSや画像）なら、そのまま返す
    if (!path.endsWith('.html') && path.includes('.')) {
      return response;
    }

    try {
      if (response.status === 404) return new Response('Not Found', { status: 404 });

      // 3. HTMLの場合のみ置換処理を実行
      const headerFile = await env.ASSETS.fetch(new Request(new URL('/header.html', request.url)));
      const pageText = await response.text();
      const headerText = await headerFile.text();

      // HTML内の を置換
      const finalHtml = pageText.replace('', headerText);

      return new Response(finalHtml, {
        headers: { 'content-type': 'text/html;charset=UTF-8' }
      });
    } catch (e) {
      return new Response('Error: ' + e.message, { status: 500 });
    }
  }
};