(function() {
  var module = angular.module("nw100");

  var render = function(canvas, data, key, position) {
    var context = canvas.getContext("2d");
    var years = [2009, 2010, 2011, 2012, 2013, 2014];
    if (key == "stock") {
      years = [2008, 2009, 2010, 2011, 2012, 2013];
    } else if (key == "stockDelta") {
      years = [2009, 2010, 2011, 2012, 2013];
    }
    var values = [];
    var items = years.map(function(year) {
      var value = data[year][key];
      if (value) values.push(value);
      return {
        value: value,
        year: year
      }
    });
    var penDown = false;
    var max = Math.max.apply(null, values);
    var min = Math.min.apply(null, values);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.strokeStyle = "#D8761B";
    context.lineWidth = 1.5;
    var padding = 3;
    var top = canvas.height - padding;
    var left = padding;
    var height = canvas.height - padding * 2;
    var width = canvas.width - padding * 2;
    items.forEach(function(item, i) {
      if (!item.value) return;
      var x = width / (years.length - 1) * i + padding;
      var y = top - ((item.value - min) / (max - min) * height);
      context[penDown ? "lineTo" : "moveTo"](x, y);
      penDown = true;
    });
    context.moveTo(0, 0);
    if (penDown) context.stroke();
    context.closePath();
    if (position) {
      context.fillStyle = "rgba(0, 0, 0, .5)";
      context.beginPath();
      var segment = width / (years.length - 1);
      var index = Math.round(position.x / segment);
      var item = items[index];
      var y = top - ((item.value - min) / (max - min) * height);
      context.arc(index * segment + padding, y, 3, 0, Math.PI * 2);
      context.fill();
      return item;
    }
  };

  module.directive("sparkLine", function() {
    return {
      template: document.querySelector("script#spark").innerHTML,
      restrict: "E",
      link: function(scope, element, attrs) {

        var scopeKey = attrs.sparkData;
        var data = scope[scopeKey].data;
        var canvas = element.find("canvas")[0];
        var dataKey;

        scope.$watch("graphOn", function(value) {
          dataKey = value;
          render(canvas, data, dataKey);
        });

        var onmove = function(e) {
          var position;
          if (e.offsetX) {
            position = {
              x: e.offsetX,
              y: e.offsetY
            };
          } else {
            var bounds = canvas.getBoundingClientRect();
            position = {
              x: e.clientX - bounds.left,
              y: e.clientY - bounds.top
            };
          }
          var item = render(canvas, data, dataKey, position);
          var valueText = scope.formatColumn(dataKey, item.value);

          var columnText = scope.$eval(['"', dataKey, '"|strings'].join("")) + "<br>";
          tooltip.show(columnText + item.year + ": " + valueText, { top: e.pageY + 20, left: e.pageX + 10 });

        };

        element.on("mousemove", onmove);
        element.on("click", onmove);
        /*element.on("touchstart", function(e) {
          if (!e.touches) return;
          var touch = e.targetTouches[0];
          onmove(touch);
        });*/

        element.on("mouseout", function(e) {
          render(canvas, data, dataKey);
          tooltip.hide();
        });
      }
    }
  });

})();