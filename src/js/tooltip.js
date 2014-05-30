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
      element.html(text);
      element.offset(position);
      element.show();
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