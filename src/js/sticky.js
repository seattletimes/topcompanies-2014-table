(function() {

  if (window.matchMedia && matchMedia("(max-device-width: 480px)").matches) return;

  var stuck = $("[sticky]");
  var nav = $("nav");
  var top = 0;
  if (nav) {
    top = nav.outerHeight();
  }
  stuck.css("top", top + "px");

  $(window).on("scroll", function() {
    stuck.removeClass("fixed");
    stuck.each(function(i, element) {
      if (element.getBoundingClientRect().top < top) {
        $(element).addClass("fixed");
      }
    });
  });

})();