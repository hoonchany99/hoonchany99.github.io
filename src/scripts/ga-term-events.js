/* 용어 페이지 GA4 이벤트(화면 변화 없음). BaseLayout이 contentGroup 있을 때만 인라인으로 넣어요.
   글자·검색어는 보내지 않고 id·slug·숫자만 보내요. gtag가 없으면 아무것도 안 해요. */
(function (w, d) {
  function ev(n, p) { if (typeof w.gtag === 'function') w.gtag('event', n, p); }
  function slug(a) { var m = /^\/terms\/([^\/?#]+)\/?$/.exec(a.getAttribute('href') || ''); return m && m[1]; }
  var sent = {}, tick = 0;
  function depth() {
    tick = 0;
    var h = d.documentElement, t = h.scrollHeight;
    if (!t) return;
    var pct = ((w.pageYOffset || h.scrollTop) + h.clientHeight) / t * 100;
    [25, 50, 75].forEach(function (m) {
      if (pct >= m && !sent[m]) { sent[m] = 1; ev('scroll_depth', { percent_scrolled: m }); }
    });
  }
  w.addEventListener('scroll', function () { if (!tick) tick = w.requestAnimationFrame(depth); }, { passive: true });
  d.addEventListener('click', function (e) {
    var g = e.target && e.target.closest && e.target.closest('[data-ga]');
    if (g) return ev(g.getAttribute('data-ga-event'), { placement: g.getAttribute('data-ga') });
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var s;
    if (a.hasAttribute('data-toc-link')) return ev('toc_click', { toc_target: a.getAttribute('data-toc-link') });
    if (!(s = slug(a))) return;
    if (a.closest('#related-terms')) ev('related_term_click', { link_term: s, placement: 'related_card' });
    else if (a.closest('main') && !a.closest('nav')) ev('internal_link_click', { link_term: s, placement: 'body' });
  }, true);
  d.addEventListener('toggle', function (e) {
    var t = e.target, f = t.closest && t.closest('#faq');
    if (!f || t.tagName !== 'DETAILS' || !t.open) return;
    ev('faq_open', { placement: 'faq', faq_index: Array.prototype.indexOf.call(f.querySelectorAll('details'), t) + 1 });
  }, true);
})(window, document);
