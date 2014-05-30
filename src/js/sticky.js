(function() {

  var stuck = $("[sticky]");

  $(window).on("scroll", function() {
    console.log(stuck);
    stuck.removeClass("fixed");
    stuck.each(function(i, element) {
      if (element.getBoundingClientRect().top < 0) {
        $(element).addClass("fixed");
      }
    });
  });

})();