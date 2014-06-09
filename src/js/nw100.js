(function() {

  var module = window.module = angular.module("nw100", []);

  module.controller("TableController", ["$scope", "dataService", function($scope, dataService) {

    $scope.tooltip = tooltip;

    $scope.industries = ["business", "computer", "travel", "consumer", "banking", "insurance", "semiconductors", "manufacturing", "retail", "forest", "utilities", "telecom", "hardware", "personal", "mining", "biotech", "comm"].sort();

    if (window.matchMedia && matchMedia("(max-device-width: 480px)").matches) {
      $scope.columns = [];
      $scope.mobile = true;
    } else {
      $scope.columns = ["roic", "marketCap", "freeCash", "sales", "profit", "profitDelta", "roa", "employees", "pe"];
    }

    $scope.list = [];

    $scope.list = dataService.list;

    $scope.filterBy = "all";
    $scope.industryFilter = function(value) {
      if ($scope.filterBy == "all") return true;
      return value.sector == $scope.filterBy;
    }

    $scope.compareRank = function(item) {
      var comp = "down";
      if (!item.prev || item.rank == item.prev) {
        comp = "same";
      } else if (item.rank > item.prev) {
        comp = "up";
      }
      return comp;
    }

    $scope.formatColumn = function(type, input) {
      input = input || 0;
      var types = {
        pe: "=",
        stock: "$",
        stockDelta: "%%",
        roa: "%",
        roic: "%",
        employees: ",",
        profitDelta: "%"
      }
      type = types[type] || "$$";
      switch(type) {
        case "$$":
          if (input > 1000) {
            var rounded = Math.round(input / 10) / 100;
            var output = rounded.toFixed(1) + " B";
          } else {
            output = input.toFixed(1) + " M";
          }
          return ("$" + output).replace(/\$-/, "-$");
          break;

        case "$":
          return ("$" + input.toFixed(2)).replace(/\$-/, "-$");
          break;

        case "%%":
          input = (input * 100).toFixed(1);
        case "%":
          if (input === 0) return "NM";
          return (input * 1).toFixed(1) + "%";

        case ",":
          var s = input + "";
          var i = s.indexOf(".");
          if (i == -1) i = s.length;
          i -= 3;
          for (; i >= 1; i -= 3) {
            s = s.slice(0, i) + "," + s.slice(i);
          }
          return s;

        default:
          return input;
      }
    }

    $scope.sort = "rank";
    $scope.sortDesc = false;
    $scope.sortOn = function(column) {
      if (column == $scope.sort) {
        $scope.sortDesc = !$scope.sortDesc;
      } else if (column == "rank" || column == "name") {
        $scope.sortDesc = false;
      } else {
        $scope.sortDesc = true;
      }
      $scope.sort = column;
      var desc = $scope.sortDesc ? -1 : 1;
      $scope.list.sort(function(itemA, itemB) {
        var a, b;
        if (column in itemA) {
          a = itemA[column];
          b = itemB[column];
          if (typeof a == "string") a = a.toLowerCase();
          if (typeof b == "string") b = b.toLowerCase();
        } else {
          a = itemA.data[2014][column];
          b = itemB.data[2014][column];
        }
        if (a == b) return itemA.rank - itemB.rank;
        if (a > b) return desc;
        return desc * -1;
      });
    };

    $scope.graphOn = "stock";
    $scope.graphable = ["stock", "stockDelta", "sales", "profit", "marketCap", "roic", "freeCash", ];

  }]);

})();