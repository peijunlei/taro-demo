export function isInApp() {
  const ua = navigator.userAgent || '';
  // Android WebView 特有 wv
  const isAndroidWebView = /wv/.test(ua) && /Android/.test(ua);
  // iOS WebView 可以用 AppleWebKit + !Safari 判断
  const isIOSWebView = /AppleWebKit/.test(ua) && !/Safari/.test(ua);
  return isAndroidWebView || isIOSWebView;
}
