(function () {
  var input = document.getElementById("search-input");
  var box = document.getElementById("search-results");
  if (!input || !box) return;

  var url = window.SEARCH_JSON_URL || "/search.json";
  var index = [];

  fetch(url)
    .then(function (r) { return r.json(); })
    .then(function (d) { index = d; })
    .catch(function () {});

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function render(q) {
    var kw = q.trim().toLowerCase();
    if (!kw) {
      box.style.display = "none";
      box.innerHTML = "";
      return;
    }
    var matches = [];
    for (var i = 0; i < index.length; i++) {
      var t = (index[i].title || "").toLowerCase();
      var g = (index[i].group || "").toLowerCase();
      if (t.indexOf(kw) !== -1 || g.indexOf(kw) !== -1) {
        matches.push(index[i]);
        if (matches.length >= 20) break;
      }
    }
    if (!matches.length) {
      box.style.display = "block";
      box.innerHTML = '<div class="search-empty">无匹配结果</div>';
      return;
    }
    var html = "";
    for (var j = 0; j < matches.length; j++) {
      var m = matches[j];
      html += '<a class="search-item" href="' + escapeHtml(m.url) + '">' +
        '<span class="search-item-title">' + escapeHtml(m.title) + '</span>' +
        '<span class="search-item-group">' + escapeHtml(m.group || "") + '</span>' +
        '</a>';
    }
    box.style.display = "block";
    box.innerHTML = html;
  }

  input.addEventListener("input", function () { render(input.value); });
  input.addEventListener("focus", function () { render(input.value); });

  document.addEventListener("click", function (e) {
    if (e.target !== input && box && !box.contains(e.target)) {
      box.style.display = "none";
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      box.style.display = "none";
      input.blur();
    }
  });
})();