function pushPageViewMatomo(title="") {
  if (typeof _paq !== 'undefined') {
    _paq.push(['setDocumentTitle', document.title + "/" + title]);
    _paq.push(['trackPageView']);
  }
}

function loadMatomo() {
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['disableCookies']);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//matomo.simplipfy.org/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '2']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
}