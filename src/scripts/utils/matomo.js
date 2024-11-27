function pushPageViewMatomo(title="") {
  if (typeof _paq !== 'undefined') {
    _paq.push(['setDocumentTitle', document.title + "/" + title]);
    _paq.push(['trackPageView']);
  }
}