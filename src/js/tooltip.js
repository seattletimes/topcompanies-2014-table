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

  $("body").on("mousemove", "[tooltip]", function(e) {
    tooltip.show(this.getAttribute("alt") || this.getAttribute("title"), this);
  });

  $("body").on("mouseout", "[tooltip]", tooltip.hide);

})();