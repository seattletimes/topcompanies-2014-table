(function() {

  if (window.matchMedia && matchMedia("(max-device-width: 1000px)").matches) return;

  var stuck = $("[sticky]");
  var nav = $("nav");
  var top = 0;
  if (nav) {
    top = nav.outerHeight();
  }
  stuck.css("top", top + "px");

  var restick = function() {
    stuck.removeClass("fixed");
    stuck.each(function(i, element) {
      if (element.getBoundingClientRect().top < top) {
        $(element).addClass("fixed");
      }
    });
  };

  $(window).on("scroll resize load", restick);

})();