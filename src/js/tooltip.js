(function() {
  window.tooltip = {
    show: function(text, at) {
      var element = $(".nw100-tooltip");
      if (!element.length) {
        element = $("<div class=nw100-tooltip></div>");
        element.appendTo("body");
      }
      var position;
      if (at.top) {
        position = at;
      } else {
        position = $(at).offset();
        position.top += $(at).height();
      }
      if (position.left > window.innerWidth - 200) {
        position.left -= 120;
      }
      element.offset(position);
      element.html(text);
      element.fadeIn(100);
    },
    hide: function() {
      $(".nw100-tooltip").hide();
    }
  };

  var matches = Element.prototype.matches || Element.prototype.mozMatchesSelector;

  document.body.addEventListener("mousemove", function(e) {
    if (!matches.call(e.target, "[tooltip]")) return;
    tooltip.show(this.getAttribute("alt") || this.getAttribute("title"), this);
  });

  document.body.addEventListener("mouseout", function(e) {
    if (!matches.call(e.target, "[tooltip]")) return;
    tooltip.hide();
  });

})();