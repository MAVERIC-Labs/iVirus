// Pipeline figure: show a stage's detail card on hover/focus (full figure only).
// Hover uses a short "intent" delay so that sweeping the pointer across other
// stages on the way down to the card doesn't swap the card out from under it.
(function () {
  var DELAY = 220; // ms the pointer must rest on a stage before its card shows
  document.querySelectorAll('[data-pipe="full"]').forEach(function (wrap) {
    var hint = wrap.querySelector('.pipe-hint');
    var cards = wrap.querySelectorAll('[data-stage-card]');
    var nodes = wrap.querySelectorAll('.pipe-node');
    var timer = null, shown = null;
    function show(id) {
      shown = id;
      if (hint) hint.hidden = true;
      cards.forEach(function (c) { c.hidden = c.getAttribute('data-stage-card') !== id; });
      nodes.forEach(function (n) { n.classList.toggle('is-shown', n.getAttribute('data-stage') === id); });
    }
    function cancel() { if (timer) { clearTimeout(timer); timer = null; } }
    nodes.forEach(function (n) {
      var id = n.getAttribute('data-stage');
      n.addEventListener('mouseenter', function () {
        cancel();
        if (shown === null) { show(id); return; }      // first one: no delay
        timer = setTimeout(function () { show(id); }, DELAY);
      });
      n.addEventListener('mouseleave', cancel);
      n.addEventListener('focus', function () { cancel(); show(id); });
    });
  });
})();
