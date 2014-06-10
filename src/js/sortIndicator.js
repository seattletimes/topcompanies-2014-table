(function() {

  var module = angular.module("nw100");

  module.directive("sortIndicator", function() {
    return {
      restrict: "A",
      template: "",
      link: function(scope, element, attrs) {
        var column = attrs.sortIndicator;
        var onChange = function(after, before, $scope) {
          var sorted = $scope.sort;
          element.removeClass("sorted up")
          if (column == sorted) {
            element.addClass("sorted");
            if (!$scope.sortDesc) {
              element.addClass("up")
            }
          }
        };
        scope.$watch("sort", onChange);
        scope.$watch("sortDesc", onChange);
      }
    }
  })

})();